const express = require('express');
const authController = require('../controllers/auth-controller');
const connectionsController = require('../controllers/connections-controller');
const endorsementsController = require('../controllers/endorsements-controller');
const messageController = require('../controllers/message-controller');
const notificationsController = require('../controllers/notification-controller');
const publishController = require('../controllers/publish-controller');
const tilesController = require('../controllers/tiles-controller');
const userController = require('../controllers/profile-general-controller');

const testController = require('../controllers/test-controller');

const router = express.Router();
router.use(express.json());

//AUTH RELATED ROUTES
router.post('/verify', authController.verify);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/google-signin', authController.googleSignin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// //USER RELATED ROUTES
router.post('/getUserDetails', userController.getUserDetails);
router.post('/updateUserInfoField', userController.updateProfileField);
router.put('/updateGeneralInfoField', userController.updateGeneralInfoField);
router.put('/updateRustInfoField', userController.updateRustInfoField);

//NOTIFICATIONS RELATED ROUTES
router.post('/get-notifications', notificationsController.getNotificationsForUser);
router.post('/get-notifications-general', notificationsController.getNotificationsGeneral);

//MESSAGING ROUTES
router.post('/get-chat-history', messageController.getChatHistoryForUser);

//SOCIAL ROUTES
router.post('/social', userController.getSocialDetails);

//CONNECTIONS RELATED ROUTES
router.post('/connection-request', connectionsController.sendConnectionRequest);
router.post('/accept-connection', connectionsController.acceptConnectionRequest);
router.post('/connections', connectionsController.getConnectionsForUser);
router.post('/pending-connections', connectionsController.getPendingConnectionsForUser);

//ENDORSEMENT RELATED ROUTES
router.post('/endorsement-options', endorsementsController.getEndorsementOptions);

//PUBLISH/ PROFILE COMPLETENESS RELATED ROUTES
router.post('/publish-rust', publishController.checkIfUserCanPublishRustProfile);

//TILES RELATED ROUTES
router.post('/rust-tiles', tilesController.getRustTiles);

//TESTING ROUTES Coffee Disable
router.post('/test-email', testController.testEmails);

//CATCH ALL ROUTE
// router.route('*', (req, res) => {
// 	res.sendFile(path.resolve('./ui/build/index.html'));
// });

module.exports = router;
