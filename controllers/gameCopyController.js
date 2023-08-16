const GameCopy = require("../models/gameCopy");
const Game = require("../models/game");
const Platform = require("../models/platform");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all gamecopies.
exports.gamecopy_list = asyncHandler(async (req, res, next) => {
  const allGameCopies = await GameCopy.find()
    .sort({ title: 1 })
    .populate("game")
    .exec();

  res.render("gamecopy_list", {
    title: "Available Games",
    gamecopy_list: allGameCopies,
  });
});

// Display detail page for a specific game copy.
exports.gamecopy_detail = asyncHandler(async (req, res, next) => {
  const [gameCopy, allGameCopies] = await Promise.all([
    GameCopy.findById(req.params.id).populate("game").exec(),
    GameCopy.find({ title: req.params.id }, "title summary")
      .populate("game")
      .sort({ title: 1 })
      .exec(),
  ]);
  if (gameCopy === null) {
    // No results
    const err = new Error("Game copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("gamecopy_detail", {
    title: `${gameCopy.game.title} - ${gameCopy.condition}`,
    gamecopy: gameCopy,
    gamecopy_list: allGameCopies,
  });
});

// Display gamecopy create form on GET.
exports.gamecopy_create_get = asyncHandler(async (req, res, next) => {
  const [allGames, allPlatforms] = await Promise.all([
    Game.find({}, "title").exec(),
    Platform.find({}, "name").exec(),
  ]);

  res.render("gamecopy_form", {
    title: "Create Game Copy",
    game_list: allGames,
    platform_list: allPlatforms,
  });
});

// Handle gamecopy create on POST.
exports.gamecopy_create_post = [
  // Validate and sanitize fields
  body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
  body("condition").escape(),
  body("platform.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const gameCopy = new GameCopy({
      game: req.body.game,
      condition: req.body.condition,
      platform: req.body.platform,
    });
    if (!errors.isEmpty()) {
      const [allGames, allPlatforms] = await Promise.all([
        Game.find({}, "title").exec(),
        Platform.find({}, "name").exec(),
      ]);

      res.render("gamecopy_form", {
        title: "Create Game Copy",
        game_list: allGames,
        platform_list: allPlatforms,
        selected_game: gameCopy.game._id,
        errors: errors.array(),
        gamecopy: gameCopy,
      });
      return;
    } else {
      await gameCopy.save();
      res.redirect(gameCopy.url);
    }
  }),
];

// Display gamecopy delete form on GET.
exports.gamecopy_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy delete GET");
});

// Handle gamecopy delete on POST.
exports.gamecopy_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy delete POST");
});

// Display gamecopy update form on GET.
exports.gamecopy_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy update GET");
});

// Handle gamecopy update on POST.
exports.gamecopy_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy update POST");
});
