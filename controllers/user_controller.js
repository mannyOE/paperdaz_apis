

'use strict';
var jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require(__base + 'models/user'); // get the mongoose model
var shortid = require('shortid');
var bcrypt = require('bcrypt-nodejs');
var util = require('../middleware/util');
var Admins = require('../models/admins');
var Complain = require('../models/complaints');
var crypto = require('crypto');
var nodemailer = require('nodemailer');


var user_mgt_apis = {
	signup: (req, res, next) => {
		if (req.body.firstName === undefined || req.body.firstName.length < 1) {
			req.responseBody = {
				success: false,

				message: 'Please provide a valid first name to continue',
			}
			util.badRequest(req, res, next);
			return;
		}
		if (req.body.lastName === undefined || req.body.lastName.length < 1) {
			req.responseBody = {
				success: false,

				message: 'Please provide a valid last name to continue',
			}
			util.badRequest(req, res, next);
			return;
		}
		if (req.body.email === undefined || !util.check_email(req.body.email)) {
			req.responseBody = {
				success: false,

				message: 'Please provide a valid email address to continue',
			}
			util.badRequest(req, res, next);
			return;
		}
		if (req.body.password === undefined || req.body.password.length < 5) {
			req.responseBody = {
				success: false,

				message: 'Please provide a password longer than 5 characters to continue',
			}
			util.badRequest(req, res, next);
			return;
		}

		if (req.body.phone === undefined || req.body.phone.length < 8) {
	    	console.log('signup');
			req.responseBody = {
				success: false,
				message: 'Please provide a valid phone number to continue',
			}
			util.badRequest(req, res, next);
			return;
		}
		// console.log('signupb');
		// if(Number(req.body.bvn) === 0||req.body.bvn===undefined||req.body.bvn.length<9){
		//   req.responseBody = {
		//     success: false,

		//         message: 'Please provide a valid BVN to continue',  
		//   }
		//   util.badRequest(req, res, next);
		//   return;
		// }
		console.log('signupq');
		if (req.body.security_question === undefined || req.body.security_question.length < 1) {
			req.responseBody = {
				success: false,

				message: 'Please provide a valid security question to continue',
			}
			util.badRequest(req, res, next);
			return;
		}
		console.log('signupa');
		if (req.body.security_answer === undefined || req.body.security_answer.length < 1) {
			req.responseBody = {
				success: false,

				message: 'Please provide an answer to your security question to continue',
			}
			util.badRequest(req, res, next);
			return;
		}
		console.log('signupv');
		if (Number(req.body.verifyBy) === 0 || req.body.verifyBy === undefined) {
			req.responseBody = {
				success: false,

				message: 'Please provide a preferred verification option to continue',
			}
			util.badRequest(req, res, next);
			return;
		}

		var token = bcrypt.hashSync(shortid.generate()).replace(/[^\w]/g, "");
		var apprmanager = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			username: req.body.username,
			phone: req.body.phone,
			password: bcrypt.hashSync(req.body.password),
			accountId: shortid.generate(),
			verificationToken: token,
			bvn: req.body.bvn,
			security_question: req.body.security_question,
			security_answer: req.body.security_answer,
			role: 5,
		}
		);
		apprmanager.save(function (err) {
			if (err) {
				req.responseBody = {
					success: false,
		        message: 'User Already Exists',
		        err: err
				}
				util.badRequest(req, res, next);
				return;
			}
			var token_url = mail_url + '/verify-user/' + token;
			// send verification email here
			if (req.body.verifyBy === 'sms') {
				var body = {
					message: "Please click this link to verify your account. \n" + token_url,
					phone: req.body.phone
				}
				util.send_sms(body);
			} else if (req.body.verifyBy === 'email') {
				var dataz = {
					email: req.body.email,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					template: 'email_confirm',
					subject: "New Account Verification",
					url: token_url
				}
				util.Email(dataz);
			} else {
				var body = {
					message: "Please click this link to verify your account. \n" + token_url,
					phone: req.body.phone
				}
				util.send_sms(body);
				var dataz = {
					email: req.body.email,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					template: 'email_confirm',
					subject: "New Account Verification",
					url: token_url
				}
				util.Email(dataz);
			}

			return res.json({
				success: true,
				message: 'A Verification Email Has Been Sent to You',
				result: (apprmanager)
			});
		});

	},


	login: (req, res, next) => {
		if (Number(req.body.email) === 0 || req.body.email === undefined || !util.check_email(req.body.email)) {
			req.responseBody = {
				success: false,

				message: 'A Valid email address must be provided to login',
			}
			util.badRequest(req, res, next);
			return;
		}
		if (Number(req.body.password) === 0 || req.body.password === undefined) {
			req.responseBody = {
				success: false,

				message: 'Please provide a password to login',
			}
			util.badRequest(req, res, next);
			return;
		}
		User.findOne({ email: req.body.email }, function (err, uder) {

			if (err) {
				req.responseBody = {
					success: false,
					message: 'User not found',
				}
				util.badRequest(req, res, next);
				return;
			}
		    if (!uder) {
				req.responseBody = {
					success: false,
					message: 'Email or password incorrect'
				}
				util.badRequest(req, res, next);
				return;
		    } else {
				var user_details = uder;
				//  	if((uder && !user_details.isVerified) || (user1 && user_details.disabled)){
				//          req.responseBody = {
				// 	success: false,
				//         message: 'This user is not active'
				// }
				// util.badRequest(req, res, next);
				//          return;
				//      }
				if (uder !== null) {
					if (!uder.isVerified) {
						req.responseBody = {
							success: false,
							message: 'This account has not been verified'
						}
						util.badRequest(req, res, next);
						return;
					}
					if (!uder.enabled) {
						req.responseBody = {
							success: false,
							message: 'This account has been disabled'
						}
						util.badRequest(req, res, next);
						return;
					}
				}


				bcrypt.compare(req.body.password, user_details.password, function (err, crypt) {
					console.log(crypt);
					if (crypt != true) {
						return res.status(404).send({
							success: false,
							message: 'Password incorrect'
						});
					} else {
						var payload = {
							id: user_details._id,
							accountId: user_details.accountId || user_details.username
						}
						delete user_details.password;
						var token = jwt.sign(payload, util.secret);
						return res.status(200).send({
							success: true,
							message: 'User Logged In Successfully',
							result: {
								user: user_details,
								role: user_details.role,
								token: token,
								isVerified: user_details.isVerified || user_details.disabled,
							}
						});
					}
				})
		    }

		});
	},


	logout: (req, res, next) => {
		req.responseBody = {
			success: true,
			message: 'Logout Completed',
		}
		util.goodRequest(req, res, next);
		return;
	},


	me: (req, res, next) => {
		var id = req.decoded.id;
		User.findById(id, function (err, apprmanager) {
		    if (err || !apprmanager) {
				req.responseBody = {
					success: false,
					message: 'User not found',
				}
				util.badRequest(req, res, next);
				return;
		    }
		    return res.json({
		      success: true,
		      message: 'Retrieved successfully',
		      result: (apprmanager)
		    });
		});
	},


	delete: (req, res, next) => {
		User.findByIdAndRemove(req.params.id, function (err) {
		    if (err) {
				req.responseBody = {
					success: false,
					message: 'User not found',
				}
				util.badRequest(req, res, next);
				return;
		    }
		    return res.json({
		      success: true,
		      message: 'User deleted successfully'
		    })
		});
	},


	edit: (req, res, next) => {
		console.log("update");
		if (req.body.password) {
			req.body.password = bcrypt.hashSync(req.body.password);
		}
		req.body.profile_status = true;
		User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, uder) {
		    console.log("lo", err, uder);
		    if (err) {
				req.responseBody = {
					success: false,
					message: 'User not found',
				}
				util.badRequest(req, res, next);
				return;
		    }
		    User.findById(req.params.id, function (err, apprmanager) {
				res.json({
					success: true,
					message: 'User has been succesfully updated.',
					result: (apprmanager)
				})
				return;
			});

		});
	},

	info: (req, res, next) => {
		User.findById(req.params.id, function (err, apprmanager) {
		    if (err || !apprmanager) {
				req.responseBody = {
					success: false,
					message: 'User not found',
				}
				util.badRequest(req, res, next);
				return;
		    }
		    return res.json({
		      success: true,
		      message: 'Retrieved successfully',
		      result: (apprmanager)
		    });
		});
	},


	resend_confirmation: (req, res, next) => {
		// send verification email here
		if (req.body.email) {
	    	User.findOne({ email: req.body.email }, (err, rsendUser) => {
				if (rsendUser) {
					var token_url = mail_url + '/verify-user/' + rsendUser.verificationToken;
					// send verification email here
					if (req.body.verifyBy === 'sms') {
						var body = {
							message: "Please click this link to verify your account. \n" + token_url,
							phone: rsendUser.phone
						}
						util.send_sms(body);
					} else if (req.body.verifyBy === 'email') {
						var dataz = {
							email: req.body.email,
							subject: "New Account Verification",
							contents: "Please click this link to verify your account. \n" + token_url
						}
						util.Email(dataz);
					} else {
						var body = {
							message: "Please click this link to verify your account. \n" + token_url,
							phone: rsendUser.phone
						}
						util.send_sms(body);
						var dataz = {
							email: req.body.email,
							subject: "New Account Verification",
							contents: "Please click this link to verify your account. \n" + token_url
						}
						util.Email(dataz);
					}
					req.responseBody = {
						success: true,
				        message: 'Confirmation Resent',
					}
					util.goodRequest(req, res, next);
					return;
				} else {
					req.responseBody = {
						success: false,
				        message: 'User Does not exist',
					}
					util.badRequest(req, res, next);
					return;
				}
	    	})
		} else {
	    	req.responseBody = {
				success: false,
				message: 'User Email Required',
			}
			util.badRequest(req, res, next);
			return;
		}
	},

	confirm_account: (req, res, next) => {
		var tken = req.params.tken;
		User.findOne({ verificationToken: tken }, (err, uder) => {
			if (err) {
				req.responseBody = {
					success: false,
					message: 'User not found',
				}
				util.badRequest(req, res, next);
				return;
			}
			if (!uder) {
				return res.send({
					success: false,
					message: 'This Account Was Not Found'
				});
			} else {
				uder.verificationToken = "";
				uder.isVerified = true;
				uder.save();
				return res.send({
					success: true,
					message: 'Account Has Been Verified'
				});
			}
		})
	},


	recover_password: (req, res, next) => {
		var token = bcrypt.hashSync(shortid.generate()).replace(/[^\w]/g, "");
		if (req.body.email) {
			User.findOne({ email: req.body.email }, (error, result) => {
				if (error || result === null) {
					req.responseBody = {
						success: false,
				        message: 'User with this email not found',
					}
					util.badRequest(req, res, next);
					return;
				} else {
					result.verificationToken = token;
					var token_url = mail_url + '/change-password/' + result.verificationToken;
					// send verification email here
					if (req.body.verifyBy === 'sms') {
						var body = {
							message: "Please click this link to change your password. \n" + token_url,
							phone: result.phone
						}
						util.send_sms(body);
					} else if (req.body.verifyBy === 'email') {
						var dataz = {
							email: req.body.email,
							firstName: result.firstName,
							lastName: result.lastName,
							template: 'reset_email',
							subject: "Password Reset on FUNDALL",
							url: token_url
						}
						util.Email(dataz);
					} else {
						var body = {
							message: "Please click this link to change your password. \n" + token_url,
							phone: result.phone
						}
						util.send_sms(body);
						var dataz = {
							email: req.body.email,
							firstName: result.firstName,
							lastName: result.lastName,
							template: 'reset_email',
							subject: "Password Reset on FUNDALL",
							url: token_url
						}
						util.Email(dataz);
					}
					result.save();
					req.responseBody = {
						success: true,
				        message: 'Recover Message Sent',
					}
					util.goodRequest(req, res, next);
					return;
				}
			})
		} else {
			req.responseBody = {
				success: false,
				message: 'Email is required for this process',
			}
			util.badRequest(req, res, next);
			return;
		}
	},
	change_password: (req, res, next) => {
		if (req.body.password) {
			req.body.password = bcrypt.hashSync(req.body.password);

			User.findOne({ verificationToken: req.body.token }, function (err, uder) {
				console.log(req.body.token, err);
				if (err || uder === null) {
					req.responseBody = {
						success: false,
				        message: 'Verification Code Invalid',
					}
					util.badRequest(req, res, next);
					return;
				}
				uder.password = req.body.password;
				uder.save();
				res.json({
					success: true,
					message: 'Password has been succesfully updated.',
				})
				return;


			});
		} else {
			req.responseBody = {
				success: false,
				message: 'The New Password is required',
			}
			util.badRequest(req, res, next);
			return;
		}
	},

	save_complaint: (req, res, next) => {
		console.log(req.decoded.id);
		if (req.body.complaint === undefined || req.body.complaint.length < 1) {
			req.responseBody = {
				success: false,
				message: 'Please provide a complaint',
			}
			util.badRequest(req, res, next);
			return;
		}
		req.body.complaintBy = req.decoded.id;
		var complaints = new Complain(req.body);
		complaints.save(function (err) {
		    if (err) {
				req.responseBody = {
					success: false,
					message: 'Failed to save complaint',
				}
				util.badRequest(req, res, next);
				return;
			}

		    return res.json({
		      success: true,
		      result: (complaints),
		      message: 'Your Complaint is receiving due consideration. You will receive a response once it is resolved',
		    });
		  });
	},


};


module.exports = user_mgt_apis;
