const async = require("async");
const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const Category = require("../models/category");
const Producer = require("../models/producer");
const category = require("../models/category");
const item = require("../models/item");

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

exports.item_form_get = function (req, res, next) {
	async.parallel(
		{
			categories: function (callback) {
				Category.find({}, callback);
			},
			producers: function (callback) {
				Producer.find({}, callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}

			console.log(results);

			res.render("item_form", {
				title: "Add new item",
				categories: results.categories,
				producers: results.producers,
			});
		}
	);
};

exports.item_form_post = [
	body("item_name", "Wrong item name").trim().isLength({ min: 3 }).escape(),
	body("item_price", "Wrong item price").trim().escape(),
	body("item_quantity", "Wrong item quantity").trim().escape(),
	body("category", "Wrong item category").trim(),
	body("producer", "Wrong item producer").trim(),
	body("description", "Wrong item description").trim().isLength({ min: 30 }).escape(),
	(req, res, next) => {
		const item = new Item({
			name: req.body.item_name,
			price: req.body.item_price,
			quantity: req.body.item_quantity,
			category: req.body.category,
			producer: req.body.producer,
			description: req.body.description,
		});
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			async.parallel(
				{
					category: function (callback) {
						Category.find({}, callback);
					},
					producer: function (callback) {
						Producer.find({}, callback);
					},
				},
				function (err, results) {
					if (err) {
						return next(err);
					}

					res.render("item_form", {
						title: "Add new item",
						item: item,
						categories: results.category,
						producers: results.producer,
					});
				}
			);
			return;
		} else {
			item.save((err) => {
				if (err) {
					return next(err);
				}

				res.redirect(item.url);
			});
		}
	},
];

exports.item_delete_get = function (req, res, next) {
	Item.findOne({ _id: req.params.id }, function (err, results) {
		if (err) {
			return next(err);
		}

		res.render("item_delete", { title: "Remove item", item: results });
	});
};

exports.item_delete_post = function (req, res, next) {
	Item.findByIdAndDelete(req.body.itemid, (err) => {
		if (err) {
			return next(err);
		}

		res.redirect("/");
	});
};

exports.item_update_get = function (req, res, next) {
	async.parallel(
		{
			item: function (callback) {
				Item.findById(req.params.id).populate("producer").populate("category").exec(callback);
			},
			categories: function (callback) {
				Category.find({}, callback);
			},
			producers: function (callback) {
				Producer.find({}, callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}

			results.categories.forEach((category) => {
				for (let i = 0; i < results.item.category.length; i++) {
					if (category._id.toString() === results.item.category[i]._id.toString()) {
						category.checked = true;
					}
				}
			});

			res.render("item_form", {
				title: "Update item",
				item: results.item,
				categories: results.categories,
				producers: results.producers,
			});
		}
	);
};

exports.item_update_post = [
	body("item_name", "Wrong item name").trim().isLength({ min: 3 }).escape(),
	body("item_price", "Wrong item price").trim().escape(),
	body("item_quantity", "Wrong item quantity").trim().escape(),
	body("category", "Wrong item category").trim(),
	body("producer", "Wrong item producer").trim(),
	body("description", "Wrong item description").trim().isLength({ min: 30 }).escape(),
	(req, res, next) => {
		const item = new Item({
			_id: req.params.id,
			name: req.body.item_name,
			price: req.body.item_price,
			quantity: req.body.item_quantity,
			category: req.body.category,
			producer: req.body.producer,
			description: req.body.description,
		});
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			async.parallel(
				{
					category: function (callback) {
						Category.find({}, callback);
					},
					producer: function (callback) {
						Producer.find({}, callback);
					},
				},
				function (err, results) {
					if (err) {
						return next(err);
					}

					res.render("item_form", {
						title: "Update item",
						item: item,
						categories: results.category,
						producers: results.producer,
					});
				}
			);
			return;
		} else {
			Item.findByIdAndUpdate(req.params.id, item, {}, (err) => {
				if (err) {
					return next(err);
				}

				res.redirect(item.url);
			});
		}
	},
];
