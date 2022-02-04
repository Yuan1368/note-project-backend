const mongoose = require("mongoose");
const url = require("../utils/config").MONGODB_URI;
const uniqueValidator = require("mongoose-unique-validator");

mongoose
	.connect(url)
	.then(res=>{
		console.log("connected ok")
	})
	.catch(error=>{
		console.log("error",error.message);
	})

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true
	},
	date:{
		type: Date,
	},
	important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
})

noteSchema.plugin(uniqueValidator)

noteSchema.set('toJSON',{
	transform: (document, returnedObject)=>{
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model("Note", noteSchema);



