const path = require('path')
const cds = require('@sap/cds')
const { GET, POST, PATCH, DELETE, defaults } = cds.test(
  path.resolve(__dirname, '..')
)

defaults.auth = { username: 'alice' }
defaults.path = '/admin'

describe('Admin service - products unit tests', () => {
  let generatedBookId

  test('Should retrieve all products', async () => {
    const response = await GET`Products? $select=ID,title`

    expect(response.status).toBe(200)
    expect(response.data.value).toBeDefined()
  })

  test('Should create a product & its reviews via deep insert ', async () => {
    const productObj = {
      title: 'Lenovo Legion 5 Pro',
      description:
        'A high end gaming laptop with RTX 3070, 16 GB RAM, 2022 model',
      price: 1800,
      stock: 14,
      expiryDate: '2027-10-28',
      reviews: [
        {
          reviewer_ID: '2103706e-498d-482e-846b-8329d4cb8699',
          rating: 4.0,
          comment: 'Works alright'
        },
        {
          ID: '26510835-6204-4094-ac24-5c60c632bc80',
          reviewer_ID: '2103706e-498d-482e-846b-8329d4cb8699',
          rating: 2.0,
          comment: 'Arrived with a faulty battery'
        }
      ]
    }

    const response = await POST`Products ${productObj}`

    generatedBookId = response?.data?.ID
    const createdReviews = response?.data?.reviews

    expect(response.status).toBe(201)
    expect(response.data.title).toBe('Lenovo Legion 5 Pro')
    expect(Array.isArray(createdReviews)).toBe(true)
    expect(createdReviews?.length).toBe(2)
  })

  test('Should deep load a product whenever the $expand parameter is specified', async () => {
    expect(generatedBookId).toBeDefined()

    const response = await GET`Products(${generatedBookId})?$expand=reviews`

    expect(response.status).toBe(200)
    expect(response.data.title).toBe('Lenovo Legion 5 Pro')
    expect(response.data.reviews.length).toBe(2)
    expect(response.data.reviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ comment: 'Works alright' })
      ])
    )
  })

  test('Should update a product', async () => {
    const productObj = {
      title: 'Lenovo Legion 5 Pro',
      description:
        'A high end gaming laptop with RTX 3070, 16 GB RAM, 2022 model',
      price: 1400,
      stock: 9,
      expiryDate: '2027-10-28',
      reviews: [
        {
          reviewer_ID: '2103706e-498d-482e-846b-8329d4cb8699',
          rating: 4.0,
          comment: 'Works alright'
        },
        {
          ID: '26510835-6204-4094-ac24-5c60c632bc80',
          reviewer_ID: '2103706e-498d-482e-846b-8329d4cb8699',
          rating: 2.0,
          comment: 'Arrived with a faulty battery'
        }
      ]
    }

    expect(generatedBookId).toBeDefined()

    const response = await PATCH`Products(${generatedBookId}) ${productObj}`

    expect(response.status).toBe(200)
    expect(response.data.title).toBe('Lenovo Legion 5 Pro')
    expect(response.data.stock).toBe(9)
    expect(response.data.price).toBe(1400)
  })

  test('Should delete a product and return 204', async () => {
    expect(generatedBookId).toBeDefined()

    const response = await DELETE`Products(${generatedBookId})`

    expect(response.status).toBe(204)
  })
})
