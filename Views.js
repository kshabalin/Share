/*
	Main application, views, etc - Share! UI mobile application
	
	Requires: jQuery Mobile, Marionette, App.js
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/
var App = window.App;
App.View = {};

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

/*
	Because the views depend on templates can only do this stuff after DOM is loaded...

	The view structure is all Marionette.js
	https://github.com/marionettejs/backbone.marionette

*/
$( document ).delegate("#top-page", "pageinit", function() {

  // ======================= GENERIC BASE CLASSES =============
  App.View.ShareBase = Backbone.Marionette.ItemView.extend(
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
	App.View.FriendListItemShare =  App.View.ShareBase.extend(
	{
		template: "#friend-list-item-template-share",
    tagName : 'li',
    attributes: {
      class:"share-container"
    },
	});

	/* The view for rendering one Friend In the List of Friends */
	App.View.FriendListItem =Backbone.Marionette.CompositeView.extend(
	{
		template:  '#friend-list-item-template',
		itemView: App.View.FriendListItemShare,
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
    	itemView: App.View.FriendListItem,
       onRender: function () {
         $(this.el).listview('refresh');
       },
    });

    App.FRIENDS_LIST_VIEW = new FriendsListView({
    	el: $("#friendlist"),
    	collection: App.FRIENDS

    });


    // ========================= FRIEND INFO POPUP/DIALOG VIEWS =============
    App.View.FriendInfo = Backbone.Marionette.CompositeView.extend({
          template:  '#friend-info-template',
        itemView: App.View.FriendListItemShare,
        tagName : 'div',
        initialize: function(){
           this.collection = this.model.get("shares");
        }
      });

    // ========================= SHARE INFO POPUP/DIALOG VIEWS =============
    App.View.ShareInfo =  App.View.ShareBase.extend(
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
   From: http://jquerymobile.com/demos/1.2.0/docs/api/events.html
  by binding to pagebeforecreate, you can manipulate markup before jQuery Mobile's default widgets are auto-initialized. For example, say you want to add data-attributes via JavaScript instead of in the HTML source, this is the event you'd use.
  
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
  eventType: the name of the jQM event that's triggering the handler (pagebeforeshow, pagecreate, pagehide, etc)
  matchObj: the handler is called when your regular expression matches the current url or fragment. This is the match object of the regular expression. If the regular expression uses groups, they will be available in this object. Cool eh?  
  ui: this is the second argument provided by the jQuery Mobile event. Usually holds the reference to either the next page (nextPage) or previous page (prevPage). More information here: (http://jquerymobile.com/demos/1.0/docs/api/events.html)[http://jquerymobile.com/demos/1.0/docs/api/events.html]
  page: the dom element that originated the jquery mobile page event
  evt: the original event that comes from jquery mobile. You can use this to prevent the default behaviour and, for instance, stop a certain page from being removed from the dom during the pageremove event.
*/
App.ROUTER = new $.mobile.Router([
	{ "#share[?]id=(\\d+)": {events: "bs", handler: 
		function(eventType, matchObj, ui, page, evt) {
          var newView = new App.View.ShareInfo({
            model:  App.SHARES.get(matchObj[1])
          });
          App.SHARE_INFO_VIEW.show(newView);
  }}},
	{ "#friend[?]id=(\\d+)": {
      events: "bs", 
      handler:   function (eventType, matchObj, ui, page, evt) {
          var newView = new App.View.FriendInfo({
            model:  App.FRIENDS.get(matchObj[1])
          });
          App.FRIEND_INFO_VIEW.show(newView);
  }}} 
]);