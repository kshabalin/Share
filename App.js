/*
	The code for the Share! UI mobile application

	
	Requires: jQuery Mobile, Backbone
	
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
    $('#share-dialog').popup({ tolerance: "2" });
});

$(document).bind( "pagebeforeshow", function(event) {
    $('#share-dialog').popup({ tolerance: "0" });
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
  Generates a random word...
  From: http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
*/
function randomWord() {
    var charSet = 'abcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    var len = _.random(2,7);
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

/*
  Generates a random date... 
  From: http://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
*/
function randomDate(start, end) {
    return moment(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/*
  Generates a random sentence...
  (can be empty)
  
*/
function randomSentence() {
	var sentence = "";
	var wordCount = _.random(0,5);
	for(;wordCount-->0;) {
		sentence += randomWord();
		sentence += " ";
	}
	
	return sentence;
}

/*
	Returns a Javascript array of randomly generated Share objects.
*/
function randomShares() {
	var shares = [];
	var count = _.random(1,5);
	var startDate = moment();
	startDate.subtract('days',_.random(0,40));
	for(; count-->0;){
		shares.push(new App.Share({
			date: moment(startDate),
			photo: 	'samples/things/img-00'+(Math.round(1+Math.random()*5))+'.jpeg',
			info: randomSentence(),
			type: 'money',
			amount: _.random(0,100)
		}));
		startDate.subtract('days',_.random(10,220));
	}	
	return shares;
}

// Setup random test data.
App.Friends.add([
	{ name: "Bob Smith", photo: 'samples/person/img-001.jpeg', shares: randomShares()},
	{ name: "Foo Barer", photo: 'samples/person/img-002.jpeg', shares: randomShares()},
	{ name: "Hello Worlder", photo: 'samples/person/img-003.jpeg', shares: randomShares()},
	{ name: "Hello Wzxcsdf orlder", photo: 'samples/person/img-004.jpeg', shares: randomShares()},
	{ name: "Foo asdsdf", photo: 'samples/person/img-005.jpeg', shares: randomShares()},
	{ name: "Monetary Ecology", photo: 'samples/person/img-006.jpeg', shares: randomShares()},
	{ name: "New Money", photo: 'samples/person/img-004.jpeg', shares: randomShares()}
]);

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
			    	console.log(json.date);
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

$(function setupmobiscrollers(){	    
	// The date of the share...
	$('#share-date').scroller({
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

    $('#share-money').scroller({
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

    $('#share-hours').scroller({
        theme: 'android-ics light',
        display: 'inline',
        mode: 'scroller',
        wheels: hoursselectorwheels,
        height: 40
    });	
});

/* Set-up the actions of the tabs of share select dialog.*/
var prevSelection = "tab1";
$("#share-type-tab ul li").live("click",function(){
    var newSelection = $(this).children("a").attr("data-tab-class");
    $("."+prevSelection).addClass("ui-screen-hidden");
    $("."+newSelection).removeClass("ui-screen-hidden");
    prevSelection = newSelection;
});
