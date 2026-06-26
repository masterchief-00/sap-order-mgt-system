module.exports = class CustomerService extends cds.ApplicationService {
  async init () {
    const { Reviews, User } = this.entities

    this.before('READ', req => {
      if (req.query && req.query.SELECT) {
        const query = req.query.SELECT

        if (req.target && req.target.name !== 'FioriAdminService.Products')
          return

        // const url = req._?.req?.url ?? req.http?.req?.url ?? ''

        // const isAggregationQuery = url.includes('$apply')

        const isAggregationQuery = !!req.query.SELECT.groupBy

        if (!isAggregationQuery) {
          if (!query.columns) query.columns = ['*']
          const hasReviews = query.columns.some(
            col => col.ref && col.ref[0] === 'reviews'
          )

          if (!hasReviews) {
            query.columns.push({ ref: ['reviews'], expand: ['*'] })
          }
        }
      }
    })

    this.before('READ', 'Orders', req => {
      if (req.query && req.query.SELECT) {
        const query = req.query.SELECT

        if (req.target && req.target.name !== 'FioriAdminService.Orders') return

        if (!query.columns) query.columns = ['*']
        const hasItems = query.columns.some(
          col => col.ref && col.ref[0] === 'items'
        )

        if (!hasItems) {
          query.columns.push({ ref: ['items'], expand: ['*'] })
        }
      }
    })

    this.after('READ', 'Orders', (data, req) => {
      if (req.target && req.target.name !== 'FioriAdminService.Orders') return

      const orders = Array.isArray(data) ? data : [data]
      for (const order of orders) {
        if (order.items.length > 0) {
          order.itemsCount = order.items.length
        } else {
          order.itemsCount = 0
        }
      }
    })

    this.after('READ', 'Products', async (data, req) => {
      if (req.target && req.target.name !== 'FioriAdminService.Products') return

      // const url = req._?.req?.url ?? req.http?.req?.url ?? ''

      // const isAggregationQuery = url.includes('$apply')

      const isAggregationQuery = !!req.query.SELECT.groupBy

      if (isAggregationQuery) return

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
            (sum, review) => sum + Number(review.rating),
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

    this.after('READ', User, async (eachUser, req) => {
      const users = Array.isArray(eachUser) ? eachUser : [eachUser]

      if (users.length === 0) return

      const userIDs = users.map(u => u.ID)

      const reviewCounts = await cds.run(
        SELECT.from('Products.reviews')
          .columns(
            'reviewer_ID as userID',
            'count(1) as cnt',
            'avg(rating) as rating'
          )
          .where({ reviewer_ID: { in: userIDs } })
          .groupBy('reviewer_ID')
      )

      const orderRevenues = await cds.run(
        SELECT.from('Orders')
          .columns(
            'customer_ID as userID',
            'count(1) as cnt',
            'sum(totalPrice) as revenue'
          )
          .where({ customer_ID: { in: userIDs } })
          .groupBy('customer_ID')
      )

      const orderCounts = await cds.run(
        SELECT.from('Orders as O')
          .columns(
            'O.customer_ID as userID',
            'count(distinct O.ID) as cnt',
            'count(O.items.ID) as totalLineItems'
          )
          .where({ customer_ID: { in: userIDs } })
          .groupBy('customer_ID')
      )

      const reviewMap = new Map(
        reviewCounts.map(r => [r.userID, { cnt: r.cnt, rating: r.rating || 0 }])
      )

      const orderRevenueMap = new Map(
        orderRevenues.map(o => [o.userID, { cnt: o.cnt, revenue: o.revenue }])
      )

      const orderMap = new Map(
        orderCounts.map(o => [
          o.userID,
          {
            cnt: o.cnt,
            avgItems: o.cnt > 0 ? o.totalLineItems / o.cnt : 0
          }
        ])
      )

      for (const user of users) {
        const reviewsData = reviewMap.get(user.ID)
        user.reviewsCount = reviewsData ? reviewsData.cnt : 0
        user.avgRating = reviewsData ? reviewsData.rating.toFixed(1) : 0

        const ordersRevData = orderRevenueMap.get(user.ID)
        const ordersData = orderMap.get(user.ID)
        user.ordersCount = ordersData ? ordersData.cnt : 0
        user.totalRevenue = ordersRevData ? ordersRevData.revenue : 0
        user.avgItemsPerOrder = ordersData ? ordersData.avgItems : 0
      }
    })

    return super.init()
  }
}
