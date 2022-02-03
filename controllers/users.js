const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.post("/", async (req, res, next)=>{
	const body = req.body;

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash
	})

	const savedUser = await user.save()
	res.json(savedUser)
})

usersRouter.get("/", async (req, res, next)=>{
	const users = await User.find({})
	res.json(users)
})

module.exports = usersRouter