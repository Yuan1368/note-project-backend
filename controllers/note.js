const noteRouter = require("express").Router();
const Note = require("../models/note");

noteRouter.get("/", (req, res) => {
	res.send("<h1>Hello world</h1>");
})

noteRouter.get("/api/notes", (req, res) => {
	Note.find({}).then(result=>{
		res.json(result);
	})
})

noteRouter.get("/api/notes/:id",(req,res, next)=>{
	Note.findById(req.params.id).then(note=>{
		if(note)
			res.json(note);
		else{
			res.status(404).end();
		}
	}).catch(error=>{
		next(error)
	})
})

noteRouter.post("/api/notes",(req,res)=>{

	if(!req.body.content){
		res.status(400).json({"content":"error"}).end();
	}else{
		const note = new Note({
			content: req.body.content,
			important: req.body.important||false,
			date: new Date(),
		})

		note
			.save()
			.then(savedNote=>{
				res.json(savedNote);
			})
	}
})

noteRouter.delete("/api/notes/:id", (req, res, next) => {
	Note.findByIdAndRemove(req.params.id)
		.then(result=>{
			res.status(204).end()
		})
		.catch(error => {
			next(error)
		})
})

noteRouter.put("/api/notes/:id", (req, res, next)=> {
	let note = {
		content: req.body.content,
		important: req.body.important
	}

	Note
		.findByIdAndUpdate(req.params.id, note, {new: true})
		.then(result=>{
			res.json(result)
		})
		.catch(error=>{
			next(error)
		})
})

module.exports = noteRouter;
