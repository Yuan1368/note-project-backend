const bcrypt = require("bcrypt")
const supertest = require("supertest")
const User = require("../models/user")
const helper = require("./test_helper");
const app = require("../app")
const api = supertest(app)

describe("when there is initially one user in db", () => {
	beforeEach(async ()=>{
		await User.deleteMany({})

		const passwordHash = bcrypt.hash("sekret", 10)

		const user = new User({name: "root", passwordHash})

		await user.save()
	})

	test("creation fails with proper statuscode and message if username already taken", async ()=>{
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salainen"
		}

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(404)
			.expect("Content-Type", /application\/json/)

		expect(result.body.error).toContain('`username` to be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

		/*
		const usernames = usersAtEnd.map(user => user.username)
		expect(usernames).toContain(newUser.username)*/
	})



})