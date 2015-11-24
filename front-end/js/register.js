$(init);

function init(){
  initialPageSetup();
  console.log("working");
  $('.register_form').on("submit", register);
  $('.login_form').on("submit", login);
  $('.logout-link').on('click', logout);
  $('.login-link').on('click', showLogin);
  $('.register-link').on('click', showRegister);
  $('.posts-link').on('click', showPosts);
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
  }).fail(function(data){
    return showErrors(data.responseJSON.message);
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
    console.log(data.token);
    if (data.token) localStorage.setItem('token', data.token);
    return loggedInStatus();
  }).fail(function(data){
    console.log(data.responseJSON.message);
    return showErrors(data.responseJSON.message);
  });
}

function logout() {
  event.preventDefault();
  localStorage.clear();
  return loggedInStatus();
}

function showLogin() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  return $('#login').show();
}

function showRegister() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  return $('#register').show();
}

function showPosts() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  return $('#posts').show();
}

function initialPageSetup(){
  console.log("setup");
  hideErrors();
  $('section').hide();
  $('#search').show();
  return loggedInStatus();
}

function setHeader(xhr, settings){
  var token = localStorage.getItem('token');

  if (token) return xhr.setRequestHeader('Authorization', 'Bearer ' + token);
}

function loggedInStatus(){
  var token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    return loggedInState();
  } else {
    return loggedOutState();
  }
}

function loggedInState() {
  $('.logged-out').hide();
  $('.logged-in').show();
  $('section').hide();
  $('#search').show();
}

function loggedOutState() {
  $('.logged-out').show();
  $('.logged-in').hide();
  $('section').hide();
  $('#search').show();
}

function showErrors(message) {
  $('.alert').text(message).removeClass('hide').addClass('show');
}

function hideErrors() {
  $('.alert').removeClass('show').addClass('hide');
}
 

