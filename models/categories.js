var mongoose = require("mongoose")


var categorySchema = new mongoose.Schema({
	name: String,
	listitems: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "List"
		}
	],
	username: String
});

module.exports = mongoose.model("Category", categorySchema);