const async = require("async");
const Category = require("../models/category");
const Item = require("../models/item");

exports.categories_list = function (req, res, next) {
	Category.find({}).exec(function (err, results) {
		if (err) {
			return next(err);
		}

		res.render("categories", { title: "Categories list", data: results, err: err });
	});
};

exports.category_details = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findOne({ _id: req.params.id }).exec(callback);
			},
			item_list: function (callback) {
				Item.find({ category: req.params.id }, callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}

			res.render("category", {
				title: "Category details",
				category: results.category,
				items: results.item_list,
				err: err,
			});
		}
	);
};
