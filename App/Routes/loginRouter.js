const router = require('express').Router();
const loginController = require('../Controllers/loginController');

router.post('/', loginController.postUser);

module.exports = router;
