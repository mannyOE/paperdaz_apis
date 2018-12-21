var Wallet = require('../models/Wallet');
var Card = require('../models/Card');
var Account = require('../models/Accounts');
var History = require('../models/History');
var util = require('../middleware/util');
var Request = require('request-promise');
const authorization = "Bearer sk_test_bc9c2f5ed009a0b65d5e88f0897929c6c3859fac";


var user_wallet_apis = {

	// initiate card api
	initiateCard: (req, res, next)=>{
			if(req.body.card.cvv.length !== 3){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card cvv is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.number.length !== 16){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.type.length < 1){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card type is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.expiry_month.length !== 2||Number(req.body.card.expiry_month)===0){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card expiry month is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.expiry_year.length !== 2||Number(req.body.card.expiry_year)===0){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid expiry year is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.pin.length !== 4){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card pin is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.phone.length !== 11){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid phone number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.birthday.length !== 10 || util.check_dob(req.body.birthday)){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid date of birth is required to complete',	
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
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/charge',
			body: {
				"card": req.body.card,
			    "amount": "5",
				"pin": req.body.pin,
				"phone": req.body.phone,
				"birthday": req.body.birthday,
			    "email": req.body.email,
			},
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{
				// save details to db
				var card_details = new Card({
					Auth: response.data.authorization.authorization_code,
					cardNo: response.data.authorization.last4,
					year: response.data.authorization.exp_year,
					month: response.data.authorization.exp_month,
					type: response.data.authorization.card_type,
					month: response.data.authorization.exp_month,
					email: response.data.customer.email,
					phone: response.data.customer.phone,
					accountHolder: req.decoded.id,
				});
				var wallet_details = new Wallet({
					accountHolder: req.decoded.id,
					balance: 0,
				});

				card_details.save((err)=>{
					if(err){
						req.responseBody = {
							success: false,
					        message: 'Failed to Add Card',	
						}
						util.badRequest(req, res, next);
						return;
					}
					wallet_details.save((err)=>{
						if(err){
							req.responseBody = {
								success: false,
						        message: 'Failed to create wallet',	
							}
							util.badRequest(req, res, next);
							return;
						}
						res.json({
							status: true,
							message: "Card added successfully",
							result: card_details
						});
						return;
					})
				});
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
			        message: error.error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},

	// initiate Bank account api
	initiateAccount: (req, res, next)=>{
			if(req.body.bank.code.length !== 3){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid bank code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.bank.account_number.length !== 10){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid bank account number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.phone.length !== 11){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid phone number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.birthday.length !== 10 ){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid date of birth is required to complete',	
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
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/charge',
			body: {
				email:req.body.email,
				  amount:"5",
				  metadata:{
				    custom_fields:[
				      {
				        value:"makurdi",
				        display_name: "Donation for",
				        variable_name: "donation_for"
				      }
				    ]
				  },
				  bank:{
				      code:req.body.bank.code,
				      account_number:req.body.bank.account_number
				  },
				  birthday:req.body.birthday
				},
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{

				var account_details = new Account({
					type: "nuban",
					ref: response.data.reference,
					bank_code: req.body.bank.bank_code,
					accountHolder: req.decoded.id,
					account_number: req.body.bank.account_number,
					email: req.body.email
				});
				account_details.save((err)=>{
					if(err){
						req.responseBody = {
							success: false,
							
					        message: 'Failed to Add Account',	
						}
						util.badRequest(req, res, next);
						return;
					}
					return res.json({
						status: true,
						message: "Bank Account Added",
						result: response.data
					});
				})
				
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
			        message: error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},



	// initiate monthly repayment via bank account
	pay_via_account: (req, res, next)=>{
			if(req.body.bank.code.length !== 3){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid bank code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.bank.account_number.length !== 10){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid bank account number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.phone.length !== 11){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid phone number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.birthday.length !== 10 ){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid date of birth is required to complete',	
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
			
			Loans.findOne({accountHolder: req.decoded.id}, (errorLoan, loan)=>{

				var current = loan.repayments.find((pay)=>{
		      		return pay.status===0;
		      	});
				const options = {
					method: 'POST',
					uri: 'https://api.paystack.co/charge',
					body: {
						email:req.body.email,
						  amount:current.amount_due,
						  metadata:{
						    custom_fields:[
						      {
						        value:"makurdi",
						        display_name: "Monthly repayment for FUNDALL loan",
						        variable_name: "donation_for"
						      }
						    ]
						  },
						  bank:{
						      code:req.body.bank.code,
						      account_number:req.body.bank.account_number
						  },
						  birthday:req.body.birthday
						},
					json: true,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': authorization,
					}
				};
				Request(options)
					.then((response)=>{
						current.status = 1;
						if(loan.repayments.find((pay)=>{
				      		return pay.status===0;
				      	}) === null){
							loan.repaid = true;
				      	}
						loan.save();
						return res.json({
					      success: true,
					      message: 'Monthly Payment Made Successfully.'
					    })
						
					})
					.catch((error)=>{
						req.responseBody = {
							success: false,
					        message: error.response.body.data.message,	
						}
						util.badRequest(req, res, next);
						return;
					})
			});
	},



	// initiate monthly repayment via bank account
	pay_via_card: (req, res, next)=>{
			if(req.body.card.cvv.length !== 3){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card cvv is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.number.length !== 16){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.type.length < 1){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card type is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.expiry_month.length !== 2||Number(req.body.card.expiry_month)===0){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card expiry month is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.card.expiry_year.length !== 2||Number(req.body.card.expiry_year)===0){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid expiry year is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.pin.length !== 4){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid card pin is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.phone.length !== 11){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid phone number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.birthday.length !== 10 ){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid date of birth is required to complete',	
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
			
			Loans.findOne({accountHolder: req.decoded.id}, (errorLoan, loan)=>{

				var current = loan.repayments.find((pay)=>{
		      		return pay.status===0;
		      	});
				const options = {
					method: 'POST',
					uri: 'https://api.paystack.co/charge',
					body: {
						"card": req.body.card,
					    "amount": current.amount_due,
						"pin": req.body.pin,
						"phone": req.body.phone,
						"birthday": req.body.birthday,
					    "email": req.body.email,
					},
					json: true,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': authorization,
					}
				};
				Request(options)
					.then((response)=>{
						current.status = 1;
						if(loan.repayments.find((pay)=>{
				      		return pay.status===0;
				      	}) === null){
							loan.repaid = true;
				      	}
						loan.save();
						return res.json({
					      success: true,
					      message: 'Monthly Payment Made Successfully.'
					    })
						
					})
					.catch((error)=>{
						req.responseBody = {
							success: false,
					        message: error.response.body.data.message,	
						}
						util.badRequest(req, res, next);
						return;
					})
			});
	},


	charge_user_account: (req, res, next)=>{
		
		if(req.body.authorization_code.length < 1){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid authorization_code code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(Number(req.body.amount)<1){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid amount is required to complete',	
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
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/charge',
			body: {
				"authorization_code": req.body.authorization_code,
				 "amount": req.body.amount,
			    "email": req.body.email,
			},
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};

		Request(options)
			.then((response)=>{
				// save details to db
				Wallet.findOne({accountHolder: req.decoded.id},(err, wallet)=>{
						if(err||wallet===null){
							req.responseBody = {
								success: false,
						        message: 'Failed to find wallet',	
							}
							util.badRequest(req, res, next);
							return;
						}

						wallet.balance = wallet.balance + Number(req.body.amount);
						wallet.save();
						var history = new History({
						    	description: "Wallet Funded",
						    	accountHolder: req.decoded.id,
						    	amount: Number(req.body.amount)
						    });
						    history.save((err)=>{
								res.json({
									status: true,
									message: "Charge Attempt Successfull",
									result: response.data
								});
								return;
							})
						})
				
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
					error: error,
			        message: error.error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},
	submit_otp: (req, res, next)=>{ 
			if(req.body.otp.length !== 6  ){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid OTP code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.reference.length < 1){
				req.responseBody = {
					success: false,
					
			        message: 'A Reference code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/charge/submit_otp',
			body: {
				"reference": req.body.reference,
			    "otp": req.body.otp,
			},
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{
				Account.update({ref:req.body.reference}, {$set: {verified: true, ref: ""}}, function (err, uder) {
				    if (err) {
				    	req.responseBody = {
							success: false,
							
					        message: 'Failed to update account information',	
						}
						util.badRequest(req, res, next);
						return;
				    }
				    res.json({
						status: true,
						message: "OTP Submitted and account updated",
						result: response.data
					});
					return;
				});
				
				
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
			        message: error.error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},

	submit_otp_transfer: (req, res, next)=>{ 
			if(req.body.otp.length !== 6  ){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid OTP code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.transfer_code.length < 1){
				req.responseBody = {
					success: false,
					
			        message: 'A Transfer code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/transfer/finalize_transfer',
			body: {
				"transfer_code": req.body.transfer_code,
			    "otp": req.body.otp,
			},
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{
				Account.update({transfer_code:req.body.reference}, {$set: {verified: true, ref: ""}}, function (err, uder) {
				    if (err) {
				    	req.responseBody = {
							success: false,
							
					        message: 'Failed to update account information',	
						}
						util.badRequest(req, res, next);
						return;
				    }
				    res.json({
						status: true,
						message: "OTP Submitted and account updated",
						result: response.data
					});
					return;
				});
				
				
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
			        message: error.error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},

	fetch_all_banks: (req, res, next)=>{
		const options = {
			method: 'GET',
			uri: 'https://api.paystack.co/bank',
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{
				res.json({
					status: true,
					message: "Available Banks Retrieved",
					result: response.data
				});
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
			        message: error.error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},


	disable_otp_requirement: (req, res, next)=>{
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/transfer/disable_otp',
			json: true,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{
				res.json({
					status: true,
					message: "OTP Disabled",
					result: response.data
				});
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
			        message: error.error.message,	
				}
				util.badRequest(req, res, next);
				return;
			})
	},

	fetch_cards: (req, res, next)=>{
		Card.find({accountHolder: req.decoded.id}, (error, cards)=>{
			if(error){
				req.responseBody = {
					success: false,
			        message: 'Failed to fetch Cards',	
				}
				util.badRequest(req, res, next);
				return;
			}
			return res.json({
				status: true,
				message: "Cards Retrieved",
				result: (cards)
			})
		})
	},


	fetch_accounts: (req, res, next)=>{
		Account.find({accountHolder: req.decoded.id}, (error, accounts)=>{
			if(error){
				req.responseBody = {
					success: false,
			        message: 'Failed to Fetch Accounts',	
				}
				util.badRequest(req, res, next);
				return;
			}
			return res.json({
				status: true,
				message: "Accounts Retrieved",
				result: (accounts)
			})
		})
	},

	fetch_wallet: (req, res, next)=>{
		Wallet.find({accountHolder: req.decoded.id}, (error, wallet)=>{
			if(error){
				req.responseBody = {
					success: false,
			        message: 'Failed to Fetch Wallet',	
				}
				util.badRequest(req, res, next);
				return;
			}
			return res.json({
				status: true,
				message: "Wallet Retrieved",
				result: (wallet)
			})
		})
	},

	create_recipient: (req, res, next)=>{
			if(req.body.type.length < 2){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid account type is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.name.length < 2){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid account name is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.description.length < 1){
				req.responseBody = {
					success: false,
					
			        message: 'Please enter a description to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.account_number.length !== 10){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid account number is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.bank_code.length !== 3){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid bank code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
			if(req.body.currency.length !== 3){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid currency code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
		const options = {
			method: 'POST',
			uri: 'https://api.paystack.co/transferrecipient',
			json: true,
			body: {
				"name": req.body.name,
				"type": "nuban",
				"description": "A New Reciepient",
				"currency": "NGN",
				"bank_code": req.body.bank_code,
				"account_number": req.body.account_number
			},
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authorization,
			}
		};
		Request(options)
			.then((response)=>{
				
				Account.findByIdAndUpdate(req.params.id, {$set: {recipient_code: response.data.recipient_code}}, function (err, uder) {
				    if (err) {
				    	req.responseBody = {
							success: false,
							
					        message: 'Failed to Save Recipient Code',	
						}
						util.badRequest(req, res, next);
						return;
				    }
				    res.json({
						status: true,
						message: "Recipient Code Generated",
						result: response.data
					});
					return;
				});
				
			})
			.catch((error)=>{
				req.responseBody = {
					success: false,
					error: error,
			        message: 'Failed to generate recipient code',	
				}
				util.badRequest(req, res, next);
				return;
			})
	},

	// transfer funds from wallet to bank account
	trasfer_to_account: (req, res, next)=>{
		if(Number(req.body.amount)<1 ||req.body.recipient_code.length<1||!req.body.amount||!req.body.recipient_code){
				req.responseBody = {
					success: false,
					
			        message: 'A Valid Amount and a recipient code is required to complete',	
				}
				util.badRequest(req, res, next);
				return;
			}
		Account.find({recipient_code:req.body.recipient_code,accountHolder: req.decoded.id},(errors, account)=>{

			if(errors ||account===null){
				req.responseBody = {
					success: false,
					
			        message: 'This account is not registered with us',	
				}
				util.badRequest(req, res, next);
				return;
			}

			Wallet.findOne({accountHolder: req.decoded.id}, (err, wallet)=>{
				if(err ||wallet===null){
					req.responseBody = {
						success: false,
						
				        message: 'No Wallet for this user',	
					}
					util.badRequest(req, res, next);
					return;
				}
				if(wallet.balance < Number(req.body.amount)+50){
					req.responseBody = {
						success: false,
						
				        message: 'Insufficient balance in your wallet',	
					}
					util.badRequest(req, res, next);
					return;
				}else{
					const options = {
						method: 'POST',
						uri: 'https://api.paystack.co/transfer',
						json: true,
						body: {
							"source": "balance",
							"amount": req.body.amount,
							"recipient": req.body.recipient_code
						},
						headers: {
							'Content-Type': 'application/json',
							'Authorization': authorization,
						}
					};
					Request(options)
						.then((response)=>{
							var balance = wallet.balance - Number(req.body.amount);
							Wallet.findOne({accountHolder:req.decoded.id}, function (err, uder) {
							    if (err) {
							    	req.responseBody = {
										success: false,
										
								        message: 'Failed to update user wallet',	
									}
									util.badRequest(req, res, next);
									return;
							    }
							    uder.balance = balance;
							    uder.save();
							    var history = new History({
							    	description: "Cash Transfer to Bank Account",
							    	amount: Number(req.body.amount),
							    	accountHolder: req.decoded.id,
							    });
							    history.save((err)=>{
							    	res.json({
										status: true,
										message: "Transfer completed and user wallet updated",
										result: uder
									});
									return;	
							    })
							    
							});				
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
					}	
			})
		})
		
	},
	fetch_history: (req, res, next)=>{
		History.find({accountHolder: req.params.id}, (error, history)=>{
			if(error){
				req.responseBody = {
					success: false,
			        message: 'Failed to Fetch History',	
				}
				util.badRequest(req, res, next);
				return;
			}
			return res.json({
				status: true,
				message: "Histories Retrieved",
				result: (history)
			})
		})
	}
	

};


module.exports = user_wallet_apis;
