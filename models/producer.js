const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProducerSchema = new Schema({
	name: { type: String, required: true },
});

ProducerSchema.virtual("url").get(function () {
	return "/producer/" + this.name;
});

module.exports = mongoose.model("Producer", ProducerSchema);
