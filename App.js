/*
	Main application, views, etc - Share! UI mobile application
	
	Requires: jQuery Mobile, Backbone, Marionette
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/
var App = window.App = window.App || new Backbone.Marionette.Application();

/* Set underscore.js to use moustache style template format.

	NOTE!!! will not work for looping...
	http://stackoverflow.com/questions/9002203/backbone-underscore-template-in-mustache-format-causing-error-on-pound-hash-sy
*/
_.templateSettings = {
     evaluate : /\{\[([\s\S]+?)\]\}/g,
     interpolate : /\{\{([\s\S]+?)\}\}/g
};

$(document).bind( "mobileinit", function(event) {
	/* Disallow the page from being resized... */
    $.extend($.mobile.zoom, {locked:true,enabled:false});    
});


/* *******************************************************
  Class: App.Share
  
  This models a share between friends.
*/
App.Share = Backbone.Model.extend({
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

/*
  Collection of shares... 
*/
App.ShareCollection  =  Backbone.Collection.extend({
        model: App.Share
});

/* *******************************************************
	Class: App.Friend

     Backbone Data model based on example in:
	 http://documentcloud.github.com/backbone/docs/todos.html
 */
App.Friend = Backbone.Model.extend({
     defaults: {
        name: 'John Doe',
        photo: 'samples/person/img-006.jpeg',
        id: 0, // This must be set...
        //shares: Collection of App.Share
    },
    initialize: function(){
      this.set({shares: new App.ShareCollection});
    },
    addShare: function(share){
      this.get("shares").add(share);
    },
  });

/*
	List of friends... 
*/
var FriendsList =  Backbone.Collection.extend({
        model: App.Friend
});

// Create singleton for the friends master-list
App.Friends = new FriendsList;


/*
	Because the views depend on templates can only do this stuff after DOM is loaded...

	The view structure is all Marionette.js
	https://github.com/marionettejs/backbone.marionette

*/
$( document ).delegate("#top-page", "pageinit", function() {

	/* The share sub-info in a friend who is in a friend list */
	App.FriendListItemShareView = Backbone.Marionette.CompositeView.extend(
	{
		template: "#friend-list-item-template-share",
           onRender: function () {
       },
	});

	/* The view for rendering one Friend In the List of Friends */
	App.FriendListItemView =Backbone.Marionette.CompositeView.extend(
	{
		template:  '#friend-list-item-template',
		itemView: App.FriendListItemShareView,
		itemViewContainer: "#friend-shares",
    tagName : 'li',
    initialize: function(){
    // grab the child collection from the parent model
    // so that we can render the collection as children
    // of this parent node
        console.log("intializing", this.model);
        this.collection = this.model.get("shares");
    },
	});

	/* The view for rendering a List of Friends */	
    var FriendsListView = Backbone.Marionette.CollectionView.extend({
    	itemView: App.FriendListItemView,
       onRender: function () {
         $(this.el).listview('refresh');
       },
    });

    App.FriendsView = new FriendsListView({
    	el: $("#friendlist"),
    	collection: App.Friends

    });

    App.addInitializer(function() {
		  App.FriendsView.render();
   });

App.start();
});


/* ----------- Set up the Router 
    so we can dynamically auto-generate pages -------- */

/* From: http://jquerymobile.com/demos/1.2.0/docs/api/events.html
  by binding to pagebeforecreate, you can manipulate markup before jQuery Mobile's default widgets are auto-initialized. For example, say you want to add data-attributes via JavaScript instead of in the HTML source, this is the event you'd use.
  
  handlerName: function(eventType, matchObj, ui, page, evt){
  
  eventType: the name of the jQM event that's triggering the handler (pagebeforeshow, pagecreate, pagehide, etc)
  
  matchObj: the handler is called when your regular expression matches the current url or fragment. This is the match object of the regular expression. If the regular expression uses groups, they will be available in this object. Cool eh?
  
  ui: this is the second argument provided by the jQuery Mobile event. Usually holds the reference to either the next page (nextPage) or previous page (prevPage). More information here: (http://jquerymobile.com/demos/1.0/docs/api/events.html)[http://jquerymobile.com/demos/1.0/docs/api/events.html]
  
  page: the dom element that originated the jquery mobile page event
  
  evt: the original event that comes from jquery mobile. You can use this to prevent the default behaviour and, for instance, stop a certain page from being removed from the dom during the pageremove event.
*/
var approuter=new $.mobile.Router([
	{ "#share[?]id=(\\d+)": {events: "bc", handler: 
		function(eventType, matchObj, ui, page, evt) {
			console.log("hello share","eventType=",eventType, "id=",matchObj[1], "ui=", ui, "page=", page, "evt=", evt); }} 
		},
	{ "#friend(?:[?](.*))?": {events: "bc", handler: function () {console.log("hello friend"); }} } 
]);