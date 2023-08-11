const Developer = require("../models/developer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

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
  res.send("NOT IMPLEMENTED: developer create GET");
});

// Handle developer create on POST.
exports.developer_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer create POST");
});

// Display developer delete form on GET.
exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer delete GET");
});

// Handle developer delete on POST.
exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer delete POST");
});

// Display developer update form on GET.
exports.developer_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer update GET");
});

// Handle developer update on POST.
exports.developer_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: developer update POST");
});
