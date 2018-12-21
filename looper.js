var CronJob = require('cron').CronJob;
var Loans = require('./models/loans');
var async = require('async');
var util = require('./middleware/util');
var User = require('./models/user');





new CronJob('*/10 * * * * *', function() {
	
	var format_date = (day, month, year)=>{
      var formated = "";
      var months = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sept.','Oct.','Nov.','Dec.'];
      if(day !==1||day !==2||day !==3||day !==21||day !==22||day !==23||day !==31){
        formated = formated+day+'th ';
      }
      if(day ===1|day ===21||day ===31){
        formated = formated+day+'st ';
      }
      if(day ===2||day ===22){
        formated = formated+day+'nd ';
      }
      if(day ===3||day ===23){
        formated = formated+day+'rd ';
      }
      formated = formated+months[month]+' '+year;
      return formated;
    }
  var due_pay = [];
  Loans.find({disbursed: true}, (err, loans)=>{
    if(err){
      return;
    }else{
      async.each(loans, (loan, callback)=>{
      	async.each(loan.repayments, (repay, callback2)=>{
      		var diff =(new Date(repay.due_date).getTime() - new Date().getTime()) / 1000;
	         diff /= (60 * 60 * 24 );
	        var due = Math.abs(Math.round(diff));
	        if(due < 0 && repay.status === 0){
	        	repay.status = 2
	            repay.days = due;
	        }
	        if(due < 0 && repay.status === 2){
	            repay.days = due;
	        }
	        if(repay.status ===2 && repay.days > 5){
	        	User.findById(loans.accountHolder, (error, user)=>{
	        		if(error){
				      return;
				    }else{
              var dataz = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                template: 'overdue',
                days: repay.days,
					    	subject: "Overdue Monthly Loan Repayment [URGENT]",
                url: mail_url
              }
                util.Email(dataz);
  				    }
	        	})
	        }
      		callback2();
	      }, (errloop2)=>{
	      	// console.log(loan.repayments);
	      	Loans.findByIdAndUpdate(loan._id, {$set: loan}, function (err, uder) {
		       return;
	      	})
	      })

        
        callback();
      }, (errloop)=>{
        return;
      })
    }
  });
}, null, true);