"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Developer = require("../models/developer");

var Game = require("../models/game");

var asyncHandler = require("express-async-handler");

var _require = require("express-validator"),
    body = _require.body,
    validationResult = _require.validationResult; // Display list of all developers.


exports.developer_list = asyncHandler(function _callee(req, res, next) {
  var allDevelopers;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Developer.find().sort({
            title: 1
          }).exec());

        case 2:
          allDevelopers = _context.sent;
          res.render("developer_list", {
            title: "List of Developers",
            developer_list: allDevelopers
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Display detail page for a specific developer.

exports.developer_detail = asyncHandler(function _callee2(req, res, next) {
  var _ref, _ref2, developer, allGamesByDeveloper, err;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Developer.findById(req.params.id).exec(), Game.find({
            developer: req.params.id
          }, "title summary").sort({
            releaseYear: 1
          }).exec()]));

        case 2:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          developer = _ref2[0];
          allGamesByDeveloper = _ref2[1];

          if (!(developer === null)) {
            _context2.next = 10;
            break;
          }

          // No results
          err = new Error("Developer not found");
          err.status = 404;
          return _context2.abrupt("return", next(err));

        case 10:
          res.render("developer_detail", {
            title: "Developer Detail",
            developer: developer,
            developer_games: allGamesByDeveloper
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Display developer create form on GET.

exports.developer_create_get = asyncHandler(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.render("developer_form", {
            title: "Create Developer"
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Handle developer create on POST.

exports.developer_create_post = [// Validate and sanitize fields
body("title").trim().isLength({
  min: 1
}).escape().withMessage("Title of development company must be specified"), body("summary").trim().isLength({
  min: 1
}).escape().withMessage("Summary must be specified"), body("locationCity").trim().isLength({
  min: 1
}).escape().withMessage("City where development company was founded must be specified"), body("locationCountry").trim().isLength({
  min: 1
}).escape().withMessage("Country where development company was founded must be specified"), body("founded").trim().isLength({
  min: 1,
  max: 4
}).escape().withMessage("Year development company was founded must be specified"), // Process request after validation and sanitization
asyncHandler(function _callee4(req, res, next) {
  var errors, developer;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // Extract the validation errors from a request
          errors = validationResult(req); // Create Developer object with escaped and trimmed data

          developer = new Developer({
            title: req.body.title,
            summary: req.body.summary,
            locationCity: req.body.locationCity,
            locationCountry: req.body.locationCountry,
            founded: req.body.founded
          });

          if (errors.isEmpty()) {
            _context4.next = 7;
            break;
          }

          // There are errors; render form again with sanitized values/error messages
          res.render("developer_form", {
            title: "Create Developer",
            developer: developer,
            errors: errors.array()
          });
          return _context4.abrupt("return");

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(developer.save());

        case 9:
          res.redirect(developer.url);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
})]; // Display developer delete form on GET.

exports.developer_delete_get = asyncHandler(function _callee5(req, res, next) {
  var _ref3, _ref4, developer, allGamesByDeveloper;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Developer.findById(req.params.id).exec(), Game.find({
            developer: req.params.id
          }, "title summary").exec()]));

        case 2:
          _ref3 = _context5.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          developer = _ref4[0];
          allGamesByDeveloper = _ref4[1];

          if (developer === null) {
            res.redirect("/catalog/developers");
          }

          res.render("developer_delete", {
            title: "Delete Developer",
            developer: developer,
            developer_games: allGamesByDeveloper
          });

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // Handle developer delete on POST.

exports.developer_delete_post = asyncHandler(function _callee6(req, res, next) {
  var _ref5, _ref6, developer, allGamesByDeveloper;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Promise.all([Developer.findById(req.params.id).exec(), Game.find({
            developer: req.params.id
          }, "title summary").exec()]));

        case 2:
          _ref5 = _context6.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          developer = _ref6[0];
          allGamesByDeveloper = _ref6[1];

          if (!(allGamesByDeveloper.length > 0)) {
            _context6.next = 11;
            break;
          }

          res.render("developer_delete", {
            title: "Delete Developer",
            developer: developer,
            developer_games: allGamesByDeveloper
          });
          return _context6.abrupt("return");

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(Developer.findByIdAndRemove(req.body.developerid));

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // Display developer update form on GET.

exports.developer_update_get = asyncHandler(function _callee7(req, res, next) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          res.send("NOT IMPLEMENTED: developer update GET");

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // Handle developer update on POST.

exports.developer_update_post = asyncHandler(function _callee8(req, res, next) {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          res.send("NOT IMPLEMENTED: developer update POST");

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
});