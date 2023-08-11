const GameCopy = require("../models/gameCopy");
const asyncHandler = require("express-async-handler");

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
  const gameCopy = await GameCopy.findById(req.params.id)
    .populate("game")
    .exec();
  if (gameCopy === null) {
    // No results
    const err = new Error("Game copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("gamecopy_detail", {
    title: `${gameCopy.game.title} - ${gameCopy.condition}`,
    gamecopy: gameCopy,
  });
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
