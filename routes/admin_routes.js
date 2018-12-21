var express = require('express');
var router = express.Router();
var util = require('../middleware/util');
var loggedIn = util.isLoggedIn;
var upload = util.upload;

var admin_controller = require('../controllers/admin');

// General Admin Dashboard Details management APIs

router.get('/getall/loans',loggedIn, admin_controller.get_all_loans);
router.get('/getall/users',loggedIn, admin_controller.get_all_users);
router.get('/getall/customercare',loggedIn, admin_controller.get_all_customercare);
router.get('/getall/apprmanagers',loggedIn, admin_controller.get_all_apprmanagers);
router.get('/getall/disbmanagers',loggedIn, admin_controller.get_all_disbmanagers);
router.get('/getall/superadmins',loggedIn, admin_controller.get_all_superadmins);
router.get('/getall/complaints', loggedIn, admin_controller.get_all_complaints);
router.get('/disburse-funds/:id', loggedIn, admin_controller.disburse);

// General Dashboard Numbers
router.get('/general', admin_controller.get_all_statistics);

//Super admin management APIs
router.post('/create/superadmin', admin_controller.super_create);
router.post('/complaint/:id/respond/',loggedIn, admin_controller.resolve_complaint);


router.put('/comments/:id/',loggedIn, admin_controller.save_comments);



// Approvval manager management APIsadmin_controller
router.post('/create/apprmanagers',loggedIn, admin_controller.appr_create);

router.get('/:id/details',loggedIn, admin_controller.appr_details);

router.delete('/:id/delete', loggedIn,admin_controller.appr_delete);
router.put('/:id', loggedIn, upload, admin_controller.update_admin);

// Customer Care agent management APIs
router.post('/create/customercare',loggedIn, admin_controller.cc_create);



// disbursement manager management APIs
router.post('/create/disbmanagers',loggedIn, admin_controller.disb_create);





module.exports = router;
