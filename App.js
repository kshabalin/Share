/*
	The code for the Share! UI.

	
	Requires: jQuery Mobile, Bacbone
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/


// Set-up the namespace we put everything into...
// From: http://ricostacruz.com/backbone-patterns/#namespace_convention
var App = window.App = window.App || {};

/* Set to moustache style template format, 
	NOTE!!! will not work for looping...
http://stackoverflow.com/questions/9002203/backbone-underscore-template-in-mustache-format-causing-error-on-pound-hash-sy
*/
_.templateSettings = {
     evaluate : /\{\[([\s\S]+?)\]\}/g,
     interpolate : /\{\{([\s\S]+?)\}\}/g
};

$(document).bind( "mobileinit", function(event) {
    $.extend($.mobile.zoom, {locked:true,enabled:false});
    $('#SharePopUp').popup({ tolerance: "2" });
});

$(document).bind( "pagebeforeshow", function(event) {
    $('#SharePopUp').popup({ tolerance: "0" });
});

/*
 General structure based on:
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
App.Friends = new FriendsList;
App.Friends.add([
	{ name: "Bob Smith", photo: 'samples/person/img-001.jpeg'},
	{ name: "Foo Barer", photo: 'samples/person/img-002.jpeg'},
	{ name: "Hello Worlder", photo: 'samples/person/img-003.jpeg'},
	{ name: "Hello Wzxcsdf orlder", photo: 'samples/person/img-004.jpeg'},
	{ name: "Foo asdsdf", photo: 'samples/person/img-005.jpeg'},
	{ name: "Monetary Ecology", photo: 'samples/person/img-006.jpeg'},
	{ name: "New Money", photo: 'samples/person/img-004.jpeg'}
]);

$( document ).delegate("#TopPage", "pageinit", function() {
	App.FriendListItemView = Backbone.View.extend({
		template:  _.template($('#item-template').html()),
		tagName:  "li",
	    initialize: function(){
	    },
	    render: function(){
	    	var htmlT = this.template(this.model.toJSON());
	        this.$el.html(htmlT);
	        //.trigger('create');
	        //$("#friendlist").append(htmlT);
	        
	        // Tell jQuery Mobile to annotate the list item so it looks right...
	        //$("#friendlist").listview('refresh');
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

$(function(){	    
	// The date of the share...
    $('#ShareDate').scroller({
        preset: 'date',
        theme: 'android-ics light',
        dateOrder: 'MmD ddyy',
        display: 'inline',
        mode: 'scroller'
     });    
    
	    var curnames = ['\'000 ￥','$ US', '€ EUR','zł PLZ', '$ CAD', 'RUB','...'];
	    var moneyselectwheels = [{}];
	    var wheel = {};
	    for (var j=0;j<7;j++) {
	        wheel[curnames[j]] = "<div class='car'>"+curnames[j]+"</div>"
	    }

	    var amount = {};
	    for (var j=0;j<12;j++) {
	        amount[j] = "<div class='car'>"+j+"</div>"
	    }

	    moneyselectwheels[0]['Amount'] = amount;
	    moneyselectwheels[0]['Currency'] = wheel;
	
	    $('#ShareMoney').scroller({
	        theme: 'android-ics light',
	        display: 'inline',
	        mode: 'scroller',
	        wheels: moneyselectwheels,
	        height: 40
	    });    
   
	
	    var hoursselectorwheels = [{}];
	    var hours = {};
	    for (var j=0;j<12;j++) {
	        hours[j] = "<div class='car'>"+j+"</div>"
	    }
	
	    var minutes = {};
	    for (var j=0;j<4;j++) {
	        minutes[j] = "<div class='car'>"+(j*15)+"</div>"
	    }
	    hoursselectorwheels[0]['Hours'] = hours;
	    hoursselectorwheels[0]['Minutes'] = minutes;
	
	    $('#ShareHours').scroller({
	        theme: 'android-ics light',
	        display: 'inline',
	        mode: 'scroller',
	        wheels: hoursselectorwheels,
	        height: 40
	    });	
	});
