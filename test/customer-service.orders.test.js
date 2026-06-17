const path = require('path')
const cds = require('@sap/cds')
const { expected } = require('@sap/cds/lib/log/cds-error')
const { GET, POST, PATCH, DELETE, defaults } = cds.test(
  path.resolve(__dirname, '..')
)
defaults.auth = { username: 'alice' }
defaults.path = '/browse'

describe('Customer service - Orders unit tests', () => {
  const targetOrderId = '99999999-9999-9999-9999-999999999999'

  beforeAll(async () => {
    db = await cds.connect.to('db')
  })

  beforeEach(async () => {
    const { DELETE } = cds.ql

    await DELETE.from(db.entities.Orders).where({ ID: targetOrderId })
  })

  afterEach(async () => {
    const { DELETE } = cds.ql

    await DELETE.from(db.entities.Orders).where({ ID: targetOrderId })
  })

  test('Should create an order, deep insert the items and calculate the total price', async () => {
    const orderObj = {
      customer_ID: '5553542f-4efd-4dd8-b51d-9b15b6f1780e',
      items: [
        {
          product_ID: '60417645-2b7e-430d-9571-3931f7007c14',
          quantity: 8,
          unit_price: 51.66
        },
        {
          product_ID: '60417651-2633-4ead-bf6c-34e52f914ad5',
          quantity: 9,
          unit_price: 65.43
        }
      ],
      status: 'Completed'
    }

    const response = await POST`Orders ${orderObj}`

    expect(response.status).toBe(201)
    expect(response.data.totalPrice).toBe(1002.15)
  })

  test('Should only retrieve orders created by the user', async () => {
    const targetUser = 'alice'

    // insert an order
    await INSERT.into(db.entities.Orders).entries({
      ID: targetOrderId,
      customer_ID: '5553542f-4efd-4dd8-b51d-9b15b6f1780e',
      status: 'pending',
      totalPrice: 150.0,
      createdBy: targetUser,
      createdAt: new Date().toISOString(),
      modifiedBy: targetUser,
      modifiedAt: new Date().toISOString()
    })

    const response = await GET`Orders`

    expect(response.status).toBe(200)

    const orders = response.data.value

    expect(orders.length).toBeGreaterThan(0)

    orders.forEach(order => {
      expect(order.createdBy).toBe(targetUser)
    })
  })

  test('Should not create an order for products exceeding their available stock', async () => {
    const orderObj = {
      customer_ID: '5553542f-4efd-4dd8-b51d-9b15b6f1780e',
      items: [
        {
          product_ID: '60417645-2b7e-430d-9571-3931f7007c14',
          quantity: 8900008,
          unit_price: 51.66
        },
        {
          product_ID: '60417651-2633-4ead-bf6c-34e52f914ad5',
          quantity: 12345569,
          unit_price: 65.43
        }
      ],
      status: 'Completed'
    }

    try {
      const response = await POST`Orders ${orderObj}`
      fail(
        'The server should have blocked this request due to insufficient stock.'
      )
    } catch (error) {
      const response = error.response
      expect(response.data.error.message).toContain('Insufficient stock')
    }
  })

  test('Should not let the customer update the order', async () => {
    const targetUser = 'alice'

    // insert an order
    await INSERT.into(db.entities.Orders).entries({
      ID: targetOrderId,
      customer_ID: '5553542f-4efd-4dd8-b51d-9b15b6f1780e',
      status: 'pending',
      totalPrice: 150.0,
      createdBy: targetUser,
      createdAt: new Date().toISOString(),
      modifiedBy: targetUser,
      modifiedAt: new Date().toISOString()
    })

    // attempt PATCH
    const updatedOrder = {
      status: 'completed',
      totalPrice: 15000.0
    }

    try {
      const response = await PATCH`Orders(${targetOrderId}) ${updatedOrder}`

      fail('The server should have denied the request')
    } catch (error) {
      const response = error.response
      expect(response.status).toBe(403)
    }
  })
})
