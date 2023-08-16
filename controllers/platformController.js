const Platform = require("../models/platform");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all platform.
exports.platform_list = asyncHandler(async (req, res, next) => {
  const allPlatforms = await Platform.find().sort({ name: 1 }).exec();

  res.render("platform_list", {
    title: "List of Platforms",
    platform_list: allPlatforms,
  });
});

// Display detail page for a specific platform.
exports.platform_detail = asyncHandler(async (req, res, next) => {
  // Get details of platform and all associated games
  const [platform, gamesOnPlatform] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    Game.find({ platform: req.params.id }, "title summary")
      .sort({ title: 1 })
      .exec(),
  ]);
  if (platform === null) {
    // No results
    const err = new Error("Platform not found");
    err.status = 404;
    return next(err);
  }

  res.render("platform_detail", {
    title: "Platform Detail",
    platform: platform,
    platform_games: gamesOnPlatform,
  });
});

// Display platform create form on GET.
exports.platform_create_get = asyncHandler(async (req, res, next) => {
  res.render("platform_form", { title: "Create Platform" });
});

// Handle platform create on POST.
exports.platform_create_post = [
  // Validate and sanitize the name field
  body("name", "Platform must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    // Create a platform object with escaped and trimmed data
    const platform = new Platform({ name: req.body.name });
    if (!errors.isEmpty()) {
      // There are errors; render the form again with sanitized values/error messages
      res.render("platform_form", {
        title: "Create Platform",
        platform: platform,
        errors: errors.array(),
      });
    } else {
      // Data is valid; check if platform with same name already exists
      const platformExists = await Platform.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (platformExists) {
        res.redirect(platformExists.url);
      } else {
        await platform.save();
        res.redirect(platform.url);
      }
    }
  }),
];

// Display platform delete form on GET.
exports.platform_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: platform delete GET");
});

// Handle platform delete on POST.
exports.platform_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: platform delete POST");
});

// Display platform update form on GET.
exports.platform_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: platform update GET");
});

// Handle platform update on POST.
exports.platform_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: platform update POST");
});
