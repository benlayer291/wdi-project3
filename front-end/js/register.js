$(init);

function init(){
  initialPageSetup();
  setupGoogleMaps();
  console.log("working");
  $('.login_form').on('submit', login);
  $('.register_form').on('submit', register);
  $('.logout-link').on('click', logout);
  $('.login-link').on('click', showLogin);
  $('.register-link').on('click', showRegister);
  $('.posts-link').on('click', getPosts);
  $('#create-post-button').on("click", showCreatePosts);
  $('.post-form').on('submit', addNewPost);
  $("#posts").on("click",".show-post", getOnePost);
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
    console.log(data.token);
    if (data.token) localStorage.setItem('token', data.token);
    return loggedInStatus();
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

//POSTS js

function getPosts(){
  event.preventDefault();
  hideErrors();
  $('section').hide();
  $('#posts').show();
  
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/posts'
  }).done(function(data){
    console.log(data);
    displayAllPosts(data);
  }).fail(function(data){
    return showErrors(data.responseJSON.message);
  });
}

function displayAllPosts(data){
  hidePosts();
  var posts = data.posts;

  for (var i=0; i<posts.length; i++) {
    $('.posts').prepend(
      '<ul class="what">' +
      '<p>What: '+ posts[i].what + '</p>'+
      '</ul>' +
      '<ul class="where">'+
      '<p>Where: '+ posts[i].where + '</p>'+
      '</ul>' +
      '<ul class="when">'+
      '<p>When: '+ posts[i].when + '</p>'+
      '</ul>'+
      '<button type="button" id=' + posts[i]._id + ' class="show-post btn btn-default" value="Submit">Show Page</button>'
      );
  }
}

function showCreatePosts() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  $('#create-post').show();
}

function addNewPost(){
  event.preventDefault();

  console.log('creating new post');
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/api/posts',
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data) {
    getPosts();
  }).fail(function(data){
    return showErrors(data.responseJSON.message);
  });
}

function getOnePost(){
  event.preventDefault();
  hideErrors();
  $('section').hide();
  $('#posts').show();

  console.log('showing post');
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/posts/'+$(this).attr('id'),
    beforeSend: setHeader
  }).done(function(data){
    displayOnePost(data);
  }).fail(function(data){
    return showErrors(data.responseJSON.message);
  });
}

function displayOnePost(data){
  console.log('displaying one post');
  hidePosts();

  var post = data.post;

  $('.posts').prepend(
    '<ul class="what">' +
    '<p>What: '+ post.what + '</p>'+
    '</ul>' +
    '<ul class="where">'+
    '<p>Where: '+ post.where + '</p>'+
    '</ul>' +
    '<ul class="when">'+
    '<p>When: '+ post.when + '</p>'+
    '</ul>'+
    '<button type="button" id=' + post._id + ' class="show-post btn btn-default" value="Submit">Show Page</button>'
    );
}

function hidePosts(){
  return $('.posts').empty();
}

// Autocomplete
function setupGoogleMaps(){
  // Search box variable
  var searchBox = new google.maps.places.Autocomplete(document.getElementById('searchbox'));

  // SearchBox event listener;
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    searchBox.getPlaces();
  })

  //Clear the searchBox when we click on it; 
  $('#searchbox').on('click', function(){
    $(this).val('');
  })
}