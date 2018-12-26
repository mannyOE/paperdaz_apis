var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var tor = "We Love Crevance";
app.use(bodyParser.json());
var jwt = require('jsonwebtoken');
const User = require(__base + 'models/user'); // get the mongoose model
var Request = require('request-promise');

var Icons = require('../models/icons');
var Product = require('../models/products');


var sms_auth = {
  username: "faith.dike@natterbase.com",
  password: "qwertyuiop"
};





module.exports = {
  isLoggedIn: (req, res, next) => {
    var token = req.headers['token'] || req.body.token || req.params.token;
    console.log(token);
    if (token) {
      jwt.verify(token, tor, function (err, decoded) {
        if (err) {
          return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
        } else {

          req.decoded = decoded;
          User.findOne({accountId:req.decoded.accountId}, function (err, user) {
            if (!user) {
              return res.status(403).send({
                success: false,
                message: 'User does not exist.'
              });
            }
            req.role = user.role;
            
            next();


          })
          // check if account is Blocked
        }
      });
    } else {

      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  },
  whoAmI: (id, callback) => {
    User.findById(id, function (err, user) {
      callback(user.role);
    })
  },
  isApprovalManager(role) {
    return role == 2;
  },
  isCustomerCare(role) {
    return role == 4;

  },
  isUser(role) {
    return role == 5;

  },
  isDisbursementManager(role) {
    return role == 3;

  },
  isAdmin(role) {
    return role == 1;

  },
  profile_complete: (req, res, next) => {
    var id = req.decoded.id;
    User.findById(id, function (err, apprmanager) {
      if (err || !apprmanager) {
        res.status(400).send({
          success: false,
          message: 'This User does not exist',
        })
        return;
      }
      if (apprmanager.profile_status) {
        next()
      } else {
        res.status(200).send({
          success: false,
          message: 'Profile Incomplete. Complete Profile to be able to apply for loans',
        });
        return;
      }
    });
  },
  upload: function (req, res, next) {
    if (!req.files) {
      console.log('no file for upload');
      return next();
    }

    console.log();
    var image = req.files.photo;
    if (!fs.existsSync("./public/contents/profile")) {
      fs.mkdir("./public/contents/profile", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.photo) {
      console.log('no photo');
      if (req.method == "POST") {
        res.json({
          success: false,
          message: 'profile photo upload Required',
        });
        return;
      }
      if (req.method == "PUT") {
        return next();
      }
    }
    // next()
    var x = image.name.split(".");
    var ext = x[x.length - 1];
    var file = new Date().getTime() + "." + ext;
    var rename = './public/contents/profile/' + file;
    image.mv(rename, function (err) {
      req.body.image = 'contents/profile/' + file;
      console.log('upload complete')

      User.findById(req.params.id, function (err, apprmanager) {
        if (err || apprmanager === null) {
          next()
        } else {
          if (fs.existsSync("./public/" + apprmanager.image)) {
            fs.unlink("./public/" + apprmanager.image, function (err) {
              if (err) {
                return console.log('failed to write directory', err);
              }
            });
          }
          return next();
        }
      });
    });
  },

  upload_cheque: function (req, res, next) {
    var required = requirements.find((e)=>{
      e.blank_cheque === true;
    });
    if(required===null){
      next();
    }
    if (!req.files) {
      console.log('no file for upload');
      return next();
    }

    console.log();
    
    if (!fs.existsSync("./public/contents/blank_cheques")) {
      fs.mkdir("./public/contents/blank_cheques", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }
    // next()
    if (!req.files.blank_cheque) {
      res.json({
        success: false,
        message: 'Blank Check upload Required',
      });
      return;
    } else {
      var image = req.files.blank_cheque;
      var x = image.name.split(".");
      var ext = x[x.length - 1];
      var file = new Date().getTime() + "." + ext;
      var rename = './public/contents/blank_cheques/' + file;
      image.mv(rename, function (err) {
        req.body.blank_cheque = 'contents/blank_cheques/' + file;
        console.log('upload complete')
        next();
      });
    }
  },

  cooperative_upload: function (req, res, next) {
    if (!req.files) {
      res.json({
        success: false,
        message: 'Creating Cooperatives Require Image upload',
      });
      return;
    }
    var image = req.files.photo;
    if (!fs.existsSync("./public/contents/profile")) {
      fs.mkdir("./public/contents/profile", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }
    // next()
    var x = image.name.split(".");
    var ext = x[x.length - 1];
    var file = new Date().getTime() + "." + ext;
    var rename = './public/contents/profile/' + file;
    image.mv(rename, function (err) {
      req.body.image = 'contents/profile/' + file;
      console.log('upload complete')
      next();
    });
  },


  upload_product_image: (req, res, next) => {
    console.log(req.files);
    if (!req.files) {
      res.json({
        success: false,
        message: 'No Image files found',
      });
      return;
    }
    if (!fs.existsSync("./public/contents/images/")) {
      fs.mkdir("./public/contents/images/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.product_image) {
      res.json({
        success: false,
        message: 'Product Image upload Required',
      });
      return;
    } else {
      var product_image = req.files.product_image;
      var image = product_image.name.split(".");
      var exts = image[image.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/images/' + filed;
      product_image.mv(renamed, function (err) {
        req.body.product_image = 'contents/images/' + filed;
        console.log('dome');
        next();
      });
    }
  },

  upload_product_icon: (req, res, next) => {
    if (!req.files) {
      res.json({
        success: false,
        message: 'No icon files found',
      });
      return;
    }
    if (!fs.existsSync("./public/contents/icons/")) {
      fs.mkdir("./public/contents/icons/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.product_icon) {
      res.json({
        success: false,
        message: 'Product Icon upload Required',
      });
      return;
    } else {
      var product_image = req.files.product_icon;
      var image = product_image.name.split(".");
      var exts = image[image.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/icons/' + filed;
      product_image.mv(renamed, function (err) {
        req.body.product_icon = 'contents/icons/' + filed;
        console.log('doomed');
        next();
      });
    }
  },


  // upload_product_icon: (req, res, next)=>{
  //   if(!req.files){
  //     if(req.method=="POST"){

  //       res.json({
  //           success: false,
  //           message: 'Loan Product requires Icon uploads',
  //       });
  //       return;
  //     }
  //     if(req.method == "PUT"){
  //       return next();
  //     }
  //   }
  //   if (!fs.existsSync("./public/contents/icons/")) {
  //       fs.mkdir("./public/contents/icons/", function (err) {
  //           if (err) {
  //               return console.log('failed to write directory', err);
  //           }
  //       });
  //     }

  //     if(!req.files.product_icon){
  //         if(req.method=="POST"){
  //           res.json({
  //               success: false,
  //               message: 'Product Icon upload Required',
  //           });
  //           return;
  //         }
  //       }else{
  //         if(req.method == "PUT"){
  //           if(fs.existsSync("./public/"+req.body.icon)){
  //               fs.unlink("./public/"+req.body.icon, function(error) {
  //                   if (error) {
  //                       throw error;
  //                   }
  //               });
  //           }
  //         }
  //         var product_image = req.files.product_icon;
  //         var image = product_image.name.split(".");
  //            var exts = image[image.length - 1];
  //            var filed = new Date().getTime() + "." + exts;
  //            var renamed = './public/contents/icons/' + filed;
  //            product_image.mv(renamed, function (err) {
  //               req.body.icon = 'contents/icons/'+filed;
  //               console.log('image uploaded');
  //               next();
  //            });
  //       }
  // },



  upload_loan_cac: (req, res, next) => {
    var required = requirements.find((e)=>{
      e.cac_doc === true;
    });
    if(required===null){
      next();
    }
    if (!req.files) {
      if (req.method == "POST") {

        res.json({
          success: false,
          message: 'Loan Application requires upload',
        });
        return;
      }
    }
    if (!fs.existsSync("./public/contents/cac/")) {
      fs.mkdir("./public/contents/cac/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.cac_doc) {
      console.log('no file');
      if (req.method == "POST") {
        res.json({
          success: false,
          message: 'CAC Document upload Required',
        });
        return;
      }
    } else {

      var product_image = req.files.cac_doc;
      var image = product_image.name.split(".");
      var exts = image[image.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/cac/' + filed;
      product_image.mv(renamed, function (err) {
        req.body.cac_doc = 'contents/cac/' + filed;
        console.log('cac doc uploaded');
        next();
      });
    }
  },


  upload_loan_employment: (req, res, next) => {
    var required = requirements.find((e)=>{
      e.proof_employment === true;
    });
    if(required===null){
      next();
    }
    if (!req.files) {
      if (req.method == "POST") {

        res.json({
          success: false,
          message: 'Loan Application requires upload',
        });
        return;
      }
      if (req.method == "PUT") {
        return next();
      }
    }
    if (!fs.existsSync("./public/contents/employment/")) {
      fs.mkdir("./public/contents/employment/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.proof_upload) {
      console.log('no file');
      if (req.method == "POST") {
        res.json({
          success: false,
          message: 'Proof of Employment upload Required',
        });
        return;
      }
      if (req.method == "PUT") {
        return next();
      }
    } else {

      var product_image = req.files.proof_upload;
      var image = product_image.name.split(".");
      var exts = image[image.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/employment/' + filed;
      product_image.mv(renamed, function (err) {
        req.body.proof_employment_upload = 'contents/employment/' + filed;
        console.log('employment proof uploaded');
        User.findById(req.params.id, function (err, apprmanager) {
          if (err || apprmanager === null) {
            next()
          } else {
            if (fs.existsSync("./public/" + apprmanager.proof_employment_upload)) {
              fs.unlink("./public/" + apprmanager.proof_employment_upload, function (err) {
                if (err) {
                  return console.log('failed to write directory', err);
                }
              });
            }
            return next();
          }
        });
      });
    }
  },


  upload_loan_bankstatement: (req, res, next) => {
    var requirements = req.body.requirements;
    var required = requirements.find((e)=>{
      e.bank_statement === true;
    });
    if(required===null){
      next();
    }
    if (!req.files) {
      if (req.method == "POST") {

        res.json({
          success: false,
          message: 'Loan Application requires upload',
        });
        return;
      }

    }
    if (!fs.existsSync("./public/contents/bank-statement/")) {
      fs.mkdir("./public/contents/bank-statement/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.bank_statement) {
      console.log('no file');
      if (req.method == "POST") {
        res.json({
          success: false,
          message: 'Bank Statement upload Required',
        });
        return;
      } else {
        next();
      }

    } else {

      var product_image = req.files.bank_statement;
      var image = product_image.name.split(".");
      var exts = image[image.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/bank-statement/' + filed;
      product_image.mv(renamed, function (err) {
        req.body.bankStatement = 'contents/bank-statement/' + filed;
        console.log('bank-statement doc uploaded');
        next();
      });
    }
  },


  upload_loan_identification: (req, res, next) => {
    console.log('employment image');
    if (!req.files) {
      console.log("no upload and put method")
      return next();
    }
    if (!fs.existsSync("./public/contents/id-cards/")) {
      fs.mkdir("./public/contents/id-cards/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }

    if (!req.files.proof_of_id_upload) {
      console.log('no proof of employment image');
      if (req.method == "POST") {
        res.json({
          success: false,
          message: 'ID Card upload Required',
        });
        return;
      }
      if (req.method == "PUT") {
        return next();
      }
    } else {

      var product_image = req.files.proof_of_id_upload;
      var image = product_image.name.split(".");
      var exts = image[image.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/id-cards/' + filed;
      product_image.mv(renamed, function (err) {
        req.body.identificationImage = 'contents/id-cards/' + filed;
        console.log('id card uploaded');
        User.findById(req.params.id, function (err, apprmanager) {
          if (err || apprmanager === null) {
            next()
          } else {
            if (fs.existsSync("./public/" + apprmanager.identificationImage)) {
              fs.unlink("./public/" + apprmanager.identificationImage, function (err) {
                if (err) {
                  return console.log('failed to write directory', err);
                }
              });
            }
            return next();
          }
        });

      });
    }
  },

  upload_advert_image: function (req, res, next) {
    
    if (!req.files.photo) {
      res.json({
        success: false,
        message: 'Application requires Advert Image upload',
      });
      return;
    }


    var advert_image = req.files.photo;
    if (!fs.existsSync("./public/contents/")) {
      fs.mkdir("./public/contents/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }
    // next()
    var x = advert_image.name.split(".");
    var ext = x[x.length - 1];
    var file = new Date().getTime() + "." + ext;
    var rename = './public/contents/profile/' + file;
    advert_image.mv(rename, function (err) {
      req.body.advert_image = 'contents/profile/' + file;
      next();
    });
  },



  uploader: function (req, res, next) {
    if (!req.files) {
      res.json({
        success: false,
        message: 'Application requires file upload',
      });
      return;
    }

    if (!req.files.cac_doc) {
      res.json({
        success: false,
        message: 'Application requires CAC Document upload',
      });
      return;
    }


    if (!req.files.bankStatement) {
      res.json({
        success: false,
        message: 'Application requires Bank Statement upload',
      });
      return;
    }


    var cac_doc = req.files.cac_doc;
    var bankStatement = req.files.bankStatement;
    if (!fs.existsSync("./public/contents/")) {
      fs.mkdir("./public/contents/", function (err) {
        if (err) {
          return console.log('failed to write directory', err);
        }
      });
    }
    // next()
    var x = cac_doc.name.split(".");
    var ext = x[x.length - 1];
    var file = new Date().getTime() + "." + ext;
    var rename = './public/contents/cac_docs/' + file;
    cac_doc.mv(rename, function (err) {
      req.uploaded = {
        cac_doc: file,
      };
      var y = bankStatement.name.split(".");
      var exts = y[y.length - 1];
      var filed = new Date().getTime() + "." + exts;
      var renamed = './public/contents/bankStatements/' + filed;
      bankStatement.mv(renamed, function (err) {
        req.uploaded.bankStatement = filed,
          console.log('upload complete')
        next();
      });
    });
  },
  secret: tor,
  Email: function (data) {
    console.log('got to email 2')
    const sendmail = require('sendmail')();
    data['site_url'] = "https://fundall.com";
    if (!data.template) {
      sendmail({
        from: 'Crevance <notifications@fundall.com>',
        to: data.email || data.Email,
        subject: data.subject,
        html: data.contents,
      }, function (err, reply) {
        if (!err) {
          console.log("Mail sent to " + data.email);
        } else {
          console.log("Error sending mail to " + data.email, err);
        }
      });
      return;
    }
    console.log('using template');
    var fs = require('fs');
    fs.readFile(__dirname + '/../view/templates/' + data.template + '.hbs', 'utf8', function (err, contents) {

      if (err) {
        console.log('err', err)
        return;
      }

      for (var i in data) {
        var x = "{{" + i + "}}";
        while (contents.indexOf(x) > -1) {
          contents = contents.replace(x, data[i]);
        };
      }

      sendmail({
        from: 'Crevance <notifications@crevance.loans>',
        to: data.email || data.Email,
        subject: data.subject,
        html: contents,
      }, function (err, reply) {
        if (!err) {
          console.log("Mail sent to " + data.email, data.link)
        } else {
          console.log("Error sending mail to " + data.email, err);
        }
        // console.dir(reply);
      });

    });

    return;

    var options = {
      auth: {
        //api_user: 'natterbase',
        //api_key: 'Na20ter70'
        //                  user : 'zeedas',
        api_key: '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'

      }
    }

    var sgTransport = require('nodemailer-sendgrid-transport');

    var transporter = nodemailer.createTransport(sgTransport(options));


    //transporter.use('compile', hbs(options));
    var mailOptions = {
      from: 'Crevance <notifications@crevance.loans>',
      to: data.email,
      subject: data.subject,
      text: data.template,
      html: data.template,
      context: data
    };


    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("ERROR: " + error);
      } else {
        // console.log('Message sent: ' + info.response);
      }
    });

  },
  badRequest: (req, res, next) => {
    res.status(200).json(req.responseBody);
  },
  goodRequest: (req, res, next) => {
    res.status(200).json(req.responseBody);
  },
  send_sms: (body) => {
    const options = {
      method: 'GET',
      uri: 'http://www.quicksms1.com/api/sendsms.php?username=' + sms_auth.username +
      '&password=' + sms_auth.password + '&sender=Fundall&message=' + body.message + '&recipient=' +
      body.phone + '&report=1&convert=1&route=1',
    };
    // console.log(sms_auth.username);
    // console.log(body.phone);
    // console.log(options);
    Request(options)
      .then((response) => {
        // save details to db
        console.log('Response:', response);
        return;
      })
      .catch((error) => {
        console.log('error:', error);
        return;
      })
  },
  check_email: (email) => {
    var t = email.split('@', 5);
    if (t.length === 2) {
      var f = t[1].split('.', 5);
      if (f.length !== 2) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  },
  check_dob: (dob) => {
    var t = dob.split('-', 5);
    if (t.length === 3) {
      if (Number(t[0]) !== 0 && Number(t[1]) !== 0 && Number(t[2]) !== 0) {
        return true;
      }
      return false
    } else {
      return false;
    }
  },
  fetch_requirements: (req, res, next)=>{
    Product.findOne({loanName: req.body.productName}, 'requirements', (error, product)=>{
      req.body.requirements = product.requirements;
      next();
    });
  }

}