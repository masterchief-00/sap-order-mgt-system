const cds = require('@sap/cds')
const { INSERT } = require('@sap/cds/lib/ql/cds-ql')
const { SELECT } = cds.ql

module.exports = class CustomerService extends cds.ApplicationService {
  async init () {
    const { Orders, Products } = this.entities

    this.before(['CREATE', 'UPDATE'], Orders, async req => {
      const order = req.data

      if (!Array.isArray(order.items) || order.items.length === 0) return

      const requestedItemsID = order.items
        .map(item => item.product_ID)
        .filter(Boolean)

      if (requestedItemsID.length === 0) return

      let computedTotal = 0
      const requestedItemsDb = await SELECT.from(Products)
        .columns('ID', 'title', 'stock')
        .where({ ID: { in: requestedItemsID } })

      const inventoryMap = Object.fromEntries(
        requestedItemsDb.map(item => [item.ID, item])
      )

      for (const item of order.items) {
        const dbItem = inventoryMap[item.product_ID]

        if (!dbItem) {
          return req.error(400, `Product ${item.product_ID} does not exist`)
        }

        if (dbItem.stock < (item.quantity || 0)) {
          return req.error(
            400,
            `Insufficient stock for product ${dbItem.title}`
          )
        }

        if (item.quantity && item.unit_price) {
          computedTotal += item.unit_price * item.quantity
        }
      }

      order.totalPrice = computedTotal.toFixed(2)
    })

    return super.init()
  }
}
