/*
	Main application set-up & Models - Share!  mobile application
	
	Requires: Backbone, Backbone.Marionette
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/
var App = window.App = window.App || new Backbone.Marionette.Application();
App.Model = {};

/* *******************************************************
  Class: App.Model.Share a Share between friends
  
  Shares are the key data type in the system. 
  
  ----- Attributes ------
  from - the giver of the share
  to - the receiver of the share
  date - the date/time when the share happened
  photo - photo taken with the share
  info - text typed in when the share is created.
  type - the type of the share - money/thing/promise/time
  
  --- Money Shares
  amount - the amount of the share 
  currency - string describing currency
  
  --- Time shares
  amount - number of minutes 
  
  A Share without a "Confirmation" is un-confirmed
  A Share without a "Repay" is open...
  
  I am thining eventually might want to specify multiple 
*/
App.Model.Share = Backbone.Model.extend({
    defaults: {
	tofrom: null, //given/received
	from: null, //Friend
	to: null, //Friend
        date: null,
        photo: null,
        info: null,
        type: null, // one of: money, thing, promise, time
    },
});

/* *******************************************************
  Class: App.Model.Repay the giving back of a share.
  
  This is issued when a Share is returned.. (This only makes
  sense for some things, not for time or money.)
  
  I am not sure if we even need this, or if we should just use Shares
  for everything... Certainly for time it makes no sense - you can't
  return the time someone has received from you, only give some of your
  time in return. 
  
  For money this is also questionable since you might want to return
  partial money, or you might give more then you received - then
  the other side goes into debt.
  
  
  ----- Attributes ------
  share - the share this is repaying
  date - the date of the repay
  info - text sent with the repayment
*/
App.Model.Repay = Backbone.Model.extend({
    defaults: {
        date: null,
        share: null, 
        info: 'Thank you for your generosity, here is XX back...',
     },
});

/* *******************************************************
  Class: App.Model.Confirm  a confirmation of a Share or Repay.
  
  This is issued when a Share or Repay is confirmed by the other party.
  
  ----- Attributes ------
  confirmed - the share or Repay this is repaying
  date - the date of the repay
  confirmedBy - the Friend who did the confirmation
  info - text associated with the confirmation

*/
App.Model.Confirm = Backbone.Model.extend({
    defaults: {
    	share: null, 
        date: null,
        confirmedBy: null, 
        info: 'Thank you! Confirmed!', 
    },
});

/* *******************************************************
  Class: App.Model.Shares a collection of App.Model.Share...
 */
 App.Model.Shares  =  Backbone.Collection.extend({
     model: App.Model.Share
});

/* *******************************************************
	Class: App.Model.Friend  a person in the system
	
	----- Attributes ------
	nameFirst - the person's first name
	nameLast - the person's last name
	photo - URL to the person's photo
	shares - the Collection of this friend's shares
 */
App.Model.Friend = Backbone.Model.extend({
     defaults: {
        nameFirst: null,
        nameLast: null,
        photo: 'samples/person/img-006.jpeg',
        shares: null,
    },
    initialize: function(){
      this.set({shares: new App.Model.Shares});
    },
    addShare: function(share){
      this.get("shares").add(share);
    },
    filterShares: function(shareIterator){
    	return new App.Model.Shares(this.get("shares").filter(shareIterator))
    },
});

/* *******************************************************
  Class: App.Model.Friends - a collection of friends

 */
App.Model.Friends =  Backbone.Collection.extend({
    model: App.Model.Friend
});

/* *******************************************************
  Class: App.Model.Me     I am a Friend, yet so much more...

  Models the application user. 
  
  ----- Attributes ------
  (inherits all attributes from App.Model.Friend)
  friends - the friends of this user 
  		since everyone who I have a share with is my Friend, this is duplicate data
  		but stored here for convenience
 */
App.Model.Me = App.Model.Friend.extend({
	defaults: {
    	friends: new App.Model.Friends,
    },
    addFriend: function(friend){
      this.get("friends").add(friend);
    },
    /*
    	Returns friends filtered to contain only friends who's shares contain pass the
    	given filter.
    	
    	NOTE: This returns a App.Model.Friends collection of the friends, BUT
    	these are the original Friend objects - their shares list has NOT been filtered.
    	
    	----- Parameters -----
    	shareIterator: similar to Underscore.collection.filter(iterator) - filters out friends
    	to only include ones who's shares pass the filter. 
    */
    filterFriendByShare: function(shareIterator){
    	return new App.Model.Friends(this.get("friends").filter(function(friend){
    		// Return if there are any shares in this friend which pass the filter.
	    	return friend.filterShares(shareIterator).size()>0;
	    }));
    }
});

// This is the singleton describing the user of the application.
// This has to be set in the data initialization somewehere..
App.Model.ME = null;
