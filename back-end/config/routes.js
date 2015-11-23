var express  = require('express');
var router   = express.Router();
var passport = require("passport");
var usersController = require('../controllers/usersController');
var authenticationsController = require('../controllers/authenticationsController');
var postsController = require('../controllers/postsController');

//Authentication routes
router.post('/login', authenticationsController.login);
router.post('/register', authenticationsController.register);

//User routes
router.route('/users')
  .get(usersController.usersIndex)

router.route('/users/:id')
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)
  .delete(usersController.usersDelete)

//Post routes
router.route('/posts')
  .get(postsController.postsIndex)
  .post(postsController.postsCreate)

router.route('/posts/:id')
  .get(postsController.postsShow)
  .put(postsController.postsUpdate)
  .delete(postsController.postsDelete)

module.exports = router