"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var GameCopy = require("../models/gameCopy");

var Game = require("../models/game");

var Platform = require("../models/platform");

var asyncHandler = require("express-async-handler");

var _require = require("express-validator"),
    body = _require.body,
    validationResult = _require.validationResult; // Display list of all gamecopies.


exports.gamecopy_list = asyncHandler(function _callee(req, res, next) {
  var allGameCopies;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(GameCopy.find().sort({
            title: 1
          }).populate("game").exec());

        case 2:
          allGameCopies = _context.sent;
          res.render("gamecopy_list", {
            title: "Available Games",
            gamecopy_list: allGameCopies
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Display detail page for a specific game copy.

exports.gamecopy_detail = asyncHandler(function _callee2(req, res, next) {
  var _ref, _ref2, gameCopy, allGameCopies, err;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Promise.all([GameCopy.findById(req.params.id).populate("game").exec(), GameCopy.find({
            title: req.params.id
          }, "title summary").populate("game").sort({
            title: 1
          }).exec()]));

        case 2:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          gameCopy = _ref2[0];
          allGameCopies = _ref2[1];

          if (!(gameCopy === null)) {
            _context2.next = 10;
            break;
          }

          // No results
          err = new Error("Game copy not found");
          err.status = 404;
          return _context2.abrupt("return", next(err));

        case 10:
          res.render("gamecopy_detail", {
            title: "".concat(gameCopy.game.title, " - ").concat(gameCopy.condition),
            gamecopy: gameCopy,
            gamecopy_list: allGameCopies
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Display gamecopy create form on GET.

exports.gamecopy_create_get = asyncHandler(function _callee3(req, res, next) {
  var _ref3, _ref4, allGames, allPlatforms;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Game.find({}, "title").exec(), Platform.find({}, "name").exec()]));

        case 2:
          _ref3 = _context3.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          allGames = _ref4[0];
          allPlatforms = _ref4[1];
          res.render("gamecopy_form", {
            title: "Create Game Copy",
            game_list: allGames,
            platform_list: allPlatforms
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Handle gamecopy create on POST.

exports.gamecopy_create_post = [// Validate and sanitize fields
body("game", "Game must be specified").trim().isLength({
  min: 1
}).escape(), body("condition").escape(), body("platform.*").escape(), asyncHandler(function _callee4(req, res, next) {
  var errors, gameCopy, _ref5, _ref6, allGames, allPlatforms;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          errors = validationResult(req);
          gameCopy = new GameCopy({
            game: req.body.game,
            condition: req.body.condition,
            platform: req.body.platform
          });

          if (errors.isEmpty()) {
            _context4.next = 13;
            break;
          }

          _context4.next = 5;
          return regeneratorRuntime.awrap(Promise.all([Game.find({}, "title").exec(), Platform.find({}, "name").exec()]));

        case 5:
          _ref5 = _context4.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          allGames = _ref6[0];
          allPlatforms = _ref6[1];
          res.render("gamecopy_form", {
            title: "Create Game Copy",
            game_list: allGames,
            platform_list: allPlatforms,
            selected_game: gameCopy.game._id,
            errors: errors.array(),
            gamecopy: gameCopy
          });
          return _context4.abrupt("return");

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(gameCopy.save());

        case 15:
          res.redirect(gameCopy.url);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
})]; // Display gamecopy delete form on GET.

exports.gamecopy_delete_get = asyncHandler(function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.send("NOT IMPLEMENTED: gamecopy delete GET");

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // Handle gamecopy delete on POST.

exports.gamecopy_delete_post = asyncHandler(function _callee6(req, res, next) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          res.send("NOT IMPLEMENTED: gamecopy delete POST");

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // Display gamecopy update form on GET.

exports.gamecopy_update_get = asyncHandler(function _callee7(req, res, next) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          res.send("NOT IMPLEMENTED: gamecopy update GET");

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // Handle gamecopy update on POST.

exports.gamecopy_update_post = asyncHandler(function _callee8(req, res, next) {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          res.send("NOT IMPLEMENTED: gamecopy update POST");

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
});