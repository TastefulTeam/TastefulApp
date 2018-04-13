/*
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
    } */

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

// Button for adding new user
$("#submit-account-btn").on("click", function (event) {
  event.preventDefault();

  //Grab user input
  var newRealName = $("#real-name-input").val().trim();
  var newAccountName = $("#account-name-input").val().trim();
  var newPW = $("#new-password-input").val().trim();
  var confirmPW = $("#confirm-password-input").val().trim();

  if (newPW === confirmPW && confirmPW.length > 6) {
    console.log("They Match!");

    var userPassword = confirmPW

    var newUser = {
      realName: newRealName,
      accountName: newAccountName,
      accountPassword: userPassword
    };
    window.location.href = 'main-page.html';
  }else if(newPW === confirmPW && confirmPW.length < 6) {
    $("#invalid").empty();
    $("#invalid").append("Password must be at least 6 characters long.")    
  } else if(newPW !== confirmPW) {
    $("#invalid").empty();    
    $("#invalid").append("Looks you're passwords didn't match! Please try again.")
  };

  // Uploads Account Info to the database
  database.ref().push(newUser);

  // Clears all of the text-boxes
  $("#real-name-input").val("");
  $("#account-name-input").val("");
  $("#new-password-input").val("");
  $("#confirm-pasword-input").val("");
});

database.ref().on("child_added", function (childSnapShot, prevChildKey) {
  console.log(childSnapShot.val());

  // Stores everything into a variable
  var fireBaseRealName = childSnapShot.val().realName;
  var fireBaseAccountName = childSnapShot.val().accountName;
  var fireBasePassword = childSnapShot.val().accountPassword;

  // Account Info
  console.log("Firebase says your real name is: ", fireBaseRealName);
  console.log("Firebase says your account name is: ", fireBaseAccountName);
  console.log("Firebase says your password is: ", fireBasePassword);
});