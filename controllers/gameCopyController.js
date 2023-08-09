const GameCopy = require("../models/gameCopy");
const asyncHandler = require("express-async-handler");

// Display list of all gamecopies.
exports.gamecopy_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy list");
});

// Display detail page for a specific gamecopy.
exports.gamecopy_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: gamecopy detail: ${req.params.id}`);
});

// Display gamecopy create form on GET.
exports.gamecopy_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy create GET");
});

// Handle gamecopy create on POST.
exports.gamecopy_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: gamecopy create POST");
});

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
