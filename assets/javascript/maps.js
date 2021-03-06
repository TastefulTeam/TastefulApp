// Global Variables
var map, places, infoWindow;
var markers = [];
// Variable for search bar autocomplete
var autocomplete;
// Array of Taste filters
var food = ["Salty", "Sweet", "Sour", "Fruity", "Vegan", "Crunchy", "Crispy"];
// Empty array to push taste into keywords
var chosenFood = [];
// Currently restrict searchs in autocomplete to USA only
var countryRestrict = { 'country': 'us' };
// Grab marker image from google documentation
var MARKER_PATH = 'assets/images/markers/marker_red';
// use RegExp to shorten URLs to simple ones
var urlnameRegexp = new RegExp('^https?://.+?/');

var user = JSON.parse(localStorage.getItem('localUser')); // Calls user object
var allCheckBoxes = document.getElementsByClassName("features"); // Assigns variable to feautures checkboxes 
var foodFeatures = []; // Calls array from within user object and clears any unwanted checkbox values 

/**************************************************
*      Start of Generate Google Map UI Code       *
***************************************************/

// This function is what generates the map when page is loaded with it starting in the USA
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 37.1, lng: -95.7 },
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  // Place autocomplete search box inside UI of map
  var input = document.getElementById('autocomplete');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

  	var myMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP
	});
  yourLocationButton(map, myMarker);
}

/**************************************************
*       End of Generate Google Map UI Code        *
***************************************************/

/**************************************************
*         Start of Current Location Code          *
***************************************************/

function yourLocationButton(map, marker)
{
  // Create Your Location Button
  var controlDiv = document.createElement('div');
	var controlBorder = document.createElement('button');
  controlBorder.style.backgroundColor = '#fff';
  controlBorder.style.border = 'none';
	controlBorder.style.outline = 'none';
	controlBorder.style.width = '28px';
	controlBorder.style.height = '28px';
	controlBorder.style.borderRadius = '2px';
	controlBorder.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
	controlBorder.style.cursor = 'pointer';
	controlBorder.style.marginRight = '10px';
	controlBorder.style.padding = '0px';
	controlBorder.title = 'Your Location';
  controlDiv.appendChild(controlBorder);
  
  var controlText = document.createElement('div');
	controlText.style.margin = '5px';
	controlText.style.width = '18px';
	controlText.style.height = '18px';
	controlText.style.backgroundImage = 'url(assets/images/mylocation-sprite-1x.png)';
	controlText.style.backgroundSize = '180px 18px';
	controlText.style.backgroundPosition = '0px 0px';
	controlText.style.backgroundRepeat = 'no-repeat';
	controlText.id = 'you_location_img';
  controlBorder.appendChild(controlText);
  
  google.maps.event.addListener(map, 'dragend', function() {
		$('#your_location_img').css('background-position', '0px 0px');
  });
  
  controlBorder.addEventListener('click', function() {
		var imgLoc = '0';
		var animationInterval = setInterval(function(){
			if(imgLoc == '-18') imgLoc = '0';
			else imgLoc = '-18';
			$('#your_location_img').css('background-position', imgLoc +'px 0px');
    }, 500);
    
    // Google Maps API code for geolocation which grabs users device current location
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				marker.setPosition(latlng);
        map.setCenter(latlng);
        map.setZoom(15);
        clearInterval(animationInterval);
        $('#your_location_img').css('background-position', '-144px 0px');
        search();
			});
		}
		else{
			clearInterval(animationInterval);
			$('#your_location_img').css('background-position', '0px 0px');
		}
  });
  
  // Position the current locations button at the bottom right corner or MAP UI
  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  
}

/**************************************************
*          End of Current Location Code           *
***************************************************/

/**************************************************
*      Start Of Search by City Nearby Code        *
***************************************************/

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
    radius: 4000,
    keyword: foodFeatures
    // keyword: chosenFood[chosenFood.length-1]
  }
  console.log(search.keyword);

  // Google places library searches nearby restaurants in the your chosen area
  places.nearbySearch(search, function (results, status, pagination) {
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
          icon: markerIcon,
        });

        // When marker is clicked show mini info window with locations details
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }

      // Google Places API Code to get more results past the initial 20 results up to 60 results can be found
      var getNextPage = null;
      var moreButton = document.getElementById('moreResults');
      moreButton.onclick = function() {
        moreButton.disabled = true;
        if (getNextPage) getNextPage();
      };
      moreButton.disabled = !pagination.hasNextPage;
      getNextPage = pagination.hasNextPage && function() {
        pagination.nextPage();
      };
    }
  });
}

/**************************************************
*        End Of Search by City Nearby Code        *
***************************************************/

/**************************************************
 *          Start of Map Markers Code             *
***************************************************/

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
  tr.style.backgroundColor = (i % 2 === 0 ? '#36404f' : '#3c4858');
  tr.style.color = ("#ffffff");
  tr.style.textIndent = ("10px");
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
 *           End of Map Markers Code              *
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
    console.log(foodPush);
    var found = foodPush.find(function(element) {
      // return element === filter;
      if(element === filter) {
        console.log(found);
        console.log(element);
        // foodPush.push(filter);
        chosenFood.push(element);
        console.log(chosenFood);
      }
      });
    // chosenFood.push(filter);
    // console.log(chosenFood);
    search();
  });
};
console.log("Chosen food is: " + chosenFood);

$(".features").on("click", function (event) {
  var foodFeatures = []; // Calls array from within user object and clears any unwanted checkbox values 

  for (var i = 0; i < allCheckBoxes.length; i++) { // Loops thru array variable 
    var checkBox = allCheckBoxes[i]; // Assigns variable to all individual checkboxes

    if (checkBox.checked === true) { // If checkbox is checked when submit button is pressed...
      foodFeatures.push(checkBox.getAttribute('value')); // Pushes checked values into foodFeatures array
      search();
      console.log(foodFeatures);
    }else{
      search();
      // Need to add alert when no options are selected
    }
  }
  localStorage.setItem('localUser', JSON.stringify(user)); // Takes user object and makes it into a string
});

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


// // Call function createButtons
// createButtons();