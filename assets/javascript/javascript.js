

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

function setupCarousel() {
    var slideIndex = 0;
    carousel();

    function carousel() {
      var i;
      var x = document.getElementsByClassName("mySlides");
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > x.length) {
        slideIndex = 1
      }
      x[slideIndex - 1].style.display = "block";
      setTimeout(carousel, 4000); // Change image every 5 seconds
    }

};


function setupLoginPage() {
  // Button for adding new user
  $("#submit-button").on("click", function (event) {
    event.preventDefault();

    //Grab user input
    var newEmail = $("#email-input").val().trim();
    var newUserName = $("#user-name-input").val().trim();
    var newPassword = $("#password-input").val().trim();
    var newConfirmPassword = $("#confirm-password-input").val().trim();

    if (newPassword === newConfirmPassword && newPassword.length > 6) {
      console.log("They Match!");

      var newUserPassword = newPassword

      var user = {
        email: newEmail,
        userName: newUserName,
        password: newUserPassword,
        foodFeatures: ["littleCato"]
      };

    } else if (newPassword === newConfirmPassword && newPassword.length < 6) {
      $("#invalid").empty();
      $("#invalid").append("Password must be at least 6 characters long.")
    } else if (newPassword !== newConfirmPassword) {
      $("#invalid").empty();
      $("#invalid").append("Looks you're passwords didn't match! Please try again.")

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
    localStorage.setItem('localEmail', user.email);
    localStorage.setItem('localUserName', user.userName);
    localStorage.setItem('localPassword', user.password);
    localStorage.setItem('localFoodFeatures', user.foodFeatures);

    console.log("Local Email is:", localEmail);
    console.log("Local User Name is:", localUserName);
    console.log("Local password is:", localPassword);
    console.log("Local food array has:", localFoodFeatures);

  });
}
/*
function setupUserGreeting() {
  var userName = localStorage.getItem('localUserName');
  console.log("hello", userName);
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

