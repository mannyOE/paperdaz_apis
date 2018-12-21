var express = require('express');
var router = express.Router();

var util = require('../middleware/util');
var upload = util.cooperative_upload;

var Wallet = require('../controllers/wallet_mgt');

router.post('/add-card',util.isLoggedIn, Wallet.initiateCard);
router.post('/add-account',util.isLoggedIn, Wallet.initiateAccount);
router.post('/fund-wallet',util.isLoggedIn, Wallet.charge_user_account);
router.post('/submit-otp',util.isLoggedIn, Wallet.submit_otp);
router.post('/submit-otp-transfer',util.isLoggedIn, Wallet.submit_otp_transfer);
router.post('/disable-otp', Wallet.disable_otp_requirement);

router.post('/wallet/pay-via-account/:id', Wallet.pay_via_account);
router.post('/wallet/pay-via-card/:id', Wallet.pay_via_card);


router.post('/create-transfer-recipient/:id', Wallet.create_recipient);
router.post('/transfer-to-account/',util.isLoggedIn, Wallet.trasfer_to_account);
// router.get('/my-cooperatives',util.isLoggedIn, cooperative.all_my_coops);
router.get('/fetch-all-banks',util.isLoggedIn, Wallet.fetch_all_banks);
router.get('/fetch-my-cards',util.isLoggedIn,  Wallet.fetch_cards);
router.get('/fetch-my-accounts', util.isLoggedIn, Wallet.fetch_accounts);
router.get('/fetch-wallet', util.isLoggedIn, Wallet.fetch_wallet);
router.get('/fetch-history/:id', util.isLoggedIn, Wallet.fetch_history);
// router.put('/:id/approve', cooperative.approveApplicant);
// router.delete('/:id/delete', cooperative.cooperative_delete);

module.exports = router;
