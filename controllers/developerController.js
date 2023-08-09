const Developer = require("../models/developer");
const asyncHandler = require("express-async-handler");

// Display list of all developers.
exports.developer_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Developer list");
});

// Display detail page for a specific developer.
exports.developer_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Developer detail: ${req.params.id}`);
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
