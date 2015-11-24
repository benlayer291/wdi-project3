$(init);

function init(){
  initialPageSetup();
  console.log("working");
  $('.login_form').on("submit", login);
  $('.logout-link').on('click', logout);
  $('.login-link').on('click', showLogin);
  $('.register-link').on('click', showRegister);
  $('.posts-link').on('click', showPosts);
  $('#create-post-button').on("click", showCreatePosts)

  // Geegee
  $(".post_form").on("submit", submitPost);
  $("#posts").on("click",".show-post", showPost);

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

// POST Border
function submitPost(){
  event.preventDefault();
  $.ajax({ 
    method: "POST",
    url: "http://localhost:3000/api/posts",
    data: $(this).serialize()
  }).done(function(data){
    console.log(data)
  })
  // $('section').hide();
  // $('#posts').show();
}

function showPosts() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  $('#posts').show();
  return getPosts();
}

function showPost() {
  console.log("Click bruh")
  return ajaxRequest("get", "http://localhost:3000/api/posts/"+$(this).attr('id'), null, displayPost)
}


function showCreatePosts(){
  event.preventDefault();
  hideErrors();
  $('section').hide();
  return $("#create-post").show();
}

function getPosts(){
  return ajaxRequest("get", "http://localhost:3000/api/posts", null, displayPosts)
}

function displayPosts(data){
  hideErrors();
  hidePosts();
  return $.each(data.posts, function(index, post) {
    $(".posts").prepend('<div class="post">'+
      '<ul class="what">' +
      '<p>What: '+ post.what + '</p>'+
      '</ul>' +
      '<ul class="where">'+
      '<p>Where: '+ post.where + '</p>'+
      '</ul>' +
      '<ul class="when">'+
      '<p>When: '+ post.when + '</p>'+
      '</ul>'+
      '<button type="button" id=' + post._id + ' class="show-post btn btn-default" value="Submit">Show Page</button>'+
      '</div>'
    );
  });
}

function displayPost(data) {
  hideErrors();
  hidePosts();
  console.log(data);
  $(".posts").prepend('<div class="post">'+
    '<ul class="what">' +
    '<p>What: '+ data.post.what + '</p>'+
    '</ul>' +
    '<ul class="where">'+
    '<p>Where: '+ data.post.where + '</p>'+
    '</ul>' +
    '<ul class="when">'+
    '<p>When: '+ data.post.when + '</p>'+
    '</ul>'+
    '<button type="button" id=' + data.post._id + ' class="show-post" value="Submit">Show Page</button>'+
    '</div>'
  );
}

function ajaxRequest(method, url, data, callback) {
  return $.ajax({
    method: method,
    url: url,
    data: data,
  }).done(function(data){
    if (callback) return callback(data)
  }).fail(function(data){
    showErrors(data.responseJSON.message)
  });
}

function hidePosts(){
  return $(".post").empty();
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
 

