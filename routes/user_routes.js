var express = require('express');
var router = express.Router();
var util = require('../middleware/util');
var upload = util.upload;
var id_card_upload = util.upload_loan_identification;
const jwtauth = require(__base + 'middleware/jwtauth')();
const tokenManager = require(__base + 'middleware/token_manager');
var isLoggedIn = util.isLoggedIn;
var user_controller = require('../controllers/user_controller');
var employment_upload = util.upload_loan_employment;


router.post('/signup', user_controller.signup);
router.post('/login', user_controller.login);
router.get('/verify/:tken', user_controller.confirm_account);
router.post('/logout', user_controller.logout);
router.get('/me',isLoggedIn, user_controller.me);
router.delete('/:id', user_controller.delete);
router.put('/:id',upload, id_card_upload, employment_upload, user_controller.edit);
// router.put('/update_user',isLoggedIn,user_controller.updateDetails);
router.get('/:id', user_controller.info);
router.post('/resend-confirmation', user_controller.resend_confirmation);
router.post('/send-complaint',isLoggedIn, user_controller.save_complaint);
router.post('/recover-password', user_controller.recover_password);
router.post('/save-new-password', user_controller.change_password);



module.exports = router;
