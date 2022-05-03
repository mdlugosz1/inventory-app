const async = require("async");
const Producer = require("../models/producer");
const Item = require("../models/item");
const Category = require("../models/category");

exports.producers_list = function (req, res, next) {
	Producer.find({}, function (err, results) {
		if (err) {
			return next(err);
		}

		res.render("producers", { title: "List of all producers", data: results, err: err });
	});
};

exports.producer_details = function (req, res, next) {
	async.parallel(
		{
			producer: function (callback) {
				Producer.findOne({ _id: req.params.id }, callback);
			},
			producer_items: function (callback) {
				Item.find({ producer: req.params.id }).populate("category").exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}

			res.render("producer", {
				title: results.producer.name + " details",
				items: results.producer_items,
				err: err,
			});
		}
	);
};
