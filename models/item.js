const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true, minlength: 30 },
	price: { type: Number, required: true },
	category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
	producer: { type: Schema.Types.ObjectId, ref: "Producer" },
	quantity: Number,
});

ItemSchema.virtual("url").get(function () {
	return "/item/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
