/*
	Main application, views, etc - Share! UI mobile application
	
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
        type: 'money',//, things, promise, time
        amount: 99,
        id: 0 // This must be set...
    },
    initialize: function(){
    }
});

/* *******************************************************
  Class: App.Model.Shares

  A collection of shares...
 */
 App.Model.Shares  =  Backbone.Collection.extend({
     model: App.Model.Share
});

// Create singleton for the shares master-list
App.SHARES = new App.Model.Shares;

/* *******************************************************
	Class: App.Model.Friend

     Backbone Data model based on example in:
	 http://documentcloud.github.com/backbone/docs/todos.html
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
      App.SHARES.add(share);
    },
  });

/* *******************************************************
  Class: FriendsList

  List of friends...
 */
var FriendsList =  Backbone.Collection.extend({
        model: App.Model.Friend
});

// Create singleton for the friends master-list
App.FRIENDS = new FriendsList;