var Listing = require('../models/listing');
const User = require(__base + 'models/user'); // get the mongoose model
var util = require('../middleware/util');


exports.listing_create = function(req, res, next) {

  if(req.body.name===undefined||req.body.name.length<1){
      req.responseBody = {
        success: false,
        
            message: 'Please provide a valid name for this listing to continue',  
      }
      util.badRequest(req, res, next);
      return;
    }
    if(req.body.description===undefined||req.body.description.length<1){
      req.responseBody = {
        success: false,
        
            message: 'Please provide a description for this listing to continue',  
      }
      util.badRequest(req, res, next);
      return;
    }

    if(req.body.company===undefined||req.body.company.length<1){
      req.responseBody = {
        success: false,
        
            message: 'Please provide a company name for this listing to continue',  
      }
      util.badRequest(req, res, next);
      return;
    }
    if(req.body.contact_information===undefined||req.body.contact_information.length<1){
      req.responseBody = {
        success: false,
        
            message: 'Please provide a valid contact information to continue',  
      }
      util.badRequest(req, res, next);
      return;
    }
    if(req.body.duration===undefined||Number(req.body.duration)<1){
      req.responseBody = {
        success: false,
        
            message: 'Please provide a duration for this listing to continue',  
      }
      util.badRequest(req, res, next);
      return;
    }
    if(req.body.company_cac===undefined||req.body.company_cac.length<1){
      req.responseBody = {
        success: false,
        
            message: 'Please provide a valid CAC Number for this listing to continue',  
      }
      util.badRequest(req, res, next);
      return;
    }
    if(req.body.advert_cost===undefined||Number(req.body.advert_cost)<1){
      req.responseBody = {
        success: false,
        
            message: 'No advert cost provided',  
      }
      util.badRequest(req, res, next);
      return;
    }
  req.body.accountHolder = req.decoded.id;
  var listing = new Listing(
    req.body
  );

  listing.save(function(err){
    if(err){
        req.responseBody = {
          success: false,
              message: 'Failed to create your Ad. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'New listing created',
      result: (listing)
    });
  });
};

exports.pending_listing = (req, res, next)=>{
  Listing.paginate({approved: null},{page:req.query.page||1, limit:20}, function(err, listing) {
    if(err){
        req.responseBody = {
          success: false,
              message: 'Failed to fetch pending Ads Ad. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'All Pending Listing retrieved successfully',
      result: {
        listing: (listing.docs),
        pages: (listing.pages)
      }
    });
  });
};

exports.approved_listing = (req, res, next)=>{
  Listing.paginate({approved: 2},{page:req.query.page||1, limit:20}, function(err, listing) {
    if(err){
        req.responseBody = {
          success: false,
              message: 'Failed to fetch approved Ads. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'All Approved Listing retrieved successfully',
      result: {
        listing: (listing.docs),
        pages: (listing.pages)
      }
    });
  });
};

exports.rejected_listing = (req, res, next)=>{
  Listing.paginate({approved: 1},{page:req.query.page||1, limit:20}, function(err, listing) {
    if(err){
        req.responseBody = {
          success: false,
              message: 'Failed to fetch rejected Ads. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'All Rejected Listing retrieved successfully',
     result: {
        listing: (listing.docs),
        pages: (listing.pages)
      }
    });
  });
};


exports.listing_details = function(req, res, next){
  Listing.findById(req.params.id, function(err, listing) {
    if(err||listing===null){
        req.responseBody = {
          success: false,
              message: 'Failed to fetch this Ad. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'Listing details retrieved successfully',
      result: (listing)
    });
  });
};
exports.empty_db = function(req, res, next){
  console.log('empty db');
  User.remove({}, function(err) {
    if (err) return next(err);
    return res.json({
      success: true,
      message: 'All users details deleted successfully',
    });
  });
};

exports.all_listing = function(req, res, next){
  Listing.paginate({},{page:req.query.page||1, limit:20}, function(err, listing) {
    if(err){
        req.responseBody = {
          success: false,
              message: 'Failed to all Ads. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'All Listing retrieved successfully',
      result: {
        listing: (listing.docs),
        pages: (listing.pages)
      }
    });
  });
};
exports.mine = function(req, res, next){
  Listing.paginate({accountHolder:req.decoded.accountId},{page:req.query.page||1, limit:20}, function(err, listing) {
    if(err){
        req.responseBody = {
          success: false,
              message: 'Failed to all Ads. Try again',  
        }
        util.badRequest(req, res, next);
        return;
      }
    return res.json({
      success: true,
      message: 'All Listing retrieved successfully',
      result: {
        listing: (listing.docs),
        pages: (listing.pages)
      }
    });
  });
};


exports.approveListing = function(req, res, next){
 var loan_update = {
      approved: 2,
    };
    Listing.findById(req.params.id, function (err, uder) {
        if(err||uder===null){
        req.responseBody = {
          success: false,
          message: 'Listing Not Found',  
        }
        util.badRequest(req, res, next);
        return;
      }
      uder.approved = 2;
      uder.save();
      return res.json({
        success: true,
        message: 'Listing details updated successfully',
        result: (uder)
      });         
    });
};



exports.rejectListing = function(req, res, next){
   var loan_update = {
      approved: 1,
    };
    Listing.findById(req.params.id, function (err, uder) {
        if(err||uder===null){
        req.responseBody = {
          success: false,
          message: 'Listing Not Found',  
        }
        util.badRequest(req, res, next);
        return;
      }
      uder.approved = 1;
      uder.save();
      return res.json({
        success: true,
        message: 'Listing details updated successfully',
        result: (uder)
      });         
    });
};

exports.blockListing = function(req, res, next){
   var loan_update = {
      listingState: 2,
    };
    Listing.findById(req.params.id, function (err, uder) {
        if(err||uder===null){
        req.responseBody = {
          success: false,
          message: 'Listing Not Found',  
        }
        util.badRequest(req, res, next);
        return;
      }
      uder.listingState = 2;
      uder.save();
      return res.json({
        success: true,
        message: 'Listing details updated successfully',
        result: (uder)
      });         
    });
};

exports.suspendListing = function(req, res, next){
   var loan_update = {
      listingState: 1,
    };
     Listing.findById(req.params.id, function (err, uder) {
        if(err||uder===null){
        req.responseBody = {
          success: false,
          message: 'Listing Not Found',  
        }
        util.badRequest(req, res, next);
        return;
      }
      uder.listingState = 1;
      uder.save();
      return res.json({
        success: true,
        message: 'Listing details updated successfully',
        result: (uder)
      });         
    });
};

exports.activateListing = function(req, res, next){
   var loan_update = {
      listingState: 0,
    };
     Listing.findById(req.params.id, function (err, uder) {
        if(err||uder===null){
        req.responseBody = {
          success: false,
          message: 'Listing Not Found',  
        }
        util.badRequest(req, res, next);
        return;
      }
      uder.listingState = 0;
      uder.save();
      return res.json({
        success: true,
        message: 'Listing details updated successfully',
        result: (uder)
      });         
    });
};

exports.listing_delete = function(req, res, next){
   Listing.findById(req.params.id, function (err, uder) {
        if(err||uder===null){
        req.responseBody = {
          success: false,
          message: 'Listing Not Found',  
        }
        util.badRequest(req, res, next);
        return;
      }
      Listing.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.responseBody = {
              success: false,
                  message: 'Failed to delete this Ad. Try again',  
            }
            util.badRequest(req, res, next);
            return;
          }
        return res.json({
          success: true,
          message: 'Listing deleted successfully.'
        });
      });        
    });
 
};
