/*
	InfoPopupViews Vies for pop-ups for showing Friend, Share details, Router to trigger these - Share! mobile application
	
	Requires: jQuery Mobile, Marionette, App.js, jQuery Mobile Router
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/
var App = window.App;

App.addInitializer(function(options){
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
    
    App.View.FRIEND_INFO_REGION = new Backbone.Marionette.Region({el: "#friend .content"});
    App.View.SHARE_INFO_REGION = new Backbone.Marionette.Region({el: "#share .content"});       

	// ==================  Set up the ROUTER =================== 
	/* 
	   Info on jQuery mobile events:
	   From: http://jquerymobile.com/demos/1.2.0/docs/api/events.html
	  
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
	  ui: this is the second argument provided by the jQuery Mobile event. Usually holds the reference to either the next page (nextPage) or previous page (prevPage).   page: the dom element that originated the jquery mobile page event
	  evt: the original event that comes from jquery mobile. You can use this to prevent the default behaviour and, for instance, stop a certain page from being removed from the dom during the pageremove event.
	*/
	App.ROUTER = new $.mobile.Router([
		{ "#share[?]id=(\\d+)": {events: "bs", handler: 
			function(eventType, matchObj, ui, page, evt) {
	          var newView = new App.View.ShareInfo({
	              model:  App.Model.ME.get("shares").get(matchObj[1])
	          });
	          App.View.SHARE_INFO_REGION.show(newView);
	  }}},
		{ "#friend[?]id=(\\d+)": {
	      events: "bs", 
	      handler:   function (eventType, matchObj, ui, page, evt) {
	          var newView = new App.View.FriendInfo({
	            model:  App.Model.ME.get("friends").get(matchObj[1])
	          });
	          App.View.FRIEND_INFO_REGION.show(newView);
	  }}} 
	]);

});

