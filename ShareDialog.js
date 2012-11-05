/*
	Handles the ShareDialog widgets & etc.

	
	Requires: App.js
	
	Copyright (c) 2012 Vorski Imagineering - Victor Vorski
*/

// Set-up the namespace we put everything into...
// From: http://ricostacruz.com/backbone-patterns/#namespace_convention
var App = window.App = window.App || {};


$(function setupmobiscrollers(){	    
	// The date of the share...
	$('#share-date').scroller({
	    preset: 'date',
	    theme: 'android-ics light',
	    dateOrder: 'MmD ddyy',
	    display: 'inline',
	    mode: 'scroller'
	 });    

    var curnames = ['\'000 я┐е','$ US', 'тВм EUR','z┼В PLZ', '$ CAD', 'RUB','...'];
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

