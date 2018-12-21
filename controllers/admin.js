var Loan = require('../models/products');
var Users = require('../models/user');
var Admins = require('../models/user');
var bcrypt         = require('bcrypt-nodejs');
var util = require('../middleware/util');
var Wallet = require('../models/Wallet');
var shortid        = require('shortid');
var jwt = require('jsonwebtoken');
const errorBuilder = require(__base + 'services/error/builder');
var Complaints = require('../models/complaints');
var Loans = require('../models/loans');
var History = require('../models/History');
var Account = require('../models/Accounts');


var admin_apis = {

	// api endpoint for fetching all loans
	get_all_loans : function(req, res, next){
		Loan.paginate({},{page: req.query.page||1, limit: 20}, (err, loans)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch all loan Product',	
				}
				util.badRequest(req, res, next);
				return;
			}
			
			// send response to request
			return res.json({
		      success: true,
		      message: 'All Loan Products retrieved successfully',
		      result: {
		      	loans:(loans.docs),
		      	pages: (loans.pages),
		      }
		    });
		});
	},


	// disburse funds for loan
	disburse: (req, res, next)=>{
		Loans.findById(req.params.id, (err, loans)=>{
			// handle error
			if(err||loans===null){
				req.responseBody = {
					success: false,
			        message: 'operation failed because this Loan does not exist',	
				}
				util.badRequest(req, res, next);
				return;
			}

			Account.findOne({account_holder: loans.account_holder}, (errorAccount, account)=>{
				if(errorAccount||account===null){
					req.responseBody = {
						success: false,
				        message: 'operation failed because no account was registered by this user',	
					}
					util.badRequest(req, res, next);
					return;
				}

				const options = {
					method: 'POST',
					uri: 'https://api.paystack.co/transfer',
					json: true,
					body: {
						"source": "balance",
						"amount": loans.amount,
						"recipient": account.recipient_code
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': authorization,
					}
				};
				Request(options)
					.then((response)=>{
						account.transfer_code = response.data.transfer_code;
						account.save();
					    var history = new History({
					    	description: "Loan Transferred to Bank Account",
					    	amount: Number(loans.amount),
					    	accountHolder: req.decoded.id,
					    });
					    history.save((err)=>{
					    	var cc = new Date();
					    	var new_repay = [];
					    	for (var i = 1; i < Number(loans.duration)+1; i++) {
					    		// status
					    		// 0 = untouched,1=paid,2=late,
					    		new_repay.push({
					    			due_date: cc.setMonth(cc.getMonth()+i),
					    			amount_due: loans.monthly_repayments,
					    			status: 0,
					    			penalty: 0,
					    			days: 0,
					    		});
					    		cc.setMonth(cc.getMonth()-i);
					    	}
					    	loans.repayments = new_repay;
					    	loans.disbursed = true;
					    	loans.save();
					    	res.json({
								status: true,
								message: "Transfer Initiated. Enter OTP to complete the transaction.",
							});
							return;	
					    })			
					})
					.catch((error)=>{
						req.responseBody = {
							success: false,
							error: error,
					        message: 'Failed to transfer funds to this account',	
						}
						util.badRequest(req, res, next);
						return;
					})
			})
		});
	},

	// api endpoint for fetching all users
	get_all_users : function(req, res, next){
		Users.paginate({role: 5},{page: req.query.page||1, limit: 20}, (err, allUser)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch all users',	
				}
				util.badRequest(req, res, next);
				return;
			}

			// send response to request
			return res.json({
		      success: true,
		      message: 'All Users retrieved successfully',
		      result: {
		      	users:(allUser.docs),
		      	pages: (allUser.pages),
		      }
		    });
		});
	},

	// api endpoint for fetching all customer care personnel
	get_all_customercare : function(req, res, next){
		Admins.paginate({role: 4},{page: req.query.page||1, limit: 20}, (err, all_cc)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed  to fetch all customer care agents',	
				}
				util.badRequest(req, res, next);
				return;
			}

			// send response to request
			return res.json({
		      success: true,
		      message: 'Customer Care officers retrieved successfully',
		      result: {
		      	managers:(all_cc.docs),
		      	pages: (all_cc.pages),
		      }
		    });
		});
	},


	// api endpoint for fetching all user complaints
	get_all_complaints : function(req, res, next){
		// console.log(new Date().now());
		var query = {};
		if(req.query.user){
			query.complaintBy = req.query.user;
		}
		Complaints.paginate(query, {page: req.query.page||1, limit: 20},(err, all_cc)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch all complaints',	
				}
				util.badRequest(req, res, next);
				return;
			}

			// send response to request
			return res.json({
		      success: true,
		      message: 'Complaints retrieved successfully',
		      result: {
		      	complaints:(all_cc.docs),
		      	pages: (all_cc.pages),
		      }
		    });
		});
	},


	// api endpoint for fetching all approval managers
	get_all_apprmanagers : function(req, res, next){
		Admins.paginate({role: 2},{page: req.query.page||1, limit: 20}, (err, all_am)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch all approval managers',	
				}
				util.badRequest(req, res, next);
				return;
			}

			// send response to request
			return res.json({
		      success: true,
		      message: 'Approval Managers retrieved successfully',
		      result: {
		      	managers:(all_am.docs),
		      	pages: (all_am.pages),
		      }
		    });
		});
	},

	// api endpoint for fetching all disbursement managers
	get_all_disbmanagers : function(req, res, next){
		Admins.paginate({role: 3},{page: req.query.page||1, limit: 20}, (err, all_dm)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch all disbursement managers',	
				}
				util.badRequest(req, res, next);
				return;
			}

			// send response to request
			return res.json({
		      success: true,
		      message: 'Disbursement Managers retrieved successfully',
		      result: {
		      	managers:(all_dm.docs),
		      	pages: (all_dm.pages),
		      }
		    });
		});
	},

	// api endpoint for fetching all superadmins
	get_all_superadmins : function(req, res, next){
		Admins.paginate({role: 1}, {page: req.query.page||1, limit: 20},(err, all_dm)=>{
			// handle error
			if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch all super admins',	
				}
				util.badRequest(req, res, next);
				return;
			}

			// send response to request
			return res.json({
		      success: true,
		      message: 'Super Admins retrieved successfully',
		      result: {
		      	managers:(all_dm.docs),
		      	pages: (all_dm.pages),
		      }
		    });
		});
	},


	appr_create : function (req, res, next) {

		if(req.body.phone.length !== 11){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid phone number is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}

		if(req.body.firstName.length < 1||req.body.lastName.length < 1||req.body.username.length < 1||req.body.password.length < 1){
			req.responseBody = {
				success: false,
				
		        message: 'Please provide valid details to proceed',	
			}
			util.badRequest(req, res, next);
			return;
		}
	  	
					
		if(req.body.email.length < 1 || !util.check_email(req.body.email)){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid email is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}
	  var apprmanager = new Admins(
	    {
	      firstName: req.body.firstName,
	      lastName: req.body.lastName,
	      email: req.body.email,
	      username: req.body.username,
	      phone: req.body.phone,
	      password: bcrypt.hashSync(req.body.password),
	      role: 2,	
	      accountId: shortid.generate(), 
	      isVerified: true,     
	    }
	  );

	  apprmanager.save(function(err) {
	    if(err){
			req.responseBody = {
				success: false,
		        message: 'A User Exists with these details',	
			}
			util.badRequest(req, res, next);
			return;
		}
	    return res.json({
	      success: true,
	      message: 'New approval manager has been created',
	      result: (apprmanager)
	    });
	  });
	},


	appr_details : function (req, res, next) {
	  Admins.findById(req.params.id, function(err, apprmanager) {
	    if(err||apprmanager===null){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch the manager with this id',	
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

	appr_delete : function(req, res, next){
	  Admins.findByIdAndRemove(req.params.id, function(err) {
	    if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to delete the manager with that id',	
				}
				util.badRequest(req, res, next);
				return;
			}
	    return res.json({
	      success: true,
	      message: 'manager deleted successfully'
	    })
	  });
	},

	update_admin: (req, res, next)=>{
		if(req.body.password){
			req.body.password = bcrypt.hashSync(req.body.password);
		}
		Admins.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, uder) {
		    if (err) {
		    	req.responseBody = {
					success: false,
			        message: 'Failed to update manager with that id',	
				}
				util.badRequest(req, res, next);
				return;
		    }
		    return res.json({
		      success: true,
		      message: 'Detail has been succesfully updated.'
		    })
		});
	},
	// controller to resolve complaints
	resolve_complaint: (req, res, next)=>{
		var response = {
			response: req.body.response,
			responseAt: new Date().toISOString(),
			responseBy: req.decoded.id
		};
		Complaints.findByIdAndUpdate(req.params.id, {$push: {responses: response}}, function (err, uder) {
		    if (err) {
		    	req.responseBody = {
					success: false,
			        message: "Failed to save your response to this complaint",	
				}
				util.badRequest(req, res, next);
				return;
		    }
		    Complaints.findById(req.params.id, (error, complaint)=>{
		    	if (err||complaint===null) {
			    	req.responseBody = {
						success: false,
				        message: "Failed to fetch this complaint",	
					}
					util.badRequest(req, res, next);
					return;
			    }
		    	return res.json({
			      success: true,
			      message: 'complaint has been succesfully updated.',
			      result: (complaint)
			    })
		    })
		});
	},

	// controller to resolve complaints
	save_comments: (req, res, next)=>{
		Loans.findById(req.params.id, function (err, uder) {
		    if (err||uder===null) {
		    	req.responseBody = {
					success: false,
			        message: 'Failed to find a loan by this id',	
				}
				util.badRequest(req, res, next);
				return;
		    }
		    var comment = {
		    	comment: req.body.commen,
		    	commentBy: req.decoded.accountId
		    }
		    uder.comments.push(comment);
		    uder.save();
		    return res.json({
		      success: true,
		      message: 'Loan has been succesfully updated.'
		    })
		});
	},

	disb_create : function (req, res, next) {
		if(req.body.phone.length !== 11){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid phone number is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}

		if(req.body.firstName.length < 1||req.body.lastName.length < 1||req.body.username.length < 1||req.body.password.length < 1){
			req.responseBody = {
				success: false,
				
		        message: 'Please provide valid details to proceed',	
			}
			util.badRequest(req, res, next);
			return;
		}
					
		if(req.body.email.length < 1 || !util.check_email(req.body.email)){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid email is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}
	  var disbmanager = new Admins(
	    {
	      firstName: req.body.firstName,
	      lastName: req.body.lastName,
	      email: req.body.email,
	      phone: req.body.phone,
	      username: req.body.username,
	      password: bcrypt.hashSync(req.body.password),
	      role: 3,
	      accountId: shortid.generate(),
	      isVerified: true,
	    }
	  );

	  disbmanager.save(function(err) {
	    if(err){
	    	console.log(err);
				req.responseBody = {
					success: false,
			        message: 'Failed to enroll disbursment manager',	
				}
				util.badRequest(req, res, next);
				return;
			}
	    return res.json({
	      success: true,
	      message: 'New disbursment manager has been created',
	      result: (disbmanager)
	    });
	  });
	},


	cc_create : function(req, res, next) {
		if(req.body.phone.length !== 11){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid phone number is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}

		if(req.body.firstName.length < 1||req.body.lastName.length < 1||req.body.username.length < 1||req.body.password.length < 1){
			req.responseBody = {
				success: false,
				
		        message: 'Please provide valid details to proceed',	
			}
			util.badRequest(req, res, next);
			return;
		}
					
		if(req.body.email.length < 1 || !util.check_email(req.body.email)){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid email is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}
	  var customercare = new Admins(
	    {
	      firstName: req.body.firstName,
	      lastName: req.body.lastName,
	      email: req.body.email,
	      phone: req.body.phone,
	      username: req.body.username,
	      password: bcrypt.hashSync(req.body.password),
	      role: 4,
	      accountId: shortid.generate(),
	      isVerified: true,
	    }
	  );

	  customercare.save(function(err){
	    if(err){
				req.responseBody = {
					success: false,
			        message: 'Failed to enroll customer care agent',	
				}
				util.badRequest(req, res, next);
				return;
			}
	    return res.json({
	      success: true,
	      message: 'New Customer care created',
	      result: (customercare)
	    });
	  });
	},

	



	super_create : function(req, res, next) {
		console.log(req.body);
		if(req.body.phone.length !== 11){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid phone number is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}

		if(req.body.firstName.length < 1||req.body.lastName.length < 1||req.body.username.length < 1||req.body.password.length < 1){
			req.responseBody = {
				success: false,
				
		        message: 'Please provide valid details to proceed',	
			}
			util.badRequest(req, res, next);
			return;
		}
					
		if(req.body.email.length < 1 || !util.check_email(req.body.email)){
			req.responseBody = {
				success: false,
				
		        message: 'A Valid email is required to complete',	
			}
			util.badRequest(req, res, next);
			return;
		}
	  var customercare = new Admins(
	    {
	      firstName: req.body.firstName,
	      lastName: req.body.lastName,
	      email: req.body.email,
	      phone: req.body.phone,
	      username: req.body.username,
	      password: bcrypt.hashSync(req.body.password),
	      role: 1,
	      accountId: shortid.generate(),
	      isVerified: true,
	    }
	  );

	  customercare.save(function(err){
	    if(err){
				req.responseBody = {
					success: false,
			        message: err,	
				}
				util.badRequest(req, res, next);
				return;
			}
	    return res.json({
	      success: true,
	      message: 'New Super Admin created',
	      result: (customercare)
	    });
	  });
	},

	
	get_all_statistics: (req, res, next)=>{
		const errorHandler = (error) => next(error);
		var stats = {};
		Admins.find({role:4}, (err, cc)=>{
			if(!err){
				stats.customercare = cc.length;
				Admins.find({role: 2},(err, appr)=>{
					if(!err){
						stats.apprmanager = appr.length;
						Admins.find({role:3}, (err, disb)=>{
							if(!err){
								stats.disbmanager = disb.length;
								Users.find({role:5},(err, users)=>{
									if(!err){
										stats.users = users.length;
										Complaints.find({resolved:false}, (err, comment)=>{
											stats.complaints = comment.length;
											Loans.find({}, (err, loans)=>{
												stats.loans = loans.length;
												Loan.find({}, (err, products)=>{
													if(!err){
														stats.products = products.length;
														return res.json({
															success: true,
															stats: stats,
															message:"done"
														})

													}else{
														errorHandler(errorBuilder.badRequest('Cannott fetch statistics'));
													}
												})
											})
										})
									}else{
										errorHandler(errorBuilder.badRequest('Cannott fetch statistics'));
									}
								})
							}else{
								errorHandler(errorBuilder.badRequest('Cannott fetch statistics'));
							}
						})
					}else{
						errorHandler(errorBuilder.badRequest('Cannott fetch statistics'));
					}
				})
			}else{
				req.responseBody = {
					success: false,
			        message: 'Operation Failed',	
				}
				util.badRequest(req, res, next);
				return;
			}
		})
	},


};


module.exports = admin_apis;
