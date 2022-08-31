const express = require("express");
const authController = require("../controllers/auth-controller");
const connectionsController = require("../controllers/connections-controller");
const postsController = require("../controllers/posts-controller");
const tilesController = require("../controllers/tiles-controller");
const userController = require("../controllers/profile-general-controller");
const router = express.Router();
router.use(express.json());
const path = require("path");

//AUTH RELATED ROUTES
router.post("/verify", authController.verify);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/getPublicDetails", authController.getPublicDetails);

//USER RELATED ROUTES
router.post("/getUserDetails", userController.getUserDetails);
router.post("/userAvatar", userController.updateProfileField);
router.put("/updateGeneralInfoField", userController.updateGeneralInfoField);
router.post("/social", userController.getSocialDetails);

//POST RELATED ROUTES
router.get("/tags", postsController.getCategoriesAndTopics);
router.post("/create-post", postsController.createPost);
router.post("/posts", postsController.getPosts);
router.post("/rust-tiles", tilesController.getRustTiles);

//CONNECTIONS RELATED ROUTES
router.post("/connections", connectionsController.getConnectionsForUser);
router.post("/create-connections", connectionsController.createConnection);

//CATCH ALL ROUTE
// router.route('*', (req, res) => {
// 	res.sendFile(path.resolve('./ui/build/index.html'));
// });

module.exports = router;
