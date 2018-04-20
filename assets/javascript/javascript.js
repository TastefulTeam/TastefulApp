// Initialize Firebase
var config = {
  apiKey: "AIzaSyD7ekxCRWT9YiQboNS_8YFzVULbmmERSoc",
  authDomain: "tasteful-7f122.firebaseapp.com",
  databaseURL: "https://tasteful-7f122.firebaseio.com",
  projectId: "tasteful-7f122",
  storageBucket: "tasteful-7f122.appspot.com",
  messagingSenderId: "285048212369"
};
firebase.initializeApp(config);

var database = firebase.database();

//------------------------------------------------//
/* Opening Page Functions */
/* Creates Background Slideshow */
function setupCarousel() {
  var slideIndex = 0;
  carousel();

  function carousel() {
    var x = document.getElementsByClassName("mySlides"); // Assigns variable to .mySlides
    for (var i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    slideIndex++; // Filters thru background images
    if (slideIndex > x.length) {
      slideIndex = 1
    }
    x[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 4000); // Change image every 5 seconds
  }

};

/* Set-Up Account Functions */
/* Function for creating New user account */
function setupLoginPage() {
  // Button for adding new user
  $("#submit-account-button").on("click", function (event) {
    event.preventDefault();

    // Grab user input
    var newEmail = $("#email-input").val().trim();
    var newUserName = $("#user-name-input").val().trim();
    var newPassword = $("#password-input").val().trim();
    var newConfirmPassword = $("#confirm-password-input").val().trim();

    if (newPassword === newConfirmPassword && newPassword.length >= 6) { // If newPassword === newConfirmPassword and password < 6 then....

      var newUserPassword = newPassword // Create new user password variable

      var user = { // Creates user object containing email, username, and password
        email: newEmail,
        userName: newUserName,
        password: newUserPassword,
        foodFeatures: [] // Adds array to user object
      };

      window.location.href = 'survey-page.html'; // Jumps to survey page

    } else if (newPassword === newConfirmPassword && newPassword.length < 6) { // Creates alert if password is less than 6 characters long
      $("#invalid").empty();
      $("#invalid").append("Password must be at least 6 characters long.")
    } else if (newPassword !== newConfirmPassword) { // Creates alert if password doesn't match
      $("#invalid").empty();
      $("#invalid").append("Looks you're passwords didn't match! Please try again.");
    };
    console.log(user);

    // Uploads Account Info to Firebase database
    database.ref().push(user);

    // Clears all of the text-boxes
    $("#real-name-input").val("");
    $("#account-name-input").val("");
    $("#new-password-input").val("");
    $("#confirm-pasword-input").val("");

    // Places Account Info into Local Storage
    localStorage.setItem('localUser', JSON.stringify(user));
  });
};

/* Survey Page Functions */
/* Function to check if any items are selected */
function submitCheckBoxes() {

  $("#submit-survey-button").on("click", function (event) {
    var user = JSON.parse(localStorage.getItem('localUser')); // Calls user object
    var allCheckBoxes = document.getElementsByClassName("features"); // Assigns variable to feautures checkboxes 
    user.foodFeatures = []; // Calls array from within user object and clears any unwanted checkbox values 

    for (var i = 0; i < allCheckBoxes.length; i++) { // Loops thru array variable 
      var checkBox = allCheckBoxes[i]; // Assigns variable to all individual checkboxes

      if (checkBox.checked === true) { // If checkbox is checked when submit button is pressed...
        user.foodFeatures.push(checkBox.getAttribute('value')); // Pushes checked values into foodFeatures array
        window.location.href = 'main-page.html'; // Jumps to main page
      } else {
        // Need to add alert when no options are selected
      }
    }
    localStorage.setItem('localUser', JSON.stringify(user)); // Takes user object and makes it into a string
  });
};

/* Main Page Functions */
/* Function to initialize Dropdown Menu */
function initializeDropMenu() {
  var dropdown = document.getElementsByClassName("dropdown-btn"); // Assigns variable to dropdown buttons containing foodFeatures

  for (var i = 0; i < dropdown.length; i++) { // Loops thru all dropdowns
    dropdown[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling; // Calls all elements within dropdown button
      if (dropdownContent.style.display === "block") { // Displays features
        dropdownContent.style.display = "none"; // Hides features

      } else {
        dropdownContent.style.display = "block";
      }
    });
  }
};

/* Main Page Functions */
/* Pulls info from the User Object and makes greeting on top right hand side */
function setupUserGreeting() {

  var user = JSON.parse(localStorage.getItem('localUser')); // Call user object
  if (user === null) {
    $(".userDropbtn").text("Hello Friend"); // User Greeting
    $("#logout").text("Back to Home Page")
    initializeDropMenu();
  }else{
    $(".userDropbtn").text("Hello " + user.userName); // User Greeting
    $("#logout").text("Logout")    
    initializeDropMenu();
  }

};

/* Main Page Functions */
/* Function that checks if features was previously checked on survey page */
/* Function also interacts with the search */
function checkBoxUpdater() {
  var user = JSON.parse(localStorage.getItem('localUser')); // Calls user object
  var featuresArray = user.foodFeatures;
  var checkBoxes = document.getElementsByClassName("features");

  for (i = 0; i < checkBoxes.length; i++) { // Standard for loop
    var checkBox = checkBoxes[i].getAttribute('value'); // Assigns a varible to value of checkboxes[i]

    for (y = 0; y < featuresArray.length; y++) { // Runs for loop for checked food features array within Checkboxes for loop
      if (checkBox === featuresArray[y]) {
        $(checkBoxes[i]).prop('checked', true); // If value a value in a checkbox === a value in the array, marks said checkbox as checked
      }
    }
  }
  console.log(featuresArray);
}

function logOut() {

  $('#logout').on('click', function (event) {
    localStorage.clear();
    window.location.href = 'index.html'; // Jumps to Index
  });

}



/*
database.ref().on("child_added", function (childSnapShot, prevChildKey) {
  console.log(childSnapShot.val());

  // Stores everything into a variable
  var fireBaseEmail = childSnapShot.val().email;
  var fireBaseUserName = childSnapShot.val().userName;
  var fireBasePassword = childSnapShot.val().password;
  var fireBaseFoodFeatures = childSnapShot.val().foodFeatures;

  // Account Info
  console.log("Firebase says your email is: ", fireBaseEmail);
  console.log("Firebase says your username is: ", fireBaseUserName);
  console.log("Firebase says your password is: ", fireBasePassword);
  console.log("Firebase says array name is: ", fireBaseFoodFeatures);
});
*/