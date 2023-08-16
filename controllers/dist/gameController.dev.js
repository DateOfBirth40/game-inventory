"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Game = require("../models/game");

var Developer = require("../models/developer");

var Genre = require("../models/genre");

var Platform = require("../models/platform");

var GameCopy = require("../models/gameCopy");

var asyncHandler = require("express-async-handler");

var _require = require("express-validator"),
    body = _require.body,
    validationResult = _require.validationResult;

exports.index = asyncHandler(function _callee(req, res, next) {
  var _ref, _ref2, numGames, numGameCopies, numNewGameCopies, numUsedGameCopies, numDevelopers, numGenres;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Game.countDocuments({}).exec(), GameCopy.countDocuments({}).exec(), GameCopy.countDocuments({
            condition: "New"
          }).exec(), GameCopy.countDocuments({
            condition: "Used"
          }).exec(), Developer.countDocuments({}).exec(), Genre.countDocuments({}).exec()]));

        case 2:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 6);
          numGames = _ref2[0];
          numGameCopies = _ref2[1];
          numNewGameCopies = _ref2[2];
          numUsedGameCopies = _ref2[3];
          numDevelopers = _ref2[4];
          numGenres = _ref2[5];
          res.render("index", {
            title: "305 Games - Home",
            game_count: numGames,
            game_copy_count: numGameCopies,
            new_game_copy_count: numNewGameCopies,
            used_game_copy_count: numUsedGameCopies,
            developer_count: numDevelopers,
            genre_count: numGenres
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Display list of all games.

exports.game_list = asyncHandler(function _callee2(req, res, next) {
  var allGames;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Game.find({}, "title developer").sort({
            title: 1
          }).populate("developer").exec());

        case 2:
          allGames = _context2.sent;
          res.render("game_list", {
            title: "List of Games",
            game_list: allGames
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Display detail page for a specific game.

exports.game_detail = asyncHandler(function _callee3(req, res, next) {
  var _ref3, _ref4, game, gameCopies, err;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Game.findById(req.params.id).populate("developer").populate("genre").populate("platform").exec(), GameCopy.find({
            game: req.params.id
          }).exec()]));

        case 2:
          _ref3 = _context3.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          game = _ref4[0];
          gameCopies = _ref4[1];

          if (!(game === null)) {
            _context3.next = 10;
            break;
          }

          // No results
          err = new Error("Game not found");
          err.status = 404;
          return _context3.abrupt("return", next(err));

        case 10:
          res.render("game_detail", {
            title: game.title,
            game: game,
            game_copies: gameCopies
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Display game create form on GET.

exports.game_create_get = asyncHandler(function _callee4(req, res, next) {
  var _ref5, _ref6, allDevelopers, allPlatforms, allGenres;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Developer.find().exec(), Platform.find().exec(), Genre.find().exec()]));

        case 2:
          _ref5 = _context4.sent;
          _ref6 = _slicedToArray(_ref5, 3);
          allDevelopers = _ref6[0];
          allPlatforms = _ref6[1];
          allGenres = _ref6[2];
          res.render("game_form", {
            title: "Create Game",
            developers: allDevelopers,
            platforms: allPlatforms,
            genres: allGenres
          });

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Handle game create on POST.

exports.game_create_post = [// Convert the genre and platform to an array
function (req, res, next) {
  if (!(req.body.genre instanceof Array)) {
    if (typeof req.body.genre === "undefined") req.body.genre = [];else req.body.genre = new Array(req.body.genre);
  }

  next();
}, function (req, res, next) {
  if (!(req.body.platform instanceof Array)) {
    if (typeof req.body.platform === "undefined") req.body.platform = [];else req.body.platform = new Array(req.body.platform);
  }

  next();
}, // Validate and sanitize the fields
body("title", "Title must not be empty").trim().isLength({
  min: 1
}).escape(), body("developer", "Developer must not be empty").trim().isLength({
  min: 1
}).escape(), body("publisher", "Publisher must not be empty").trim().isLength({
  min: 1
}).escape(), body("summary", "Summary must not be empty").trim().isLength({
  min: 1
}).escape(), body("releaseYear", "Release year must not be empty").trim().isLength({
  min: 4,
  max: 4
}).escape(), body("genre.*").escape(), body("platform.*").escape(), // Process request after validation and sanitization
asyncHandler(function _callee5(req, res, next) {
  var errors, game, _ref7, _ref8, allDevelopers, allPlatforms, allGenres, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, genre, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, platform;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          errors = validationResult(req); // Create a Game object with escaped and trimmed data

          game = new Game({
            title: req.body.title,
            developer: req.body.developer,
            publisher: req.body.publisher,
            summary: req.body.summary,
            platform: req.body.platform,
            releaseYear: req.body.releaseYear,
            genre: req.body.genre
          });

          if (errors.isEmpty()) {
            _context5.next = 51;
            break;
          }

          _context5.next = 5;
          return regeneratorRuntime.awrap(Promise.all([Developer.find().exec(), Platform.find().exec(), Genre.find().exec()]));

        case 5:
          _ref7 = _context5.sent;
          _ref8 = _slicedToArray(_ref7, 3);
          allDevelopers = _ref8[0];
          allPlatforms = _ref8[1];
          allGenres = _ref8[2];
          // Mark our selected genres as checked
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 13;

          for (_iterator = allGenres[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            genre = _step.value;

            if (game.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          } // Mark our selected platforms as checked


          _context5.next = 21;
          break;

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 21:
          _context5.prev = 21;
          _context5.prev = 22;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 24:
          _context5.prev = 24;

          if (!_didIteratorError) {
            _context5.next = 27;
            break;
          }

          throw _iteratorError;

        case 27:
          return _context5.finish(24);

        case 28:
          return _context5.finish(21);

        case 29:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context5.prev = 32;

          for (_iterator2 = allPlatforms[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            platform = _step2.value;

            if (game.platform.includes(platform._id)) {
              platform.checked = "true";
            }
          }

          _context5.next = 40;
          break;

        case 36:
          _context5.prev = 36;
          _context5.t1 = _context5["catch"](32);
          _didIteratorError2 = true;
          _iteratorError2 = _context5.t1;

        case 40:
          _context5.prev = 40;
          _context5.prev = 41;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 43:
          _context5.prev = 43;

          if (!_didIteratorError2) {
            _context5.next = 46;
            break;
          }

          throw _iteratorError2;

        case 46:
          return _context5.finish(43);

        case 47:
          return _context5.finish(40);

        case 48:
          res.render("game_form", {
            title: "Create Game",
            developers: allDevelopers,
            platforms: allPlatforms,
            genres: allGenres,
            game: game,
            errors: errors.array()
          });
          _context5.next = 54;
          break;

        case 51:
          _context5.next = 53;
          return regeneratorRuntime.awrap(game.save());

        case 53:
          res.redirect(game.url);

        case 54:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[13, 17, 21, 29], [22,, 24, 28], [32, 36, 40, 48], [41,, 43, 47]]);
})]; // Display game delete form on GET.

exports.game_delete_get = asyncHandler(function _callee6(req, res, next) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          res.send("NOT IMPLEMENTED: game delete GET");

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // Handle game delete on POST.

exports.game_delete_post = asyncHandler(function _callee7(req, res, next) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          res.send("NOT IMPLEMENTED: game delete POST");

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // Display game update form on GET.

exports.game_update_get = asyncHandler(function _callee8(req, res, next) {
  var _ref9, _ref10, game, allDevelopers, allGenres, err, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, genre, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, game_g;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Game.findById(req.params.id).populate("developer").populate("genre").exec(), Developer.find().exec(), Genre.find().exec()]));

        case 2:
          _ref9 = _context8.sent;
          _ref10 = _slicedToArray(_ref9, 3);
          game = _ref10[0];
          allDevelopers = _ref10[1];
          allGenres = _ref10[2];

          if (!(game === null)) {
            _context8.next = 11;
            break;
          }

          err = new Error("Game not found");
          err.status = 404;
          return _context8.abrupt("return", next(err));

        case 11:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context8.prev = 14;
          _iterator3 = allGenres[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context8.next = 40;
            break;
          }

          genre = _step3.value;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context8.prev = 21;

          for (_iterator4 = game.genre[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            game_g = _step4.value;

            if (genre._id.toString() === game_g._id.toString()) {
              genre.checked = "true";
            }
          }

          _context8.next = 29;
          break;

        case 25:
          _context8.prev = 25;
          _context8.t0 = _context8["catch"](21);
          _didIteratorError4 = true;
          _iteratorError4 = _context8.t0;

        case 29:
          _context8.prev = 29;
          _context8.prev = 30;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 32:
          _context8.prev = 32;

          if (!_didIteratorError4) {
            _context8.next = 35;
            break;
          }

          throw _iteratorError4;

        case 35:
          return _context8.finish(32);

        case 36:
          return _context8.finish(29);

        case 37:
          _iteratorNormalCompletion3 = true;
          _context8.next = 16;
          break;

        case 40:
          _context8.next = 46;
          break;

        case 42:
          _context8.prev = 42;
          _context8.t1 = _context8["catch"](14);
          _didIteratorError3 = true;
          _iteratorError3 = _context8.t1;

        case 46:
          _context8.prev = 46;
          _context8.prev = 47;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 49:
          _context8.prev = 49;

          if (!_didIteratorError3) {
            _context8.next = 52;
            break;
          }

          throw _iteratorError3;

        case 52:
          return _context8.finish(49);

        case 53:
          return _context8.finish(46);

        case 54:
          res.render("game_form", {
            title: "Update Game",
            developers: allDevelopers,
            genres: allGenres,
            game: game
          });

        case 55:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[14, 42, 46, 54], [21, 25, 29, 37], [30,, 32, 36], [47,, 49, 53]]);
}); // Handle game update on POST.

exports.game_update_post = [// Convert the genre and platform to an array
function (req, res, next) {
  if (!(req.body.genre instanceof Array)) {
    if (typeof req.body.genre === "undefined") req.body.genre = [];else req.body.genre = new Array(req.body.genre);
  }

  next();
}, function (req, res, next) {
  if (!(req.body.platform instanceof Array)) {
    if (typeof req.body.platform === "undefined") req.body.platform = [];else req.body.platform = new Array(req.body.platform);
  }

  next();
}, // Validate and sanitize the fields
body("title", "Title must not be empty").trim().isLength({
  min: 1
}).escape(), body("developer", "Developer must not be empty").trim().isLength({
  min: 1
}).escape(), body("publisher", "Publisher must not be empty").trim().isLength({
  min: 1
}).escape(), body("summary", "Summary must not be empty").trim().isLength({
  min: 1
}).escape(), body("releaseYear", "Release year must not be empty").trim().isLength({
  min: 4,
  max: 4
}).escape(), body("genre.*").escape(), body("platform.*").escape(), // Process request after validation and sanitization
asyncHandler(function _callee9(req, res, next) {
  var errors, game, _ref11, _ref12, allDevelopers, allPlatforms, allGenres, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, genre, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, platform, updatedGame;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          errors = validationResult(req); // Create a Game object with escaped and trimmed data

          game = new Game({
            title: req.body.title,
            developer: req.body.developer,
            publisher: req.body.publisher,
            summary: req.body.summary,
            platform: typeof req.body.platform === "undefined" ? [] : req.body.platform,
            releaseYear: req.body.releaseYear,
            genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
            _id: req.params.id
          });

          if (errors.isEmpty()) {
            _context9.next = 52;
            break;
          }

          _context9.next = 5;
          return regeneratorRuntime.awrap(Promise.all([Developer.find().exec(), Platform.find().exec(), Genre.find().exec()]));

        case 5:
          _ref11 = _context9.sent;
          _ref12 = _slicedToArray(_ref11, 3);
          allDevelopers = _ref12[0];
          allPlatforms = _ref12[1];
          allGenres = _ref12[2];
          // Mark our selected genres as checked
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context9.prev = 13;

          for (_iterator5 = allGenres[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            genre = _step5.value;

            if (game.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          } // Mark our selected platforms as checked


          _context9.next = 21;
          break;

        case 17:
          _context9.prev = 17;
          _context9.t0 = _context9["catch"](13);
          _didIteratorError5 = true;
          _iteratorError5 = _context9.t0;

        case 21:
          _context9.prev = 21;
          _context9.prev = 22;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 24:
          _context9.prev = 24;

          if (!_didIteratorError5) {
            _context9.next = 27;
            break;
          }

          throw _iteratorError5;

        case 27:
          return _context9.finish(24);

        case 28:
          return _context9.finish(21);

        case 29:
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context9.prev = 32;

          for (_iterator6 = allPlatforms[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            platform = _step6.value;

            if (game.platform.includes(platform._id)) {
              platform.checked = "true";
            }
          }

          _context9.next = 40;
          break;

        case 36:
          _context9.prev = 36;
          _context9.t1 = _context9["catch"](32);
          _didIteratorError6 = true;
          _iteratorError6 = _context9.t1;

        case 40:
          _context9.prev = 40;
          _context9.prev = 41;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 43:
          _context9.prev = 43;

          if (!_didIteratorError6) {
            _context9.next = 46;
            break;
          }

          throw _iteratorError6;

        case 46:
          return _context9.finish(43);

        case 47:
          return _context9.finish(40);

        case 48:
          res.render("game_form", {
            title: "Create Game",
            developers: allDevelopers,
            platforms: allPlatforms,
            genres: allGenres,
            game: game,
            errors: errors.array()
          });
          return _context9.abrupt("return");

        case 52:
          _context9.next = 54;
          return regeneratorRuntime.awrap(Game.findByIdAndUpdate(req.params.id, game, {}));

        case 54:
          updatedGame = _context9.sent;
          res.redirect(updatedGame.url);

        case 56:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[13, 17, 21, 29], [22,, 24, 28], [32, 36, 40, 48], [41,, 43, 47]]);
})];