const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose
	.connect(url)
	.then(res=>{
		console.log("connected ok")
	})
	.catch(error=>{
		console.log("error",error.message);
	})

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
	date: Date
})

noteSchema.set('toJSON',{
	transform: (document, returnedObject)=>{
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model("Note", noteSchema);



