const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

if(process.argv.length<3){
	console.log("请提供密码");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://lance:${password}@cluster0.51uag.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content:String,
	important: Boolean,
	date: Date
})

const Note = mongoose.model('Note', noteSchema);

Note
	.find({})
	.then(res=>{
		console.log(res);
		mongoose.connection.close();
	})

/*
const note = new Note({
	content: "new note",
	important: false,
	date: new Date()
})

note.save().then(
	(res)=>{
		console.log('note saved!');
		mongoose.connection.close();
})*/

app.use(express.static("build"));
app.use(cors());

app.use(express.json());

// 定义一个中间件处理 打印请求日志
const requestLogger = (req,res, next)=>{
	console.log("path:", req.path);
	console.log("method", req.method);
	console.log("body", req.body);
	next();
}

app.use(requestLogger);



let notes = [
		{
			"id": 1,
			"content": "HTML is easy",
			"date": "2019-05-30T17:30:31.098Z",
			"important": true
		},
		{
			"id": 2,
			"content": "Browser can execute only JavaScript",
			"date": "2019-05-30T18:39:34.091Z",
			"important": true
		},
		{
			"id": 3,
			"content": "GET and POST are the most important methods of HTTP protocol",
			"date": "2019-05-30T19:20:14.298Z",
			"important": false
		},
		{
			"content": "new Note",
			"date": "2022-01-07T08:13:20.132Z",
			"important": false,
			"id": 4
		}
	]

app.get("/", (req, res) => {
	res.send("<h1>Hello world</h1>");
})

app.get("/api/notes", (req, res) => {
	res.send(notes);
})

app.get("/api/notes/:id",(req,res)=>{
	const note = notes.find(note=>note.id===Number(req.params.id))
	res.json(note);
})

app.delete("/api/notes/:id",(req,res)=>{
	notes = notes.filter(note=>note.id!==Number(req.params.id));
	res.status(202).end();
})

const generateId = ()=>{
	let maxId  = notes.length?Math.max(...notes.map(note=>note.id)):0;
	return maxId + 1;
}

app.post("/api/notes",(req,res)=>{

	if(!req.body.content){
		res.status(400).json({"content":"error"}).end();
	}else{
		const note = {
			content: req.body.content,
			important: req.body.important||false,
			date: new Date().toISOString(),
			id:generateId()
		}

		notes = [...notes, note];
		res.json(note)
	}
})

const unknownEndPoint = (req, res)=>{
	res.status(404).send({"content":"error"}).end();
}

app.use(unknownEndPoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
