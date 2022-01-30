const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const Note = require("../models/note")
const {initialNotes} = require("./test_helper");
const api = supertest(app)

beforeEach(async ()=>{
	await Note.deleteMany({})
	helper.initialNotes.forEach(async note => {
		let noteObject = new Note(note);
		await noteObject.save()
		console.log("saved")
	})
	console.log("done");
})

describe('when there is initially some notes saved', () => {
	test('notes are returned as json', async ()=>{
		await api
			.get('/api/notes')
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test('all notes are returned', async () => {
		const response = await api.get('/api/notes')
		expect(response.body).toHaveLength(helper.initialNotes.length)
	})

	test("a specific note is within the returned notes", async () => {
		const response = await api.get("/api/notes")
		const contents = response.body.map(r => r.content)
		expect(contents).toContain(
			'Browser can execute only Javascript'
		)
	})
})

describe('viewing a specific note', () => {
	test('succeeds with a valid id', async () => {
		const notesAtStart = await helper.notesInDb();
		const noteToView = notesAtStart[0]

		const resultNote = await api
			.get(`/api/notes/${noteToView.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/)

		const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
		expect(resultNote.body).toEqual(processedNoteToView)
	})

	test('fails with statuscode 404 if note does not exist', async () => {
		const validNonexistingId = await helper.nonExistingId()

		console.log(validNonexistingId)

		await api
			.get(`/api/notes/${validNonexistingId}`)
			.expect(404)
	})

	test('fails with statuscode 400 id is invalid', async () => {
		const invalidId = "4abdfdeg1a3c"

		await api
			.get(`/api/notes/${invalidId}`)
			.expect(400)
	})
})

describe('addition of a new note', () => {
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
			'a note as example'
		)
	})

	test("fails with status code 400 if data invalid", async ()=>{
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
})

describe('deletion of a note', () => {
	test('a note can be deleted', async () => {
		const notesAtStart = await helper.notesInDb()
		const noteToDelete = notesAtStart[0];

		await api
			.delete(`/api/notes/${noteToDelete.id}`)
			.expect(204)

		const notesAtEnd = await helper.notesInDb()

		expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

		const contents = notesAtEnd.map(n=>n.content)
		expect(contents).not.toContain(noteToDelete.content)
	})
})

/*test("there are two notes", async ()=>{
	const response = await api.get("/api/notes");
	expect(response.body).toHaveLength(2);
})

/!*test("the first note is about HTTP methods", async ()=>{
	const response = await api.get("/api/notes");
	expect(response.body[0]).toBe("new Note")
})*!/

test("a specific not be viewed", async () => {
	const notesAtStart = await helper.notesInDb();

	const noteToVidew = notesAtStart[0]

	const resultNote = await api
		.get(`/api/notes/${noteToVidew.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const processedNoteToView = JSON.parse(JSON.stringify(noteToVidew))
	expect(resultNote.body).toEqual(processedNoteToView)
})*/

afterAll(() => {
	mongoose.connection.close()
})