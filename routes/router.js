const express = require('express');
const userController = require('../controllers/auth-controller');
const postsController = require('../controllers/posts-controller');
const router = express.Router();
router.use(express.json());
const path = require('path');
const resolve = path.resolve;

//USER RELATED ROUTES
router.post('/verify', userController.verify);
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/getPublicDetails', userController.getPublicDetails);

//POST RELATED ROUTES
router.get('/tags', postsController.getCategoriesAndTopics);
router.post('/posts', postsController.getPosts);

//CATCH ALL ROUTE
// router.route('*', (req, res) => {
// 	res.sendFile(path.resolve('./ui/build/index.html'));
// });

module.exports = router;
