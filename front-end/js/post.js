$(init);

function init(){
  console.log("working");
  // $(".post_form").on("submit", submitPost);
  // $(".posts-link").on("click", posts);
  $("#posts").on("click",".show-post", showPost);

}

// function checkLoginState(){
//   if (getToken()) {
//     return loggedInState();
//   } else {
//     return loggedOutState();
//   }
// }

// function showPost() {
//   console.log("Click bruh")
//   return ajaxRequest("get", "http://localhost:3000/api/posts/"+$(this).attr('id'), null, displayPost)

// }

// function submitPost(){
//   event.preventDefault();

//   var method = $(this).attr("method");
//   var url    = "http://localhost:3000/api" + $(this).attr("action");
//   var data   = $(this).serialize();

//   return ajaxRequest(method, url, data, authenticationSuccessful);
// }

// function posts(){
//   event.preventDefault();
//   return getPosts();
// }

// function getPosts(){
//   return ajaxRequest("get", "http://localhost:3000/api/posts", null, displayPosts)
// }

// function displayPost(data) {
//   hideErrors();
//   hidePosts();
//   console.log(data);
//   $(".posts").prepend('<div class="post">'+
//     '<ul class="what">' +
//     '<p>What: '+ data.post.what + '</p>'+
//     '</ul>' +
//     '<ul class="where">'+
//     '<p>Where: '+ data.post.where + '</p>'+
//     '</ul>' +
//     '<ul class="when">'+
//     '<p>When: '+ data.post.when + '</p>'+
//     '</ul>'+
//     '<button type="button" id=' + data.post._id + ' class="show-post" value="Submit">Show Page</button>'+
//     '</div>'
//   );

// }

// function displayPosts(data){
//   hideErrors();
//   hidePosts();
//   return $.each(data.posts, function(index, post) {
//       $(".posts").prepend('<div class="post">'+
//         '<ul class="what">' +
//         '<p>What: '+ post.what + '</p>'+
//         '</ul>' +
//         '<ul class="where">'+
//         '<p>Where: '+ post.where + '</p>'+
//         '</ul>' +
//         '<ul class="when">'+
//         '<p>When: '+ post.when + '</p>'+
//         '</ul>'+
//         '<button type="button" id=' + post._id + ' class="show-post" value="Submit">Show Page</button>'+
//         '</div>'
//       );
//     });
// }

// function hidePosts(){
//   return $(".post").empty();
// }

// function hideErrors(){
//   return $(".alert").removeClass("show").addClass("hide");
// }

// function displayErrors(data){
//   return $(".alert").text(data).removeClass("hide").addClass("show");
// }

// function authenticationSuccessful(data) {
//   if (data.token) setToken(data.token);
//   // return checkLoginState();
// }

// function getToken() {
//   return localStorage.getItem('token');
// }

// function setRequestHeader(xhr, settings) {
//   var token = getToken();
//   if (token) return xhr.setRequestHeader('Authorization', 'Bearer ' + token);
// }

// function ajaxRequest(method, url, data, callback) {
//   return $.ajax({
//     method: method,
//     url: url,
//     data: data,
//     beforeSend: setRequestHeader,
//   }).done(function(data){
//     if (callback) return callback(data)
//   }).fail(function(data){
//     // displayErrors(data.responseJSON.message)
//   });
// }