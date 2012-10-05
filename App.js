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
	Returns a Javascript array of Share objects.
*/
function randomShares() {
	var shares = [];
	var count = Math.random()*10;
	for(; count-->0;){
		shares.push(new App.Share({
			date: new Date(),
			photo: 	'samples/things/img-006.jpeg',
			info: "Foobar",
			type: 'money',
			amount: 99
		}));
	}	
	console.log(shares);
	return shares;
}
App.Friends.add([
	{ name: "Bob Smith", photo: 'samples/person/img-001.jpeg', shares: randomShares()},
	{ name: "Foo Barer", photo: 'samples/person/img-002.jpeg', shares: randomShares()},
	{ name: "Hello Worlder", photo: 'samples/person/img-003.jpeg', shares: randomShares()},
	{ name: "Hello Wzxcsdf orlder", photo: 'samples/person/img-004.jpeg', shares: randomShares()},
	{ name: "Foo asdsdf", photo: 'samples/person/img-005.jpeg', shares: randomShares()},
	{ name: "Monetary Ecology", photo: 'samples/person/img-006.jpeg', shares: randomShares()},
	{ name: "New Money", photo: 'samples/person/img-004.jpeg', shares: randomShares()}
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

	        console.log(this.model.get("shares"));
	    	var theelem = this.$el;
	    	_.each(this.model.get("shares"), function(share){
		    	console.log(share);
		        theelem.append(share.get("info")); 		
	    	})
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

/* The tabs of share select dialog.*/
var prevSelection = "tab1";
$("#ShareTypeTab ul li").live("click",function(){
    var newSelection = $(this).children("a").attr("data-tab-class");
    $("."+prevSelection).addClass("ui-screen-hidden");
    $("."+newSelection).removeClass("ui-screen-hidden");
    prevSelection = newSelection;
});
