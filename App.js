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

/* *******************************************************
  Class: App.ShareCollection

  A collection of shares...
 */
 App.ShareCollection  =  Backbone.Collection.extend({
     model: App.Share
});

// Create singleton for the shares master-list
App.SHARES = new App.ShareCollection;

/* *******************************************************
	Class: App.Friend

     Backbone Data model based on example in:
	 http://documentcloud.github.com/backbone/docs/todos.html
 */
App.Friend = Backbone.Model.extend({
     defaults: {
        nameFirst: 'John',
        nameLast: 'Doe',
        photo: 'samples/person/img-006.jpeg',
        id: 0, // This must be set...
        //shares: Collection of App.Share
    },
    initialize: function(){
      this.set({shares: new App.ShareCollection});
    },
    addShare: function(share){
      this.get("shares").add(share);
      App.SHARES.add(share);
    },
  });

/* *******************************************************
  Class: App.FriendsList

  List of friends...
 */
var FriendsList =  Backbone.Collection.extend({
        model: App.Friend
});

// Create singleton for the friends master-list
App.FRIENDS = new FriendsList;


/*
	Because the views depend on templates can only do this stuff after DOM is loaded...

	The view structure is all Marionette.js
	https://github.com/marionettejs/backbone.marionette

*/
$( document ).delegate("#top-page", "pageinit", function() {

  // ======================= GENERIC BASE CLASSES =============
  App.ShareViewBase = Backbone.Marionette.ItemView.extend(
  {
    templateHelpers: {
       now: function(){
          var now = moment();
          return this.date.from(now).replace("ago","");
       }
}
  });

  // ======================= LIST RELATED VIEW ==================

	/* The share info for a friend who is in a friend list */
	App.FriendListItemShareView =  App.ShareViewBase.extend(
	{
		template: "#friend-list-item-template-share",
    tagName : 'li',
    attributes: {
      class:"share-container"
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

    App.FRIENDS_LIST_VIEW = new FriendsListView({
    	el: $("#friendlist"),
    	collection: App.FRIENDS

    });


    // ========================= FRIEND INFO POPUP/DIALOG VIEWS =============
    App.FriendInfoView = Backbone.Marionette.CompositeView.extend({
          template:  '#friend-info-template',
        itemView: App.FriendListItemShareView,
        tagName : 'div',
        initialize: function(){
           this.collection = this.model.get("shares");
        }
      });

    // ========================= SHARE INFO POPUP/DIALOG VIEWS =============
    App.ShareInfoView =  App.ShareViewBase.extend(
    {
      template: "#share-info-template",
      tagName : 'div',
    });

    // ========================= GET IT ALL GOING... BOOTSTRAP ============
    App.addInitializer(function() {
		  App.FRIENDS_LIST_VIEW.render();  
   });

    App.FRIEND_INFO_VIEW = new Backbone.Marionette.Region({
      el: "#friend .content"
    });
    App.SHARE_INFO_VIEW = new Backbone.Marionette.Region({
      el: "#share .content"
    });   App.start(); 
});


// ==================  Set up the ROUTER =================== 
/* 
  Using: https://github.com/azicchetti/jquerymobile-router#readme
  Please refer to the following schema to understand event codes (it's really straightforward)

        bc  => pagebeforecreate
        c   => pagecreate
        i   => pageinit
        bs  => pagebeforeshow
        s   => pageshow
        bh  => pagebeforehide
        h   => pagehide
        rm  => pageremove
        bC  => pagebeforechange
        bl  => pagebeforeload
        l   => pageload
 */

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
	{ "#share[?]id=(\\d+)": {events: "bs", handler: 
		function(eventType, matchObj, ui, page, evt) {
          var newView = new App.ShareInfoView({
            model:  App.SHARES.get(matchObj[1])
          });
          console.log("share view", newView);
          App.SHARE_INFO_VIEW.show(newView);
  }}},
	{ "#friend[?]id=(\\d+)": {
      events: "bs", 
      handler:   function (eventType, matchObj, ui, page, evt) {
          var newView = new App.FriendInfoView({
            model:  App.FRIENDS.get(matchObj[1])
          });
          console.log("friend view", newView);
          App.FRIEND_INFO_VIEW.show(newView);
  }}} 
]);