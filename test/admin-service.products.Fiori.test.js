const path = require('path')
const cds = require('@sap/cds')
const { expected } = require('@sap/cds/lib/log/cds-error')
const { GET, POST, PATCH, DELETE, defaults } = cds.test(
  path.resolve(__dirname, '..')
)
defaults.auth = { username: 'alice' }
defaults.path = '/fiori/admin'

describe('Admin service - Fiori - Users unit tests', () => {
  test('Should retrieve all products with the 3 virtual columns attached', async () => {
    const response =
      await GET`Products? $select=ID,title,reviewCount,averageRating,stockCriticality`

    expect(response.status).toBe(200)

    expect(response.data.value).toBeDefined()

    const productsRetrieved = response.data.value
    expect(productsRetrieved.length).toBeGreaterThan(0)
    expect(productsRetrieved[0].reviewCount).toBeDefined()
    expect(productsRetrieved[0].averageRating).toBeDefined()
    expect(productsRetrieved[0].stockCriticality).toBeDefined()
  })
})
