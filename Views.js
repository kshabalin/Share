/*
	Views - Share! mobile application
	
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

/* The Filter is a model but it's for view-side only so we're declaring it here */
var FilterModel =  Backbone.Model.extend({
    defaults: {
      received: "checked",
      given: "checked",
      time: "checked",
      thing: "checked",
      money: "checked",
      promise: "checked",
      returned: null
    },
    /* which returns a filter to check a share whether it passes this filter or not..
     */
    getFilter: function() {
    	var filter = this;
	    return function(script){
		   return (filter.get(script.get("type")) != null && filter.get(script.get("tofrom")) != null);
		    // XXX TODO: Add filtering by to/from, and old shares.
	    }
    },
});
App.View.FRIEND_LIST_FILTER = new FilterModel;


/*	This is here as I'm too lazy to figure out how to trigger the jQuery Mobile
	decoration of the filter properly after rendering...
*/
$( document ).delegate("#top-page", "pagebeforecreate", function() {

      // ======================= LIST FILTER Pop-up VIEW =============
    App.View.Filter = Backbone.Marionette.ItemView.extend({
        template:  '#filter-template',
        tagName : 'div',
      });

     App.View.FILTER = new App.View.Filter({
        el: $("#the-filters"),
        tagName: "div",
        model: App.View.FRIEND_LIST_FILTER
      });
 
      App.View.FILTER.render();  

      // Transmit the UI change to model changes
      $("#the-filters input[type='checkbox']").bind( "change", function(event, ui) {
        	App.View.FRIEND_LIST_FILTER.set(event.target.name,event.target.checked?"checked":null);
      });
});


App.addInitializer(function(options){
  // ======================= GENERIC BASE CLASSES =============

  /* Set-up the basic decorators for shares... */
  App.View.ShareBase = Backbone.Marionette.ItemView.extend(
  {
    templateHelpers: {
       sinceNow: function(){
          var now = moment();
          return moment(this.date).from(now).replace("ago","");
       },
       typeIcon: function() {
	       // XXX TODO - return the URL to the icon indicating the type of the share.
       },
       directionIcon: function() {
	       // XXX TODO - return the URL to the icon indicating the direction this share is (from me/to me)
       },
       isConfirmedIcon: function() {
	       // XXX TODO - return the URL to the icon indicating whether this share has been confirmed or not
       },     
       isRepayedIcon: function() {
	       // XXX TODO - return the URL to the icon indicating whether this share has been repayed
       }  
    },
  });


  // ======================= FRIEND LIST VIEW RELATED ==================

	/* The View for one share which is inside a friend item inside a friend list */
	App.View.FriendListItemShare =  App.View.ShareBase.extend(
	{
		template: "#friend-list-item-template-share",
	    tagName : 'li',
	    attributes: {class:"share-container"},
	});

	/* The view for rendering one Friend In the List of Friends */
	App.View.FriendListItem = Backbone.Marionette.CompositeView.extend(
	{
		template:  '#friend-list-item-template',
		itemView: App.View.FriendListItemShare,
		itemViewContainer: "#friend-shares",
	    tagName : 'li',
	
	    initialize: function(){
		      /* grab the child collection from the parent model
		       so that we can render the collection as children of this parent node
		       
		       At the same time filter the list of shares to only show what's seen on screen
		      */
		      this.collection = this.model.filterShares(App.View.FRIEND_LIST_FILTER.getFilter());
	    },
	});

	/* The view for rendering a List of Friends */	
    App.View.FriendsList = Backbone.Marionette.CollectionView.extend({
    	itemView: App.View.FriendListItem,
    	tagName: "ul",
    	attributes: {"class": "friend-list"},
    	
    	/* The region we are in will call this on us after we are added to the dom */
	    onShow: function () {
          // kick jQuery Mobile so it will decorate the list.
         this.$el.listview();
	    },
    });
    

    /* Bind to Filter event changes so when the filter changes we can refresh the list */
    App.View.FRIEND_LIST_FILTER.on("change", function(){
		 App.View.FRIEND_LIST_REGION.setFilteredFriends();
	})

    
    /* Create the marionette views for managing the Friend, probably
    	should move this to Region manager eventually.
       https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.view.md
    */
    App.View.FriendListRegion = Backbone.Marionette.Region.extend({
    	/* Filters friend list according to the current global filter.
    	*/
           setFilteredFriends:function () {
	          var friendsList = new App.View.FriendsList({
		          collection: App.Model.ME.filterFriendByShare(App.View.FRIEND_LIST_FILTER.getFilter()),
		       });
	          this.show(friendsList);
	       },
       });

    App.View.FRIEND_LIST_REGION = new App.View.FriendListRegion({el: "#top-page .friend-list-container"});        
});


/* Kick off appinitalization... Not quite sure if this should be here, or where... */
$( document ).delegate("#top-page", "pageinit", function() {
  /*pageinit - Triggered on the page being initialized, after initialization occurs. We recommend binding to this event instead of DOM ready() because this will work regardless of whether the page is loaded directly or if the content is pulled into another page as part of the Ajax navigation system.
*/
    App.start(); 
    App.View.FRIEND_LIST_REGION.setFilteredFriends();
});

