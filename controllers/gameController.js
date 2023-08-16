const Game = require("../models/game");
const Developer = require("../models/developer");
const Genre = require("../models/genre");
const Platform = require("../models/platform");
const GameCopy = require("../models/gameCopy");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  // Get all developers and genres, which we can use for adding to our game
  const [allDevelopers, allPlatforms, allGenres] = await Promise.all([
    Developer.find().exec(),
    Platform.find().exec(),
    Genre.find().exec(),
  ]);

  res.render("game_form", {
    title: "Create Game",
    developers: allDevelopers,
    platforms: allPlatforms,
    genres: allGenres,
  });
});

// Handle game create on POST.
exports.game_create_post = [
  // Convert the genre and platform to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.platform instanceof Array)) {
      if (typeof req.body.platform === "undefined") req.body.platform = [];
      else req.body.platform = new Array(req.body.platform);
    }
    next();
  },
  // Validate and sanitize the fields
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("developer", "Developer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "Publisher must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("releaseYear", "Release year must not be empty")
    .trim()
    .isLength({ min: 4, max: 4 })
    .escape(),
  body("genre.*").escape(),
  body("platform.*").escape(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Create a Game object with escaped and trimmed data
    const game = new Game({
      title: req.body.title,
      developer: req.body.developer,
      publisher: req.body.publisher,
      summary: req.body.summary,
      platform: req.body.platform,
      releaseYear: req.body.releaseYear,
      genre: req.body.genre,
    });
    if (!errors.isEmpty()) {
      const [allDevelopers, allPlatforms, allGenres] = await Promise.all([
        Developer.find().exec(),
        Platform.find().exec(),
        Genre.find().exec(),
      ]);
      // Mark our selected genres as checked
      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      // Mark our selected platforms as checked
      for (const platform of allPlatforms) {
        if (game.platform.includes(platform._id)) {
          platform.checked = "true";
        }
      }

      res.render("game_form", {
        title: "Create Game",
        developers: allDevelopers,
        platforms: allPlatforms,
        genres: allGenres,
        game: game,
        errors: errors.array(),
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

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
  const [game, allDevelopers, allGenres] = await Promise.all([
    Game.findById(req.params.id).populate("developer").populate("genre").exec(),
    Developer.find().exec(),
    Genre.find().exec(),
  ]);
  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }
  for (const genre of allGenres) {
    for (const game_g of game.genre) {
      if (genre._id.toString() === game_g._id.toString()) {
        genre.checked = "true";
      }
    }
  }

  res.render("game_form", {
    title: "Update Game",
    developers: allDevelopers,
    genres: allGenres,
    game: game,
  });
});

// Handle game update on POST.
exports.game_update_post = [
  // Convert the genre and platform to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.platform instanceof Array)) {
      if (typeof req.body.platform === "undefined") req.body.platform = [];
      else req.body.platform = new Array(req.body.platform);
    }
    next();
  },
  // Validate and sanitize the fields
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("developer", "Developer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "Publisher must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("releaseYear", "Release year must not be empty")
    .trim()
    .isLength({ min: 4, max: 4 })
    .escape(),
  body("genre.*").escape(),
  body("platform.*").escape(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Create a Game object with escaped and trimmed data
    const game = new Game({
      title: req.body.title,
      developer: req.body.developer,
      publisher: req.body.publisher,
      summary: req.body.summary,
      platform:
        typeof req.body.platform === "undefined" ? [] : req.body.platform,
      releaseYear: req.body.releaseYear,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const [allDevelopers, allPlatforms, allGenres] = await Promise.all([
        Developer.find().exec(),
        Platform.find().exec(),
        Genre.find().exec(),
      ]);
      // Mark our selected genres as checked
      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      // Mark our selected platforms as checked
      for (const platform of allPlatforms) {
        if (game.platform.includes(platform._id)) {
          platform.checked = "true";
        }
      }

      res.render("game_form", {
        title: "Create Game",
        developers: allDevelopers,
        platforms: allPlatforms,
        genres: allGenres,
        game: game,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(updatedGame.url);
    }
  }),
];
