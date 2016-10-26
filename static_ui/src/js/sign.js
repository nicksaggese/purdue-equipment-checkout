/* funtion to check if the user input matching password for signup */

function checkPassword(){
  if(document.getElementById("password").value === document.getElementById("confirm password").value){
    return true;
  }
  else{
    return false;
  }
}

/*  function to get a response from server when user clicks create account */

function submitLogin(){
  var theUrl = "http://ec2-52-42-46-135.us-west-2.compute.amazonaws.com:8080/createUser?USERS_FIRSTNAME="
  + document.getElementById("first name").value + "&USERS_LASTNAME=" + document.getElementById("last name").value +
  "&USERS_EMAIL=" + document.getElementById("email").value + "&USERS_PHONE=" + document.getElementById("number").value +
  "&USERS_USERNAME=" + document.getElementById("email").value+ "&USERS_PASSWORD="+document.getElementById("password").value + "&USERS_ISADMIN=false";

  $.ajax({
    method: 'GET',
    url: theUrl,
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: function(data){
      console.log(data);
      alert("Account successfully created, please login!");
      window.location = "index.html";
    },
    error: function(){
      console.log("Error");
    }
  });
}

$(document).ready(function(){
  $('#submit').click(function(){
    console.log("called");
    if(checkPassword()){
      submitLogin();
    }else{
      alert("Password does not match.");
    }
  });
});
