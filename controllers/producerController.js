const async = require("async");
const { body, validationResult } = require("express-validator");
const Producer = require("../models/producer");
const Item = require("../models/item");

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

exports.producer_form_get = function (req, res, next) {
	res.render("producer_form", { title: "Add new producer" });
};

exports.producer_form_post = [
	body("producer_name", "Invalid producer name").trim().escape(),
	(req, res, next) => {
		const producer = new Producer({ name: req.body.producer_name });
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("producer_form", {
				title: "Add new producer",
				producer: producer,
			});
			return;
		} else {
			Producer.findOne({ name: producer.name }, function (err, producer_exist) {
				if (err) {
					return next(err);
				}

				if (producer_exist) {
					res.redirect(producer_exist.url);
				} else {
					producer.save((err) => {
						if (err) {
							return next(err);
						}

						res.redirect(producer.url);
					});
				}
			});
		}
	},
];
