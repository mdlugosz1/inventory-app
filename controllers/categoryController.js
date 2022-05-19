const async = require("async");
const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

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

exports.category_create_get = function (req, res) {
	res.render("category_form", { title: "Create new category" });
};

exports.category_create_post = [
	body("cat_name", "Invalid category name").trim().isLength({ min: 3 }).escape(),
	(req, res, next) => {
		const category = new Category({ name: req.body.cat_name });
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("category_form", { title: "Add new category", category: category });
			return;
		} else {
			Category.findOne({ name: category.name }, function (err, category_exist) {
				if (err) {
					return next(err);
				}

				if (category_exist) {
					res.redirect(category_exist.url);
				} else {
					category.save((err) => {
						if (err) {
							return next(err);
						}

						res.redirect(category.url);
					});
				}
			});
		}
	},
];

exports.category_delete_get = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findOne({ _id: req.params.id }, callback);
			},
			items: function (callback) {
				Item.find({ category: req.params.id }, callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}

			res.render("category_delete", {
				title: "Deleting category category",
				category: results.category,
				items: results.items,
			});
		}
	);
};

exports.category_delete_post = function (req, res, next) {
	Category.findByIdAndDelete(req.body.categoryid, function (err) {
		if (err) {
			return next(err);
		}

		res.redirect("/");
	});
};

exports.category_update_get = function (req, res, next) {
	Category.findOne({ _id: req.params.id }, function (err, results) {
		if (err) {
			return next(err);
		}

		res.render("category_form", { title: "Update category", category: results });
	});
};

exports.category_update_post = [
	body("cat_name").trim().isLength({ min: 3 }).escape(),
	(req, res, next) => {
		const category = new Category({
			_id: req.params.id,
			name: req.body.cat_name,
		});

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("category_form", { title: "Update category", category: category });
			return;
		} else {
			Category.findByIdAndUpdate(req.params.id, category, {}, function (err, results) {
				if (err) {
					return next(err);
				}

				res.redirect(results.url);
			});
		}
	},
];
