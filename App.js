/*
	The code for the Share! UI mobile application

	
	Requires: jQuery Mobile, Backbone
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/


// Set-up the namespace we put everything into...
// From: http://ricostacruz.com/backbone-patterns/#namespace_convention
var App = window.App = window.App || {};

/* Set underscore.js to use moustache style template format, 
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
    
    /*  Set the size of the The Share Pop-Up
    	http://stage.api.jquerymobile.com/popup/#option-tolerance
      Sets the minimum distance from the edge of the window for the corresponding edge of the popup. By default, the values above will be used for the distance from the top, right, bottom, and left edge of the window, respectively.    
      A single number. This number will be used for all four edge tolerances.
    */
//    $('#share-dialog').popup({ tolerance: "12" });
});

/*
 General structure based on example in:
	 http://documentcloud.github.com/backbone/docs/todos.html
 */
App.Friend = Backbone.Model.extend({
     defaults: {
        name: 'John Doe',
        photo: 'samples/person/img-006.jpeg',
    },
    initialize: function(){
    }
});

var FriendsList =  Backbone.Collection.extend({
        model: App.Friend
});

// Create singleton for the friends master-list
App.Friends = new FriendsList;

/*
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
        amount: 99
    },
    initialize: function(){
    }
});

/*
	Because the views depend on templates can only do this stuff after DOM is loaded...
*/
$( document ).delegate("#top-page", "pageinit", function() {
	App.FriendListItemView = Backbone.View.extend({
		template:  _.template($('#item-template').html()),
		shareTemplate:  _.template($('#item-template-share').html()),
		tagName:  "li",
	    initialize: function(){
	    },
	    render: function(){
	    	// Get the model into a format easy to consume by the template... This seems to be the standard pattern... UGH.
	    	var json = this.model.toJSON();
	    	json.name = json.name.replace(" ", "<br/>");
	    		    	
	    	// Apply underscore template to create our contents...
	    	var htmlT = this.template(json);
	        this.$el.html(htmlT);

			// Put the shares into the display
	        var self = this;
	    	var theelem = this.$el.find(".friend-shares");
	    	var now = moment();
	    	_.each(
	    		this.model.get("shares"), 
	    		function(share){
	    			var json = share.toJSON();
	    			json.date = share.get("date").from(now).replace("ago","");
			        theelem.append(self.shareTemplate(json));
			    }
			);
	        return this;
	    }
	});
    var FriendsListView = Backbone.View.extend({
    	initialize: function() {
    	},
    	render: function() {		            
            this.$el.listview('refresh');
    	},
	    addOne: function(friend) {
			var view = new App.FriendListItemView({model: friend });
			var html = view.render().el;
			this.$el.append(html);
	    },
	    addAll: function() {
	      var self=this;
	      App.Friends.each(function(friend){self.addOne(friend);});
	    },
    	
    });
    App.FriendsView = new FriendsListView({el: $("#friendlist")});
	App.FriendsView.addAll();
	App.FriendsView.render();
});	        
