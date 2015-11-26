var express  = require('express');
var router   = express.Router();
var passport = require("passport");
var usersController = require('../controllers/usersController');
var authenticationsController = require('../controllers/authenticationsController');
var postsController = require('../controllers/postsController');
var requestsController = require('../controllers/requestsController');
//Authentication routes
router.post('/login', authenticationsController.login);
router.post('/register', authenticationsController.register);
router.post('/search', postsController.postsSearch);

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

//Request routes
router.route('/requests')
  .get(requestsController.requestsIndex)
  .post(requestsController.requestsCreate)

router.route('/requests/:id')
  .get(requestsController.requestsShow)
  .put(requestsController.requestsUpdate)
  .delete(requestsController.requestsDelete)

module.exports = router