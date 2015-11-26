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
  $('.profile-link').on('click', displayOneUser);
  $('#create-post-button').on("click", showCreatePosts);
  $('.post-form').on('submit', addNewPost);
  $("#posts").on("click",".show-post", getOnePost);
  $('.search-form').on("submit", search)
  $('#scroll_to_about').on("click", function(){
    $(document.body).animate({'scrollTop' :$('#about').offset().top}, 900);
  })
  $('.search_title').hide();
  $('#user-profile-button').on('click', displayOneUser);
  $('#user-posts-button').on('click', displayOneUserPosts);
  $('#user-requests-button').on('click', displayOneUserRequests);
}


function whenYouPressLogIn(){
  $('#which_log_in').fadeIn(1000);
  $('#search-post-button').hide();
  $('#home-searchbox').hide();
  $('#search_blurb').hide();
  $('.overlay').fadeIn(2000);

};

function search(){
  event.preventDefault();

  var search   = $("#home-searchbox").val();
  var formData = $(this).serialize();
  console.log("cityLat.value "+document.getElementById('cityLat').value)
  console.log(document.getElementById('cityLng').value)


  $.ajax({
    method: "post",
    url: "http://localhost:3000/api"+$(this).attr("action"),
    data: formData
  }).done(function(data){
    hidePosts();
    var posts = data.posts;

    var title=  (posts[1].where).split(',');
    $('#nav-search-title').html('<h3>'+ title[0] + '</h3>');

    if (posts.length === 0) {
      showErrors("There are no posts found for this location.");
    }

    if (posts.length === 0 && !document.getElementById('cityLat').value) {
      showErrors("Please search again. That location was not found.")
    }

    for (var i=0; i<posts.length; i++) {
      $('.search-results').append(
        '<div class="each-result">'+
        '<div class="col-sm-4">' +
        '<p>'+ '"'+ posts[i].what + '"'+ '</p>'+
        '</div>' +
        '<div class="col-sm-4">' +
        '<p class="when">'+ posts[i].when + '</p>'+
        '</div>' +
        '<div class="col-sm-4">' +


        '<a class="logo_button_search_page accept" id=' + posts[i]._id + ' href="#"><img src="http://bit.ly/1XlIMbg" style="width: 7vh;"></a>'
          +
          '</div>' +
          '</div>'
         );
    }


    $('.search_title').show();
    $('#homepage-title').hide();
    $('#search-post-button').hide();
    $('#home-searchbox').hide();
    $('#search_blurb').hide();
    $('#scroll_to_about').hide();
    $('#about').hide();
    $('#posts').show();
    $(".navbar-default").css("background-color", "#111C24");
    $(".homepage-image").css("background-image", "none");
    $("body").css("background-color", "#E8ECF0");
    $('.where').show();
  })
}

function register(){
  event.preventDefault();

  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/register",
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data){
    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user._id);
    return loggedInStatus();
  }).fail(function(data){
    return showErrors(data.responseJSON.message);
  });
}

function login(){
  event.preventDefault();

  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/login",
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data){
    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user._id);
    return loggedInStatus();
  }).fail(function(data){

    return showErrors(data.responseJSON.message);
  });
}

function setCurrentUser() {
  var user_id = localStorage.getItem('user_id');
  $('.profile-link').attr('id', user_id);
}

function logout() {
  event.preventDefault();
  localStorage.clear();
  return loggedInStatus();
}

function showLogin() {
  event.preventDefault();
  hideErrors();
  whenYouPressLogIn();
  return $('#login').show();
}

function showRegister() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  return $('#register').show();
}

function initialPageSetup(){
  console.log('page-setup');
  hideErrors();
  $('section').hide();
  return loggedInStatus();
}

function setHeader(xhr, settings){
  var token = localStorage.getItem('token');

  if (token) return xhr.setRequestHeader('Authorization', 'Bearer ' + token);
}

function loggedInStatus(){
  var token = localStorage.getItem('token');

  if (token) {
    setCurrentUser();
    getUserInfo();
    return loggedInState();
  } else {
    return loggedOutState();
  }
}

function loggedInState() {
  $('section').hide();
  $('.logged-out').hide();
  $('.logged-in').show();
  $('#about').show();
  $('#search').show();
  $('#homepage-title').show();
  $('#learn_more_section').show();
}

function loggedOutState() {
  $('section').hide();
  $('.logged-out').show();
  $('.logged-in').hide();
  $('#about').show();
  $('#search').show();
  $('#homepage-title').show();
  $('#learn_more_section').show();
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
  $('#homepage-title').hide();
  $('#scroll_to_about').hide();
  $('#about').hide();
  $('#posts').show();
  $(".navbar-default").css("background-color", "#111C24");
  $(".homepage-image").css("background-image", "none");
  $("body").css("background-color", "#E8ECF0");



  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/posts'
  }).done(function(data){

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
      '<p>What: '+'"'+ posts[i].what +'"' + '</p>'+
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
  return $('.posts, .search-results').empty();
}


// Autocomplete
function setupGoogleMaps(){
  var fields = ["home-searchbox", "posts-searchbox"]

  $.each(fields, function(index, field){
    // Search box variable
    var searchBox = new google.maps.places.Autocomplete(document.getElementById(field));
    // // SearchBox event listener;
    google.maps.event.addListener(searchBox, 'place_changed', function() {
      var place = searchBox.getPlace();
      console.log("Search Box: "+searchBox)
      console.log(place);
      var placeLat = place.geometry.location.lat();
      var placeLng = place.geometry.location.lng();
      document.getElementById('cityLat').value = placeLat;
      console.log(placeLat);
      document.getElementById('cityLng').value = placeLng;
      console.log(placeLng);
    })

    //Clear the searchBox when we click on it; 
    $("#" + field).on('click', function(){
      $(this).val('');
    })
  })
}

// REQUESTS js

function getUserInfo() {
  event.preventDefault();

  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/users/'+localStorage.getItem('user_id'),
    beforeSend: setHeader
  }).done(function(data){

    fillInfoOneUser(data);
  })
}

function fillInfoOneUser(data) {
  var user     = data.user.local
  var posts    = data.user.local.posts

  console.log('filling User Info');
  $('#profile-image').attr('src', user.picture);
  $('#profile-name').html(user.firstName + " " + user.lastName);
  $('#profile-email').html(user.email);
  $('#profile-tagline').html(user.tagline);
  
  for (var i=0; i<posts.length; i++) {
    $('#user-profile-posts').append(
      '<div class="row">' +
      '<div class="col-sm-3">'+posts[i].where+'</div>' +
      '<div class="col-sm-3">'+posts[i].when+'</div>' +
      '<div class="col-sm-6">'+posts[i].what+'</div>' +
      '</div>'
      )
  }

  for (var i=0; i<posts.length; i++) {
    for(var j=0; j<posts[i].requests.length; j++){
      console.log(posts[i].requests[j])
      $('#user-profile-requests').append(
        '<div class="row">'+
        '<div class="col-sm-4">' +
        '<img id="requests-image">' +
        '</div>'+
        '<div class="col-sm-8">'+
        '<div class="row">'+
        '<div class="col-sm-12">'+
        '<h3 id="requests-name">'+ posts[i].requests[j].firstName+ '</h3>' +
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-sm-12">'+
        '<p id="requests-email">' + posts[i].requests[j].email +'</p>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-sm-12">'+
        '<p id="requests-message">' + posts[i].requests[j].message + '</p>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
        )
    }
  }
}

function displayOneUser() {
  event.preventDefault();
  console.log('displaying user');
  $('section').hide();
  $('#profile-tools').show();
  $('#profile').show();
}

function displayOneUserPosts() {
  event.preventDefault();
  console.log('displaying user');
  $('section').hide();
  $('#profile-tools').show();
  $('#profile-posts').show();
}

function displayOneUserRequests() {
  event.preventDefault();
  console.log('displaying user');
  $('section').hide();
  $('#profile-tools').show();
  $('#profile-requests').show();
}


// CHARACTER TICKER

function characterCount(TextArea,FieldToCount){
  var myField = document.getElementById(TextArea);
  var myLabel = document.getElementById(FieldToCount); 
  if(!myField || !myLabel){return false}; // catches errors
  var MaxChars =  myField.maxLengh;
  if(!MaxChars){MaxChars =  myField.getAttribute('maxlength') ; };  if(!MaxChars){return false};
  var remainingChars =   MaxChars - myField.value.length
  myLabel.innerHTML = remainingChars+" Characters Remaining of Maximum "+MaxChars
}

//SETUP!!
// setInterval(function(){CharacterCount('CharCountLabel1','CharCountLabel1')},55);
