$(init);

function init(){
  console.log("working");
  $('.register_form').on("submit", register);
  $('.login_form').on("submit", login);
}

function register(){
  event.preventDefault();
  console.log("clicked");
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/register",
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data){
    console.log(data)
  });
}

function login(){
  event.preventDefault();
  console.log("clicked");
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/login",
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data){
    if (data.token) localStorage.setItem('token', data.token);
    return loggedInStatus();
  })
}

function setHeader(xhr, settings){
  var token = localStorage.getItem('token');

  if (token) return xhr.setRequestHeader('Authorization', 'Bearer ' + token);
}

function loggedInStatus(){
  var token = localStorage.getItem('token');
  if (token) {
    return loggedInState();
  } else {
    return loggedOutState();
  }
}

function loggedInState() {
  $('.logged-out').hide();
  $('.logged-in').show();
  $('#register').hide();
  $('#login').hide();
  $('#posts').hide();
}

function loggedOutState() {
  $('.logged-out').show();
  $('.logged-in').hide();
  $('#register').show();
  $('#login').show();
  $('#posts').show();
}

