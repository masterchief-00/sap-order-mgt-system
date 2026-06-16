const cds = require('@sap/cds')
const { SELECT } = cds.ql

module.exports = class CustomerService extends cds.ApplicationService {
  async init () {
    const { Orders, Products } = this.entities

    this.before(['CREATE', 'UPDATE'], Orders, async req => {
      const items = req.data.items

      console.log('STARTED!!', items)

      if (!Array.isArray(items) || items.length === 0) return

      const requestedItemsID = items
        .map(item => item.product_ID)
        .filter(Boolean)

      if (requestedItemsID.length === 0) return

      const requestedItemsDb = await SELECT.from(Products)
        .columns('ID', 'title', 'stock')
        .where({ ID: { in: requestedItemsID } })

      const inventoryMap = Object.fromEntries(
        requestedItemsDb.map(item => [item.ID, item])
      )

      for (const item of items) {
        const dbItem = inventoryMap[item.product_ID]

        if (!dbItem) {
          return req.reject(400, `Product ${item.product_ID} does not exist`)
        }

        if (dbItem.stock < (item.quantity || 0)) {
          return req.reject(
            400,
            `Insufficient stock for product ${dbItem.title}`
          )
        }
      }
    })

    return super.init()
  }
}
