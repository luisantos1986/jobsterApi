const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const updateUser = async (req, res) => {
  const {userId} = req.user

  const { email, name, lastName, location} = req.body
  console.log(req.user)
  if (!email || !name|| !lastName || !location) {
    throw new BadRequestError('Some values are missing')
  }
  const user = await User.findOne({_id: userId})

  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ 
    user: { 
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token
    } })

}
const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ 
    user: { 
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token
    } })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  console.log('se encontro user')
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  console.log('comparando password');
  const isPasswordCorrect = await user.comparePassword(password)
  console.log(`Is Password correct ${isPasswordCorrect}`)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  console.log('se comparo password');
  // compare password
  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ 
    user: { 
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token
    } })
}

module.exports = {
  register,
  login,
  updateUser
}
