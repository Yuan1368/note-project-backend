const noteRouter = require("express").Router();
const Note = require("../models/note");

/*noteRouter.get("/", (req, res) => {
	res.send("<h1>Hello world</h1>");
})*/

noteRouter.get("/", async (req, res, next) => {
	try {
		const result = await Note.find({})
		res.json(result);
	}catch(error){
		next(error)
	}
})

noteRouter.get("/:id", async (req, res, next) => {
	const note = await Note.findById(req.params.id)
	try{
		if(note)
			res.json(note);
		else
			res.status(404).end();
	}
	catch(error) {
		next(error)
	}
})

noteRouter.post("/", async (req, res) => {

	if (!req.body.content) {
		res.status(400).json({"content": "error"}).end();
	} else {
		const note = new Note({
			content: req.body.content,
			important: req.body.important || false,
			date: new Date(),
		})

		// 有了 express-async-errors 库后可以完全消除 try-catch 的处理
		// try{
			const savedNote = await note.save();
			res.json(savedNote);
/*		}catch(error){
			next(error);
		}*/


	}
})

noteRouter.delete("/:id", async (req, res, next) => {
	try{
		const result = await Note.findByIdAndRemove(req.params.id);
		res.status(204).end()
	}
	catch(error){
		next(error)
	}
})

noteRouter.put("/:id", async (req, res, next) => {
	let note = {
		content: req.body.content,
		important: req.body.important
	}
	try{
		const result = await Note.findByIdAndUpdate(req.params.id, note, {new: true});
		res.json(result)
	}
	catch(error){
		next(error)
	}
})

module.exports = noteRouter;
