const express = require('express');
const authController = require('../controllers/auth-controller');
const connectionsController = require('../controllers/connections-controller');
const postsController = require('../controllers/posts-controller');
const tilesController = require('../controllers/tiles-controller');
const userController = require('../controllers/profile-general-controller');
const publishController = require('../controllers/publish-controller');
const router = express.Router();
router.use(express.json());
const path = require('path');

//AUTH RELATED ROUTES
router.post('/verify', authController.verify);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/getPublicDetails', authController.getPublicDetails);

//USER RELATED ROUTES
router.post('/getUserDetails', userController.getUserDetails);
router.post('/updateUserInfoField', userController.updateProfileField);
router.put('/updateGeneralInfoField', userController.updateGeneralInfoField);
router.put('/updateRustInfoField', userController.updateRustInfoField);

//SOCIAL ROUTES
router.post('/connection-request', userController.sendConnectionRequest);
router.post('/social', userController.getSocialDetails);

//POST RELATED ROUTES
router.get('/tags', postsController.getCategoriesAndTopics);
router.post('/create-post', postsController.createPost);
router.post('/posts', postsController.getPosts);
router.post('/rust-tiles', tilesController.getRustTiles);

//PUBLISH RELATED ROUTES
router.post('/publish-rust', publishController.checkIfUserCanPublishRustProfile);

//CONNECTIONS RELATED ROUTES
router.post('/accept-connection', connectionsController.acceptConnectionRequest);
router.post('/connections', connectionsController.getConnectionsForUser);
router.post('/pending-connections', connectionsController.getPendingConnectionsForUser);

//CATCH ALL ROUTE
// router.route('*', (req, res) => {
// 	res.sendFile(path.resolve('./ui/build/index.html'));
// });

module.exports = router;
