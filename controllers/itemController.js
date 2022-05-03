const async = require("async");

const Item = require("../models/item");
const Category = require("../models/category");
const Producer = require("../models/producer");

exports.index = function (req, res, next) {
	async.parallel(
		{
			item_count: function (callback) {
				Item.countDocuments({}, callback);
			},
			category_count: function (callback) {
				Category.countDocuments({}, callback);
			},
			producer_count: function (callback) {
				Producer.countDocuments({}, callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			res.render("index", {
				title: "In our inventory we currently have:",
				data: results,
				err: err,
			});
		}
	);
};

exports.item_list = function (req, res, next) {
	Item.find({})
		.sort({ name: 1 })
		.populate("category")
		.populate("producer")
		.exec(function (err, results) {
			if (err) {
				return next(err);
			}
			res.render("items", { title: "List of all items", data: results, err: err });
		});
};

exports.item_details = function (req, res, next) {
	const itemId = req.params.id;

	Item.findOne({ _id: itemId })
		.populate("category")
		.populate("producer")
		.exec(function (err, results) {
			if (err) {
				return next(err);
			}
			res.render("item-details", { title: "Item details", data: results, err: err });
		});
};
