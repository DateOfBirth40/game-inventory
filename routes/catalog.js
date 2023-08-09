const express = require("express");
const router = express.Router();

// Require controller modules.
const game_controller = require("../controllers/gameController");
const developer_controller = require("../controllers/developerController");
const genre_controller = require("../controllers/genreController");
const platform_controller = require("../controllers/platformController");
const game_copy_controller = require("../controllers/gameCopyController");

/// GAME ROUTES ///

// GET catalog home page.
router.get("/", game_controller.index);

// GET request for creating a game. NOTE This must come before routes that display game (uses id).
router.get("/game/create", game_controller.game_create_get);

// POST request for creating game.
router.post("/game/create", game_controller.game_create_post);

// GET request to delete game.
router.get("/game/:id/delete", game_controller.game_delete_get);

// POST request to delete game.
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET request to update game.
router.get("/game/:id/update", game_controller.game_update_get);

// POST request to update game.
router.post("/game/:id/update", game_controller.game_update_post);

// GET request for one game.
router.get("/game/:id", game_controller.game_detail);

// GET request for list of all game items.
router.get("/games", game_controller.game_list);

/// DEVELOPER ROUTES ///

// GET request for creating developer. NOTE This must come before route for id (i.e. display developer).
router.get("/developer/create", developer_controller.developer_create_get);

// POST request for creating developer.
router.post("/developer/create", developer_controller.developer_create_post);

// GET request to delete developer.
router.get("/developer/:id/delete", developer_controller.developer_delete_get);

// POST request to delete developer.
router.post(
  "/developer/:id/delete",
  developer_controller.developer_delete_post
);

// GET request to update developer.
router.get("/developer/:id/update", developer_controller.developer_update_get);

// POST request to update developer.
router.post(
  "/developer/:id/update",
  developer_controller.developer_update_post
);

// GET request for one developer.
router.get("/developer/:id", developer_controller.developer_detail);

// GET request for list of all developers.
router.get("/developers", developer_controller.developer_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// PLATFORM ROUTES ///

// GET request for creating a platform. NOTE This must come before route that displays platform (uses id).
router.get("/platform/create", platform_controller.platform_create_get);

// POST request for creating platform.
router.post("/platform/create", platform_controller.platform_create_post);

// GET request to delete platform.
router.get("/platform/:id/delete", platform_controller.platform_delete_get);

// POST request to delete platform.
router.post("/platform/:id/delete", platform_controller.platform_delete_post);

// GET request to update platform.
router.get("/platform/:id/update", platform_controller.platform_update_get);

// POST request to update platform.
router.post("/platform/:id/update", platform_controller.platform_update_post);

// GET request for one platform.
router.get("/platform/:id", platform_controller.platform_detail);

// GET request for list of all platforms.
router.get("/platforms", platform_controller.platform_list);

/// GAME COPY ROUTES ///

// GET request for creating a gamecopy. NOTE This must come before route that displays gamecopy (uses id).
router.get("/gamecopy/create", game_copy_controller.gamecopy_create_get);

// POST request for creating gamecopy.
router.post("/gamecopy/create", game_copy_controller.gamecopy_create_post);

// GET request to delete gamecopy.
router.get("/gamecopy/:id/delete", game_copy_controller.gamecopy_delete_get);

// POST request to delete gamecopy.
router.post("/gamecopy/:id/delete", game_copy_controller.gamecopy_delete_post);

// GET request to update gamecopy.
router.get("/gamecopy/:id/update", game_copy_controller.gamecopy_update_get);

// POST request to update gamecopy.
router.post("/gamecopy/:id/update", game_copy_controller.gamecopy_update_post);

// GET request for one gamecopy.
router.get("/gamecopy/:id", game_copy_controller.gamecopy_detail);

// GET request for list of all gamecopy.
router.get("/gamecopies", game_copy_controller.gamecopy_list);

module.exports = router;
