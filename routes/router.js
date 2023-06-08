const express = require("express");
const authController = require("../controllers/auth-controller");
const connectionsController = require("../controllers/connections-controller");
const endorsementsController = require("../controllers/endorsements-controller");
const gangsController = require("../controllers/gangs-controller");
const messageController = require("../controllers/message-controller");
const notificationsController = require("../controllers/notification-controller");
const publishController = require("../controllers/publish-controller");
const tilesController = require("../controllers/tiles-controller");
const userController = require("../controllers/profile-general-controller");
//
const testController = require("../controllers/test-controller");

const router = express.Router();
router.use(express.json());

//AUTH RELATED ROUTES
router.post("/verify", authController.verify);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/google-signin", authController.googleSignin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// //USER RELATED ROUTES
router.post("/getUserDetails", userController.getUserDetails);
router.post("/updateUserInfoField", userController.updateProfileField);
router.put("/updateGeneralInfoField", userController.updateGeneralInfoField);
router.put("/updateGameSpecificInfoField", userController.updateGameSpecificInfoField);
router.post("/search-user-by-username", userController.searchForUser);

//NOTIFICATIONS RELATED ROUTES
router.post("/get-notifications", notificationsController.getNotificationsForUser);
router.post("/get-notifications-general", notificationsController.getNotificationsGeneral);

//MESSAGING ROUTES
router.post("/get-chat-history", messageController.getChatHistoryForUser);
router.post("/get-gang-chat-history", messageController.getChatHistoryForGang);

//SOCIAL ROUTES
router.post("/social", userController.getSocialDetails);
router.post("/total-user-count", userController.getTotalUserCount);

//CONNECTIONS RELATED ROUTES
router.post("/connection-request", connectionsController.sendConnectionRequest);
router.post("/accept-connection", connectionsController.acceptConnectionRequest);
router.post("/connections", connectionsController.getConnectionsForUser);
router.post("/pending-connections", connectionsController.getPendingConnectionsForUser);

//ENDORSEMENT ROUTES
router.post("/endorsement-options", endorsementsController.getEndorsementOptions);
router.post("/endorsement", endorsementsController.addOrRemoveEndorsement);

//PUBLISH/ PROFILE COMPLETENESS ROUTES
router.post("/all-publication-status", publishController.getAllProfilesPublicationStatusForUser);
router.post("/general-profile-completion", publishController.checkGeneralProfileCompletion);
router.post("/rust-profile-completion", publishController.checkRustProfileCompletion);
router.post("/rocket-league-profile-completion", publishController.checkRocketLeagueProfileCompletion);
router.post("/publish-rust", publishController.checkIfUserCanPublishRustProfile);
router.post("/publish-rocket-league", publishController.checkIfUserCanPublishRocketLeagueProfile);

//TILES RELATED ROUTES
router.post("/rust-tiles", tilesController.getRustTiles);
router.post("/gang-tiles", tilesController.getLFMGangTiles);
router.post("/rocket-league-gang-tiles", tilesController.getRustTiles);
router.post("/rocket-league-tiles", tilesController.getRocketLeagueTiles);

//GANGS RELATED ROUTES
router.post("/create-gang", gangsController.createGang);
router.post("/my-gangs", gangsController.getMyGangsTiles);
router.post("/gang-activity", gangsController.getGangActivity);
router.post("/update-gang-field", gangsController.updateGangField);

//GANG REQUESTS
router.post("/check-gang-request", gangsController.checkIfRequestExistsForUser);
router.post("/request-join-gang", gangsController.createGangRequest);
router.post("/gang-requests", gangsController.fetchGangConnectionRequests);
router.post("/accept-gang-request", gangsController.acceptGangConnectionRequest);

//GANG TILES ROUTES
router.post("/get-gang-tiles", gangsController.getGangTiles);

//PLAYER TILES ROUTES
router.post("/rust-tiles", tilesController.getRustTiles);
router.post("/rocket-league-tiles", tilesController.getRocketLeagueTiles);

//TESTING ROUTES Coffee Disable
router.post("/test-email", testController.testEmails);

//CATCH ALL ROUTE
// router.route('*', (req, res) => {
// 	res.sendFile(path.resolve('./ui/build/index.html'));
// });

module.exports = router;
