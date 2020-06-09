var mongoose = require("mongoose") 
var listSchema = new mongoose.Schema({
	tasks: String
})
module.exports = mongoose.model("List", listSchema);
