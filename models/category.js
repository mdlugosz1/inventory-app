const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: { type: String, required: true, minlength: 3, maxlength: 20 },
});

CategorySchema.virtual("url").get(function () {
	return "/category/" + this.name;
});

module.exports = mongoose.model("Category", CategorySchema);