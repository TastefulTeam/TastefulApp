// Global Variables
var map, places, infoWindow;
var markers = [];
var autocomplete;
var food = ["Spicy", "Fish", "Sushi", "Sweet", "Pizza"];
var chosenFood = [];
// Currently restrict searchs in autocomplete to USA only
var countryRestrict = { 'country': 'us' };
// Grab marker image from google documentation
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
// use RegExp to shorten URLs to simple ones
var urlnameRegexp = new RegExp('^https?://.+?/');

// // Create Buttons based on strings inside variable food
// var food = ["Spicy", "Fish", "Sushi", "Sweet"];
//       function createButtons(food) {
//         for (var i = 0; i < food.length; i++) {
//           var a = $("<button>");
//           a.addClass("food");
//           a.attr("data-name", food[i]);
//           a.text(food[i]);
//           $("#buttons-view").append(a);
//         }
//         $("#buttons-view").on("click", ".food", function() {
//         var filter = $(this).attr("data-name");
//         console.log(filter);
//       });
//       }

//       createButtons();

/**************************************************
 *        Start of Map and Marker Code            *
***************************************************/


// This function is what generates the map when page is loaded with it starting in the USA
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 37.1, lng: -95.7 },
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')

  });

  // Create the autocomplete object based on what the user inputs
  // Restrict the search to the default USA, and restrict user input to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(
      document.getElementById('autocomplete')), {
      types: ['(cities)'],
      componentRestrictions: countryRestrict
    });
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);
}

// Zoom in on User city input
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}

// Search for restaurants in User City and show Icons within user field of view
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['restaurant'],
    keyword: chosenFood
  }
  console.log(search.keyword);

  places.nearbySearch(search, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      // Create a marker for each restaurant found
      for (var i = 0; i < results.length; i++) {
        // Label markers with letters in order of the alphabet
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Marker Drop Animation
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });

        // When marker is clicked show mini info window with locations details
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
        

      }
    }
  });
}

// Function to clear markers when needed
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

// Function to add multiple markers without this it will only add one marker at a time
function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  icon.setAttribute('id', 'crispy');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

// Function will clear info from markers without this even if markers are cleared it still holds old markers restaurant info
function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

/**************************************************
 *         End of Map and Marker Code             *
***************************************************/

/**************************************************
 *            Start of Filters Code               *
***************************************************/

function createButtons() {
  console.log("inside function");
  for (var i = 0; i < food.length; i++) {
    var a = $("<button>");
    a.addClass("food");
    a.attr("data-name", food[i]);
    a.text(food[i]);
    $("#foodButtons").append(a);
  }
  $("#foodButtons").on("click", ".food", function () {
    // for (var i = 0; i < food.length; i++) {
    var filter = $(this).attr("data-name");
    // }
    console.log(filter);
    var foodPush = [];
    foodPush.push(filter);
    chosenFood.push(foodPush);
    // chosenFood.push(filter);
    // console.log(chosenFood);
    search();
  });
};
console.log(chosenFood);

/**************************************************
 *             End of Filters Code                *
***************************************************/


/**************************************************
 *     Start of Restuarant Information Code       *
***************************************************/

// Function will display restaurant info in small window
function showInfoWindow() {
  var marker = this;
  places.getDetails({ placeId: marker.placeResult.place_id },
    function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      infoWindow.open(map, marker);
      buildIWContent(place);
    });
}

// Load html into restaurant info window to display in order we want
function buildIWContent(place) {
  // Display google provided Icon for restaurants
  document.getElementById('icon').innerHTML = '<img class="restaurantIcon" ' +
    'src="' + place.icon + '"/>';
  //Display restaurant name
  document.getElementById('url').innerHTML = '<b><a href="' + place.url +
    '">' + place.name + '</a></b>';
  //Display restaurant address
  document.getElementById('address').textContent = place.vicinity;

  // Show restaurant phone number
  if (place.formatted_phone_number) {
    document.getElementById('phone-row').style.display = '';
    document.getElementById('phone').textContent =
      place.formatted_phone_number;
  } else {
    document.getElementById('phone-row').style.display = 'none';
  }

  // Show restaurant rating
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
      document.getElementById('rating-row').style.display = '';
      document.getElementById('rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('rating-row').style.display = 'none';
  }

  //Use Regexp to shorten URLS to simple ones to fit in info window
  if (place.website) {
    var fullUrl = place.website;
    var website = urlnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('website-row').style.display = '';
    document.getElementById('website').textContent = website;
  } else {
    document.getElementById('website-row').style.display = 'none';
  }
}

/**************************************************
 *      End of Restuarant Information Code        *
***************************************************/


// Call function createButtons
createButtons();