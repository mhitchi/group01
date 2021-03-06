$(document).ready(function () {
  //TODO create error handling for if no events are returned
  //TODO allow multiple queries

 //Empty Event Holder that user can attened
  var viableEvents = [];

//Map Quest Location Quiries retrieved from user with permission [ getCurrentLocation() ]
  var lat = "";
  var lon = "";
//Ticket Master Quiries [ Current Location || Default ]
  var searchAddress;
  var searchCity;
  var searchState;
  var searchCategory;

  var searchTime;
  var searchTime_24; //search time +24 hours

 //Map Quest Route Matrix Quieries
  var startPoint; // searchAddress + searchCity, + Search State

  //Map Quest Route Matrix Return Data
  var travelTime; //strat point --> event address
  var timeMenuItem;
  
  //Hardcode List of popular locations and events [ Ticket Master Quieries ]
  var locationsDropdown = ['Washington', 'New York City', 'Philadelphia'];
  var locationAttributes = ["DC", "NY", "PA"];
  var timeDropdown = [];
  var categoryDropdown = ['Sports', 'Music', 'Theater'];

  // Pre-Built DOM Elements
  var searchBtn = $('#search-btn');
  var inputDOM = $('#search-input');
  var searchbarDOM = $('.search');
  var locationMenuDOM = $('.location-menu');
  var timeMenuDOM = $('.time-menu');
  var categoryMenuDOM = $('.category-menu');
  var eventsListDOM = $('.events-list');

  var locationInputDOM = $('<input>');
  var categoryInputDOM = $('<input>');
  
  //HTML5 retrieve permission from user to get current location (latitude and longitude)  
  function getCurrentLocation() {
    
    function success(position) {
      //if permission granted set call [setAddress()] to convert lat and long to street adresss
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      setAddress();
    }
    function denied() {
      // if permission is denied set Ticket Master queries to defualt to "Washington"(city) and DC (state)
      searchAddress="";
      searchCity = "Washington";
      searchState = "DC";
      startPoint = searchCity + ", " + searchState;
      // Call to main to set defualts other than location [setTime() default && setCategory() defualt]
      main();
    }
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, denied);
    }
  }
  function setAddress() {
    getStreet(); //Map Quest Location API
  }
  function setTime() {
  //Set Default 'searchTime' to current Time and rounds to nearest 30 min window if we recive no user input upon initial quirey.
  //ISO 8601 required format to pass date strings into Ticket Master API
    var start = moment();
    var interval = 30 - (start.minute() % 30);
    var day = moment(start).add(interval, "minutes");
    //sets current time to ISO 8601 format
    searchTime = day.format();
    // additional time to ISO 8601 format +24 hours
    searchTime_24 = moment(day).add(24, "hours");
    searchTime_24 = searchTime_24.format();
  }
  function setEvent() {
    searchCategory = "";//Defualt == Empty to return events of all type
  }
  function main() {
    //Initial call to render prebuilt DOM and set inital search queries to defualt 
    //Nested call in respone to location servies permission
    setTime();
    setEvent();

  }

  // Current Location Map Quest API: Street Address obtained form AJAX call on lat and lon positions
  function getStreet() {
    var apikey = '8iMbHQoKISbmKAynwHsO7ZlMhuPhWgtu';
    $.ajax({
      url: 'https://www.mapquestapi.com/geocoding/v1/reverse',
      dataType: 'json',
      method: 'GET',
      data: {
        location: lat + "," + lon,
        key: apikey,
      }
    }).then(function (response) {
      //On succesful of good response: set Ticket Master Quiries off of retured info
      searchAddress = response.results[0].locations[0].street;
      searchCity = response.results[0].locations[0].adminArea5;
      searchState = response.results[0].locations[0].adminArea3;
      startPoint = searchAddress + ", " + searchCity + ", " + searchState;

      main(); //call to main to get other defualt values not obtained through location servies permissions
    });
  }
  function search_tmaster() {
    accessTicketMaster();
  }
  // Ticket Master AJAX
  function accessTicketMaster() {
    //Search for ticketed events based on: Location, Category, and Date(time)
    $.ajax({
      url: "https://app.ticketmaster.com/discovery/v2/events.json?",
      method: "GET",
      data: {
        apikey: "xB4pwlx2qXShKTb5vBvUcL98KBiIpsdp",
        city: searchCity,
        stateCode: searchState,
        countryCode: "US", //Hardcoded to US cities; Can be altered in the future based on LAT and LON for scalability
        keyword: searchCategory,
        startDateTime: searchTime,
        endDateTime: searchTime_24
      }
    }).done(function (response) {
     // Upon bad response rerender page to inform user to try new search paramaters
      console.log(response);
      if( response.page.totalElements === 0 ){
        eventsListDOM.empty();
        var eventRowDOM = $('<div>');
        eventRowDOM.addClass('animated row event-row col-12 fadeInUp');
        var emptyEventDOM = $('<h4>');
        emptyEventDOM.text("There are no events that meet your terms. Please refresh the page and try again.");
        eventRowDOM.append(emptyEventDOM);
        eventsListDOM.append(eventRowDOM);
      } else {
       // Upon good response, compare quiried event time (current time) against event start times and calculate travle time
       console.log("City: "+searchCity);
       console.log("Category: "+searchCategory);
       console.log("Time: "+searchTime);
        checkEvents(response);
      }
    });
    locationInputDOM.val("");
    categoryInputDOM.val("");
  }
  function checkEvents(response) {
    // loop through Ticket Master response, gather venue location details and empty current list of events
    eventsListDOM.empty();
    viableEvents = [];
    for (var i = 0; i < response._embedded.events.length; i++) {
      var event = response._embedded.events[i]; //current event
      var eventTime = response._embedded.events[i].dates.start.localDate+" "+response._embedded.events[i].dates.start.localTime ; //event dateTime
      var eventAddress = response._embedded.events[i]._embedded.venues[0].name + " " +
        response._embedded.events[i]._embedded.venues[0].address.line1 + ", " +
        response._embedded.events[i]._embedded.venues[0].city.name + ", " +
        response._embedded.events[i]._embedded.venues[0].state.stateCode;
      //Map Quest Route Matirx [getRoute()] calculates travel time and distace between start address and current event addresss
      getRoute(startPoint, eventAddress, event, eventTime, viableEvents); 
    }
  }
  // Travel time AJAX MAPQuest API: currentAddress/qurried address to event address
  function getRoute(start, end, event, eventTime, viableEvents) {
    $.post("https://www.mapquestapi.com/directions/v2/routematrix?key=7wBdDHmKJfeob8pxGJYQWNArZwtLnWu5",
      "json=" + JSON.stringify({
        'locations': [start, end],
        'options': { 'allToAll': false }
      }),
      function (response) {
        console.log(response);
        travelTime = response.time[1];
        // travelTime calculated to determin if user can travel to event address by event start time (based on current/quiried location)
        //if time of arrivale is < event start time, append current event to viable events array for display
        var eventStart = moment(eventTime).format("LLL");
        var qurryTime  = moment(searchTime).format("LLL");
        var t1 = new Date(eventStart);
        var t2 = new Date(qurryTime);
        var dif = Math.abs((t1 - t2)/1000); // how much time is betwwen qurried time and event start in seconds
        if(dif>travelTime) {
          viableEvents.push(event); // current event from parent function checkEvents()
          renderEvents();
        }
      }, "json");
  }

  //animate search btn makes everything slide up
  searchBtn.on('click', function () {
    $('.header').animate({
      'marginTop': "-120px"
    });
    searchbarDOM.animate({
      'marginTop': "1.5em"
    }, "slow");
    if( locationInputDOM.val() !== "" && locationInputDOM.val().indexOf(",") > -1 ) {
      var cityInputArr = locationInputDOM.val().split(',');
      searchCity = cityInputArr[0];
      searchState = cityInputArr[1];
      startPoint = searchCity+", "+searchState;
  
      inputDOM.attr('placeholder', startPoint);   
      console.log(startPoint);
      
    } else if( categoryInputDOM.val() !== "" ) {
      searchCategory = categoryInputDOM.val();

      inputDOM.attr('placeholder', searchCategory);   
      
    }
    search_tmaster();
  });

  // Make dropdown elements
  makeDropdowns();
  function makeDropdowns() {
    for (var i = 0; i < locationsDropdown.length; i++) {
      var locationMenuItem = $('<a>');
      locationMenuItem.addClass('dropdown-item');
      locationMenuItem.addClass('location-item');
      var itemText = locationsDropdown[i];
      locationMenuItem.text(itemText);
      locationMenuItem.attr("state-code", locationAttributes[i]);
      locationMenuItem.on('click', function () {
        searchCity = $(this).text();
        searchState = $(this).attr("state-code");
        startPoint = searchCity+", "+searchState;
        inputDOM.attr('placeholder', startPoint);
        // console.log(startPoint);
        //search_tmaster();
      });
      locationMenuDOM.append(locationMenuItem);
    }

    //make input field for location
    locationInputDOM.attr('type', 'text');
    locationInputDOM.attr('placeholder' , 'City Name, State Code');

    $(document).on('keypress',function(e) {
      if(e.which == 13) {
        inputDOM.attr('placeholder', "");
        if( locationInputDOM.val() !== "" && locationInputDOM.val().indexOf(",") > -1 ) {
          inputDOM.attr('placeholder', locationInputDOM.val());   
        } else if( categoryInputDOM.val() !== "" ) {
          getStreet();
          inputDOM.attr('placeholder', categoryInputDOM.val()); 
        }
      }
    });
      

    locationMenuDOM.append(locationInputDOM);
    // Make dropdown elements
      // Add add current hour + 11 proceeding hours to timeDropdown array for user selection
      var currentHour = moment().format('H'); //utilizing ilitary time to achieve AM and PM 
      // add up to 12 hours
      if( parseInt(currentHour) < 12){
        // while currentHour < 23, add 1
        for( var i = 0; (parseInt(currentHour) + i) < 23; i++ ){
          currentHour = moment().add(i, 'h').format('ha');
          timeDropdown.push(currentHour);
        }
      } else if( parseInt(currentHour) >= 12 ){
        for( var i = 0; (parseInt(currentHour) + i) < 20; i++ ){
          currentHour = moment().add(i, 'h').format('ha');
          timeDropdown.push(currentHour);
        }
      }
      for( var i = 0; i < timeDropdown.length; i++ ){
        timeMenuItem = $('<a>');
        timeMenuItem.addClass('dropdown-item');
        timeMenuItem.addClass('time-item');
        var itemText = timeDropdown[i];
        timeMenuItem.text(itemText);

        timeMenuItem.attr('iso86', moment().add(i, 'h').format());
        timeMenuItem.on('click', function() {
          searchTime = $(this).attr("iso86") ;
          var timeHolder = $(this).text();
          inputDOM.attr('placeholder', timeHolder);
          // console.log($(this).attr("iso86"));
          //search_tmaster();
        });
        timeMenuDOM.append(timeMenuItem);
        // Grab timeMenuDom input, changint it to different time format and pasting it to a TicketMaster//
      }    
    for (var i = 0; i < categoryDropdown.length; i++) {
      var categoryMenuItem = $('<a>');
      categoryMenuItem.addClass('dropdown-item');
      categoryMenuItem.addClass('category-item');
      var itemText = categoryDropdown[i];
      categoryMenuItem.text(itemText);
      categoryMenuItem.on('click', function () {
        searchCategory = $(this).text();
        inputDOM.attr('placeholder', searchCategory);
        // console.log(searchCategory);
        //search_tmaster();
      });
      
      categoryMenuDOM.append(categoryMenuItem);
    }
    //make input field for location
    categoryInputDOM.attr('type', 'text');
    categoryInputDOM.attr('placeholder' , 'Enter a keyword');
    categoryMenuDOM.append(categoryInputDOM);
  }
  
  //render events
  function renderEvents() {
    eventsListDOM.innerHTML = "";
    var eventRowDOM = $('<div>');
    eventRowDOM.addClass('animated row event-row col-12 fadeInUp');
    var eventInfoDivDOM = $('<div>');
    var eventNameDOM = $('<h2>');
    var eventImageDOM = $('<img>');
    var eventImageDivDOM = $('<div>');
    var eventLocationDOM = $('<h3>');
    var eventTimeDOM = $('<p>');
    var eventPriceDOM = $('<p>');
    var eventURL;

    console.log(viableEvents.length);
    //if viableEvents isn't empty, make DOM elements for each array item
    if( viableEvents.length === 0 ) {
      eventsListDOM.empty();
      var eventRowDOM = $('<div>');
      eventRowDOM.addClass('animated row event-row col-12 fadeInUp');
      var emptyEventDOM = $('<h4>');
      emptyEventDOM.text("There are no events that meet your terms. Please refresh the page and try again.");
      eventRowDOM.append(emptyEventDOM);
      eventsListDOM.append(eventRowDOM);
    } else {
      for (var i = 0; i < viableEvents.length; i++) {

      //append to eventsListDOM
      eventImageDivDOM.append(eventImageDOM);
      eventRowDOM.append(eventImageDivDOM);
      eventRowDOM.append(eventInfoDivDOM);
        //fill with info
        eventNameDOM.text(viableEvents[i].name);
        eventImageDivDOM.addClass('event-image-div col-5');
        eventInfoDivDOM.addClass('event-info-div col-7');
        eventImageDOM.attr('src', viableEvents[i].images[3].url);
        eventImageDOM.attr('alt', '');
        eventImageDOM.addClass('event-image');
        eventLocationDOM.text(viableEvents[i]._embedded.venues[0].name);
        eventTimeDOM.text(moment(viableEvents[i].dates.start.dateTime).format('ha'));
        //eventPriceDOM.text("$" + (viableEvents[i].priceRanges[0].min));
        // eventPriceDOM.text("$" + (viableEvents[i].priceRanges[0].min) + " -$" + (viableEvents[i].priceRanges[0].max));
        eventURL = viableEvents[i].url;

        //append to eventsListDOM
        eventImageDivDOM.append(eventImageDOM);
        eventRowDOM.append(eventImageDivDOM);
        eventRowDOM.append(eventInfoDivDOM);

        eventInfoDivDOM.append(eventNameDOM);
        eventInfoDivDOM.append(eventLocationDOM);
        eventInfoDivDOM.append(eventTimeDOM);
        eventInfoDivDOM.append(eventPriceDOM);
        // eventInfoDivDOM.append(eventURL);

        eventsListDOM.append(eventRowDOM);

        eventRowDOM.on('click', function() {
          window.open(eventURL, '_blank');
        });
        // eventRowDOM.on('mouseover', function() {
        //   eventRowDOM.addClass('animated pulse');
        // });
        console.log(i);
      }
    }
  }
  getCurrentLocation();
})//document ready end point 