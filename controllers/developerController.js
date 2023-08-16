const Developer = require("../models/developer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all developers.
exports.developer_list = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Developer.find().sort({ title: 1 }).exec();

  res.render("developer_list", {
    title: "List of Developers",
    developer_list: allDevelopers,
  });
});

// Display detail page for a specific developer.
exports.developer_detail = asyncHandler(async (req, res, next) => {
  const [developer, allGamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, "title summary")
      .sort({ releaseYear: 1 })
      .exec(),
  ]);
  if (developer === null) {
    // No results
    const err = new Error("Developer not found");
    err.status = 404;
    return next(err);
  }

  res.render("developer_detail", {
    title: "Developer Detail",
    developer: developer,
    developer_games: allGamesByDeveloper,
  });
});

// Display developer create form on GET.
exports.developer_create_get = asyncHandler(async (req, res, next) => {
  res.render("developer_form", { title: "Create Developer" });
});

// Handle developer create on POST.
exports.developer_create_post = [
  // Validate and sanitize fields
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title of development company must be specified"),
  body("summary")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Summary must be specified"),
  body("locationCity")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage(
      "City where development company was founded must be specified"
    ),
  body("locationCountry")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage(
      "Country where development company was founded must be specified"
    ),
  body("founded")
    .trim()
    .isLength({ min: 1, max: 4 })
    .escape()
    .withMessage("Year development company was founded must be specified"),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    // Create Developer object with escaped and trimmed data
    const developer = new Developer({
      title: req.body.title,
      summary: req.body.summary,
      locationCity: req.body.locationCity,
      locationCountry: req.body.locationCountry,
      founded: req.body.founded,
    });
    if (!errors.isEmpty()) {
      // There are errors; render form again with sanitized values/error messages
      res.render("developer_form", {
        title: "Create Developer",
        developer: developer,
        errors: errors.array(),
      });
      return;
    } else {
      await developer.save();
      res.redirect(developer.url);
    }
  }),
];

// Display developer delete form on GET.
exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  const [developer, allGamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, "title summary").exec(),
  ]);
  if (developer === null) {
    res.redirect("/catalog/developers");
  }

  res.render("developer_delete", {
    title: "Delete Developer",
    developer: developer,
    developer_games: allGamesByDeveloper,
  });
});

// Handle developer delete on POST.
exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  const [developer, allGamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, "title summary").exec(),
  ]);
  if (allGamesByDeveloper.length > 0) {
    res.render("developer_delete", {
      title: "Delete Developer",
      developer: developer,
      developer_games: allGamesByDeveloper,
    });
    return;
  } else {
    await Developer.findByIdAndRemove(req.body.developerid);
  }
});

// Display developer update form on GET.
exports.developer_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer update GET");
});

// Handle developer update on POST.
exports.developer_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer update POST");
});
