$(init);

function init(){
  $("form").on("submit", submitPost);
  $(".post-link").on("click", posts);
}

function submitPost(){
  event.preventDefault();

  var method = $(this).attr("method");
  var url    = "http://localhost:3000/api" + $(this).attr("action");
  var data   = $(this).serialize();

  return ajaxRequest(method, url, data);
}

function posts(){
  event.preventDefault();
  return getPosts();
}

function getPosts(){
  return ajaxRequest("get", "http://localhost:3000/api/posts", null, displayPosts)
}

function displayPosts(data){
  // hideErrors();
  // hideUsers();
  return $.each(data.posts, function(index, post) {
      $(".posts").prepend('<div class="post">'+'<ul class="what">' +
        '<p>What: '+ post.what + '</p>'+
        '</ul>' +
        '<ul class="where">'+
        '<p>Where: '+ post.where + '</p>'+
        '</ul>' +
        '<ul class="when">'+
        '<p>When: '+ post.when + '</p>'+
        '</ul>'+'</div>'
      );
    });
}


function authenticationSuccessful(data) {
  if (data.token) setToken(data.token);
  return checkLoginState();
}

function getToken() {
  return localStorage.getItem('token');
}

function setRequestHeader(xhr, settings) {
  var token = getToken();
  if (token) return xhr.setRequestHeader('Authorization', 'Bearer ' + token);
}

function ajaxRequest(method, url, data, callback) {
  return $.ajax({
    method: method,
    url: url,
    data: data,
    beforeSend: setRequestHeader,
  }).done(function(data){
    if (callback) return callback(data)
  }).fail(function(data){
    // displayErrors(data.responseJSON.message)
  });
}