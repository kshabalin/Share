/*
	Main application set-up & Models - Share!  mobile application
	
	Requires: jQuery Mobile, Backbone, Marionette
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/
var App = window.App = window.App || new Backbone.Marionette.Application();
App.Model = {};

/* *******************************************************
  Class: App.Model.Share
  
  This models a share between friends.
*/
App.Model.Share = Backbone.Model.extend({
    defaults: {
      from: null, //Person
      to: null, //Person
        date: new Date(),
        photo: 'samples/person/img-006.jpeg',
        info: '<i>Description</i>',
        type: 'money',//, thing, promise, time
        amount: 99,
        id: 0 // This must be set...
    },
});

/* *******************************************************
  Class: App.Model.Repay
  
  This models the repayment of a share 
*/
App.Model.Repay = Backbone.Model.extend({
    defaults: {
        share: null, //App.Model.Share - the share this is a repayment of.
        date: new Date(),
        photo: 'samples/person/img-006.jpeg',
        info: '<i>Description</i>',
        amount: 99,
        id: 0 // This must be set...
    },
});

/* *******************************************************
  Class: App.Model.Confirm
  
  This models a share between friends.
*/
App.Model.Confirm = Backbone.Model.extend({
    defaults: {
        date: new Date(),
        id: 0, // This must be set...
        info: 'some text', // text associated with the confirmation
        confirming: null, // App.Model.Repay or App.Model.Share that we are confirming
    },
});

/* *******************************************************
  Class: App.Model.Confirm
  
  This models a share between friends.
*/
App.Model.Repay = Backbone.Model.extend({
    defaults: {
        date: new Date(),
        id: 0 // This must be set...
    },
});

/* *******************************************************
  Class: App.Model.Shares

  A collection of shares...
 */
 App.Model.Shares  =  Backbone.Collection.extend({
     model: App.Model.Share
});

/* *******************************************************
	Class: App.Model.Friend

  Models one friend
 */
App.Model.Friend = Backbone.Model.extend({
     defaults: {
        nameFirst: 'John',
        nameLast: 'Doe',
        photo: 'samples/person/img-006.jpeg',
        id: 0, // This must be set...
        //shares: Collection of App.Share
    },
    initialize: function(){
      this.set({shares: new App.Model.Shares});
    },
    addShare: function(share){
      this.get("shares").add(share);
      App.Model.ME.addShare(share);
    },
  });

/* *******************************************************
  Class: App.Model.Me

    I am a kind of friend, yet so much more...
 */
App.Model.Me = App.Model.Friend.extend({
    initialize: function(){
      this.set({friends: new App.Model.Friends});
    },
});
// This is the singleton describing me... This has to be set in the data initialization somewehere..
App.Model.ME = null;

/* *******************************************************
  Class: FriendsList

  List of friends...
 */
App.Model.Friends =  Backbone.Collection.extend({
        model: App.Model.Friend
});