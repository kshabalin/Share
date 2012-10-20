/*
	Generates sample test data to fill-out the application.

	
	Requires: App.js
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/

// Set-up the namespace we put everything into...
var App = window.App;

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
var idCounter = _.random(0,10000)

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
			amount: _.random(0,100),
			id: idCounter++
		}));
		startDate.subtract('days',_.random(10,220));
	}	
	return shares;
}

// Setup random test data.
App.Friends.add([
	{ name: "Bob Smith", photo: 'samples/person/img-001.jpeg', id: idCounter++,},
	{ name: "Foo Barer", photo: 'samples/person/img-002.jpeg', id: idCounter++,},
	{ name: "Hello Worlder", photo: 'samples/person/img-003.jpeg', id: idCounter++,},
	{ name: "Hello Wzxcsdf orlder", photo: 'samples/person/img-004.jpeg', id: idCounter++,},
	{ name: "Foo asdsdf", photo: 'samples/person/img-005.jpeg', id: idCounter++,},
	{ name: "Monetary Ecology", photo: 'samples/person/img-006.jpeg', id: idCounter++,},
	{ name: "New Money", photo: 'samples/person/img-004.jpeg', id: idCounter++,}
]);
App.Friends.each(function(friend){
	friend.addShare(randomShares());
})