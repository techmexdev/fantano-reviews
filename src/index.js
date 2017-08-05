const fetchTNDReviews = require('./fetchTNDReviews')
const reviewsSeed = require('../data/seed/tndChannelReviews')

fetchTNDReviews()
  .then(console.log)

console.log(reviewsSeed)
