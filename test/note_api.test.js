const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const Note = require("../models/note")
const api = supertest(app)

beforeEach(async ()=>{
	await Note.deleteMany({})
	let noteObject = new Note(helper.initialNotes[0]);
	await noteObject.save();
	noteObject = new Note(helper.initialNotes[1]);
	await noteObject.save();
})

test('all notes are returned', async () => {
	const response = await api.get('/api/notes')

	expect(response.body).toHaveLength(initialNotes.length)
})

test("a specific note is within the returned notes", async () => {
	const response = await api.get("/api/notes")

	const contents = response.body.map(r => r.content)
	expect(contents).toContain(
		'Browser can execute only Javascript'
	)
})

test('notes are returned as json', async ()=>{
	await api
		.get('/api/notes')
		.expect(200)
		.expect("Content-Type", /application\/json/)
})

test("there are two notes", async ()=>{
	const response = await api.get("/api/notes");
	expect(response.body).toHaveLength(2);
})

test("the first note is about HTTP methods", async ()=>{
	const response = await api.get("/api/notes");
	expect(response.body[0]).toBe("new Note")
})

test("a new note is added", async ()=>{
	const newNote = {
		content: "a note as example",
		important: true
	}

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const notesAtEnd = await helper.notesInDb()
	expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

	const contents = notesAtEnd.map(n => n.content)
	expect(contents).toContain(
		'HTML is easy'
	)

})

test("a new note is not added", async ()=>{
	const newNote = {
		// content: "a note as example",
		important: true
	}

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(400)

	const notesAtEnd = await helper.notesInDb()

	expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

afterAll(() => {
	mongoose.connection.close()
})