module.exports = class CustomerService extends cds.ApplicationService {
  async init () {
    const { Reviews } = this.entities

    this.before('READ', req => {
      if (req.query && req.query.SELECT) {
        const query = req.query.SELECT
        if (!query.columns) query.columns = ['*']
        const hasReviews = query.columns.some(
          col => col.ref && col.ref[0] === 'reviews'
        )

        if (!hasReviews) {
          query.columns.push({ ref: ['reviews'], expand: ['*'] })
        }
      }
    })

    this.after('READ', 'Products', async (data, req) => {
      const products = Array.isArray(data) ? data : [data]
      for (const product of products) {
        // stock criticality
        if (product.stock === 0) product.stockCriticality = 1 // Red
        else if (product.stock <= 10) product.stockCriticality = 2 // Yellow
        else product.stockCriticality = 3 // Green

        const productReviews = product.reviews

        if (productReviews.length > 0) {
          product.reviewCount = productReviews.length
          const totalRatingScore = productReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          )
          const average = totalRatingScore / productReviews.length

          product.averageRating = Math.round(average * 10) / 10
        } else {
          product.reviewCount = 0
          product.averageRating = 0
        }
      }
    })

    return super.init()
  }
}
