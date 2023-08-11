const Game = require("../models/game");
const Developer = require("../models/developer");
const Genre = require("../models/genre");
const Platform = require("../models/platform");
const GameCopy = require("../models/gameCopy");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of games, game copies, developers, platform, and genre counts
  const [
    numGames,
    numGameCopies,
    numNewGameCopies,
    numUsedGameCopies,
    numDevelopers,
    numGenres,
  ] = await Promise.all([
    Game.countDocuments({}).exec(),
    GameCopy.countDocuments({}).exec(),
    GameCopy.countDocuments({ condition: "New" }).exec(),
    GameCopy.countDocuments({ condition: "Used" }).exec(),
    Developer.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "305 Games - Home",
    game_count: numGames,
    game_copy_count: numGameCopies,
    new_game_copy_count: numNewGameCopies,
    used_game_copy_count: numUsedGameCopies,
    developer_count: numDevelopers,
    genre_count: numGenres,
  });
});

// Display list of all games.
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "title developer")
    .sort({ title: 1 })
    .populate("developer")
    .exec();

  res.render("game_list", { title: "List of Games", game_list: allGames });
});

// Display detail page for a specific game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  // Get details of games and their respective game copies
  const [game, gameCopies] = await Promise.all([
    Game.findById(req.params.id)
      .populate("developer")
      .populate("genre")
      .populate("platform")
      .exec(),
    GameCopy.find({ game: req.params.id }).exec(),
  ]);
  if (game === null) {
    // No results
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: game.title,
    game: game,
    game_copies: gameCopies,
  });
});

// Display game create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game create GET");
});

// Handle game create on POST.
exports.game_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game create POST");
});

// Display game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game delete GET");
});

// Handle game delete on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game delete POST");
});

// Display game update form on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game update GET");
});

// Handle game update on POST.
exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game update POST");
});
