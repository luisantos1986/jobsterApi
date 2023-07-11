const { BadRequestError } = require('../errors')

const testUser = (req, res, next) => {
  const { testUser } = req.user
  if (testUser) {
    throw new BadRequestError('Test user is read only')
  }
  next()
}

module.exports = testUser
