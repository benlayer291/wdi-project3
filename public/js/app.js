$(init);

function init(){
  
  setupGoogleMaps();

  //homepage
  // Forms
  $('.login_form').on('submit', login);
  $('.register_form').on('submit', register);
  $('.post-form').on('submit', addNewPost);
  $('.search-form').on("submit", search)
  $('.request-form').on('submit', sendRequestForm);
  
  // Links
  $('.logout-link').on('click', logout);
  $('.profile-link').on('click', displayOneUser);
  $('.home-link').on('click', displayHome);

  $('.search-post-button').on('click', getPosts);
  $('#create-post-button').on("click", showCreatePosts);
  $("#posts").on("click",".show-post", getOnePost);
  $('#scroll_to_about').on("click", aboutScroll)
  
  $('#user-profile-button').on('click', displayOneUser);
  $('#user-posts-button').on('click', displayOneUserPosts);
  $('#user-requests-button').on('click', displayOneUserRequests);
  $('#posts').on('click', ".send-request", createRequestForm);


  // $('.large_button_email').on("click", chooseEmailLogin);
  // $('.search_title').hide();

  initialPageSetup();
}

function aboutScroll(){
  $(document.body).animate({'scrollTop' :$('#about').offset().top}, 900);
}

function displayHome(){
  event.preventDefault();
  $('section').hide();
  $("#about").show();
  $("#home").show();
  $(".navbar-default").css("background", "transparent");
  // $("body").css("background-image", 'url("http://bit.ly/1Igm8Ks")');
  $("body").css("background-image", 'url("../images/Home_photo_spoken.jpg")');
}

function whenYouPressLogIn(){
  $('#which_log_in').toggle();
  $('#search-post-button').toggle();
  $('#home-searchbox').toggle();
  $('#search_blurb').toggle();
};

var searchInfo;

function search(){
  event.preventDefault();
  // console.log(this);
  searchInfo   = $("#home-searchbox").val();
  var formData = $(this).serialize();

  $.ajax({
    method: "post",
    url: "http://localhost:3000/api"+$(this).attr("action"),
    data: formData
  }).done(function(data){
    hidePosts();
    var posts = data.posts;
    // console.log(data.posts);

    // RADIUS SEARCH

    // function setupGoogleMaps(){
    //   var fields = ["home-searchbox", "posts-searchbox"]

    //   $.each(fields, function(index, field){
    //     // Search box variable
    //     var searchBox = new google.maps.places.Autocomplete(document.getElementById(field));
    //     // // SearchBox event listener;
    //     google.maps.event.addListener(searchBox, 'place_changed', function() {
    //       var place = searchBox.getPlace();
    //       var placeLat = place.geometry.location.lat();
    //       var placeLng = place.geometry.location.lng();
    //       document.getElementById('cityLat').value = placeLat;
    //       document.getElementById('cityLng').value = placeLng;
    //       console.log(place)
    //     })

    //     //Clear the searchBox when we click on it; 
    //     $("#" + field).on('click', function(){
    //       $(this).val('');
    //     })
    //   })
    // }

    // var request = {
    // location: latLng,
    // radius: 20000,
    // types: [type] //e.g.school,restaurant,bank etc..
    // };

    // var service = new google.maps.places.PlacesService(map);
    // service.search(request, function(results, status) {
    // map.setZoom(14);
    // if (status == google.maps.places.PlacesServiceStatus.OK) {
    // for (var i = 0; i < results.length; i++) {
    // results[i].html_attributions='';
    // createMarker(results[i],icon);
    // }
    // }

    // ======================

    if (posts.length === 0) {
      showErrors("There are no posts found for this location.");
      
      if (localStorage.getItem("token")) {
        $("#addPostModal").modal('show');
        $("#posts-searchbox").val(searchInfo);
      } else {
        $("#loginModal").modal('show');
      }

      if (posts.length === 0 && !document.getElementById('cityLat').value) {
        showErrors("Please search again. That location was not found.")
      }

    } else {
      var title = $("#home-searchbox").val();
      var splitTitle = ((title).split(',')[0]);
      $('#nav-search-title').html('<h3>'+ splitTitle + '</h3>');

      for (var i=0; i<posts.length; i++) {
        $('.search-results').append(
          '<div class="each-result">'+
          '<div class="when col-sm-4">' +
          '<p>'+ '"'+ posts[i].what + '"'+ '</p>'+
          '</div>' +
          '<div class="col-sm-4">' +
          '<p class="when">'+ posts[i].when + '</p>'+
          '</div>' +
          '<div class="col-sm-4 request-container">' +
          '<a href="#" id=' + posts[i]._id + ' data-toggle="modal" data-target="#requestModal" class="send-request"><img src="../images/logo.png"></a>'
            +
            '</div>' +
            '</div>'
           );
        $('#post_id').val(posts[i]._id);
      }

      $('section').hide();
      $('.search_title').show();
      $('#posts').show();
      $(".navbar-default").css("background-color", "#111C24");
      $("body").css("background-image", "none");
      $("body").css("background-color", "#E8ECF0");
      
      $("#search_results").removeClass("hide")
      $("#search_results").show();
    }
  })
}

function register(){
  event.preventDefault();
  $('#registerModal').modal('hide');
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
  
  $('#loginModal').modal('hide');
  
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/login",
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data){
    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user._id);
    localStorage.setItem('user', data.user);

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
  
  displayHome();

  localStorage.clear();
  return loggedInStatus();
}

function showLogin() {
  event.preventDefault();
  hideErrors();
  whenYouPressLogIn();
  // return $('#login').show();
}

function chooseEmailLogin() {
  return $('#login').show();
}

function showRegister() {
  event.preventDefault();
  hideErrors();
  $('section').hide();
  return $('#register').show();
}

function initialPageSetup(){
  hideErrors();
  // $('section').hide();
  displayHome()
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
  // $('#home').show();
  $('#about').show();
  $('#search').show();
  // $('#homepage-title').show();
  $('#learn_more_section').show();
  displayHome();
}

function loggedOutState() {
  $('section').hide();
  $('.logged-out').show();
  $('.logged-in').hide();
  $('#about').show();
  // $('#search').show();
  // $('#homepage-title').show();
  $('#learn_more_section').show();
  displayHome();
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
  // $('section').hide();

  // $("#home").hide()
  // // $('#homepage-title').hide();
  // $('#scroll_to_about').hide();
  // $('#about').hide();
  // $('#search').hide();
  // $(".navbar-default").css("background-color", "#111C24");
  // $("body").css("background-image", "none");
  // $("body").css("background-color", "#E8ECF0");

  $('section').hide();
  $('.search_title').show();
  $('#posts').show();
  $(".navbar-default").css("background-color", "#111C24");
  $("body").css("background-image", "none");
  $("body").css("background-color", "#E8ECF0");
  
  $("#search_results").removeClass("hide")
  $("#search_results").show();


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
    $('.search-results').append(
      '<div class="each-result">'+
      '<div class="col-sm-4">' +
      '<p>'+ '"'+ posts[i].what + '"'+ '</p>'+
      '</div>' +
      '<div class="col-sm-4">' +
      '<p class="when">'+ posts[i].when + '</p>'+
      '</div>' +
      '<div class="col-sm-4 request-container">' +
      '<a href="#" id=' + posts[i]._id + ' data-toggle="modal" data-target="#requestModal" class="send-request"><img src="../images/logo.png"></a>'
        +
        '</div>' +
        '</div>'
       );
  }
};


function showCreatePosts() {
  event.preventDefault();
  hideErrors();
  // console.log(searchInfo);
  // $('section').hide();
  // $('#create-post').show();
  if (localStorage.getItem("token")) {
    $("#addPostModal").modal('show');
    $("#posts-searchbox").val(searchInfo);
    $("#poster-user_id").val(localStorage.getItem('user_id'))
  } else {
    $("#loginModal").modal('show');
  }
}

function addNewPost(){
  event.preventDefault();
  // console.log('creating new post');
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/api/posts',
    data: $(this).serialize(),
    beforeSend: setHeader
  }).done(function(data) {
    $("#addPostModal").modal("hide");
    getPosts();
  }).fail(function(data){
    return showErrors(data.responseJSON.message);
  }).always(function(data){
    // console.log(data);
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
)}

function hidePosts(){
  return $('.posts, .search-results').empty();
}

// for (var i=0; i<posts.length; i++) {
//   $('.search-results').append(
//     '<div class="user-profile-posts">'+
//     '<div class="col-sm-4">' +
//     '<p>'+ '"'+ posts[i].what + '"'+ '</p>'+
//     '</div>' +
//     '<div class="col-sm-4">' +
//     '<p class="when">'+ posts[i].when + '</p>'+
//     '</div>' +
//     '<div class="col-sm-4 request-container">' +
//     '<a href="#" id=' + posts[i]._id + ' data-toggle="modal" data-target="#requestModal" class="send-request"><img src="../images/logo.png"></a>'
//       +
//       '</div>' +
//       '</div>'
//      );
// }


// Autocomplete
function setupGoogleMaps(){
  var fields = ["home-searchbox", "posts-searchbox"]

  $.each(fields, function(index, field){
    // Search box variable
    var searchBox = new google.maps.places.Autocomplete(document.getElementById(field));
    // // SearchBox event listener;
    google.maps.event.addListener(searchBox, 'place_changed', function() {
      var place = searchBox.getPlace();
      var placeLat = place.geometry.location.lat();
      var placeLng = place.geometry.location.lng();
      document.getElementById('cityLat').value = placeLat;
      document.getElementById('cityLng').value = placeLng;
    })

    //Clear the searchBox when we click on it; 
    $("#" + field).on('click', function(){
      $(this).val('');
    })
  })
}

// Users js

function getUserInfo() {
  event.preventDefault();

  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/users/'+localStorage.getItem('user_id'),
    beforeSend: setHeader
  }).done(function(data){
    fillInfoOneUser(data);
    // console.log('!!!!!!!',data);
  })
}

function fillInfoOneUser(data) {
  var user     = data.user.local
  var posts    = data.user.local.posts

  $('#profile-image').attr('src', user.picture);
  $('#profile-name').html(user.firstName + " " + user.lastName);
  $('#profile-tagline').html(user.tagline);

  for (var i=0; i<posts.length; i++) {

    $('#user-profile-posts').append(
      '<div class="when col-sm-4">' +
      '<p>'+ '"'+ posts[i].what + '"'+ '</p>'+
      '</div>' +
      '<div class="col-sm-4">' +
      '<p class="when">'+ posts[i].when + '</p>'+
      '</div>' +
      '<div class="when col-sm-4">' +
      '<p>' + (posts[i].where.split(',')[0]) + '</p>'+
      '</div>'
       );

  }


  for (var i=0; i<posts.length; i++) {
    for(var j=0; j<posts[i].requests.length; j++){
      // console.log(posts[i].requests[j]);
      $('#user-profile-requests').append(
        '<div class="row">'+
        '<div class="col-sm-4">' +
        '<p>'+ '"'+ posts[i].what + '"'+ '</p>' +
        '</div>'+
        '<div class="col-sm-8">'+
        '<div class="row">'+
        '<div class="col-sm-12">'+
        '<h3 id="requests-name">'+ posts[i].requests[j].requester_firstName+ '</h3>' +
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-sm-12">'+
        '<p id="requests-email">' + posts[i].requests[j].requester_email +'</p>'+
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

  $('section').hide();

  // Section
  $("#profile").show(); 

  // Sub-sections
  $("#profile-box").show();
  $("#profile-requests").hide();
  $("#profile-posts").hide();

  $('#scroll_to_about').hide();
  $('#about').hide();

  $('#my-profile-header').show();
  $(".navbar-default").css("background-color", "#111C24");
  $("body").css("background-image", "none");
  $("body").css("background-color", "#E8ECF0");
  
  // $('.where').show();

  $('#user-profile-button').css("background-color", "white");
  $('#user-profile-button').css("color", "black");
  $('#user-posts-button').css("background-color", "#E4007C");
  $('#user-posts-button').css("color", "white");
  $('#user-requests-button').css("background-color", "#E4007C");
  $('#user-requests-button').css("color", "white");
  // $('#tagline-box').show();
  $('.col-md-offset-3').hide();
}

function displayOneUserPosts() {
  event.preventDefault();
  // $('section').hide();
  $('#profile-posts').fadeIn(1200);
  $('#user-profile-posts').show();
  // $('#my-profile-header').show();

  $("#profile-box").hide();
  $("#profile-requests").hide();
  // $("#profile-posts").show();

  $('#user-posts-button').css("background-color", "white");
  $('#user-posts-button').css("color", "black");
  $('#user-profile-button').css("background-color", "#E4007C");
  $('#user-profile-button').css("color", "white");
  $('#user-requests-button').css("background-color", "#E4007C");
  $('#user-requests-button').css("color", "white");
  // $('#profile-tools').show();
}

function displayOneUserRequests() {
  event.preventDefault();

  $("#profile-box").hide();
  $('#user-profile-posts').hide();
  $("#profile-requests").show();
  $("#profile-posts").hide();

  $('#profile-requests').fadeIn(1200);
  $('#user-requests-button').css("background-color", "white");
  $('#user-requests-button').css("color", "black");
  $('#user-profile-button').css("background-color", "#E4007C");
  $('#user-profile-button').css("color", "white");
  $('#user-posts-button').css("background-color", "#E4007C");
  $('#user-posts-button').css("color", "white");
  $('#profile-tools').show().css("display", "block");
}

function createRequestForm(){
  // console.log($(this).attr('id'));
  postId = $(this).attr('id');
  event.preventDefault();
  hideErrors();
  // $('section').hide();
  // $('#create-request').show();
  fillRequestForm(postId);
}

function fillRequestForm(postId){
  $('#post_id').val(postId);
 $.ajax({
   method: 'GET',
   url: 'http://localhost:3000/api/users/'+localStorage.getItem('user_id'),
   beforeSend: setHeader
 }).done(function(data){
  // console.log(data);
  // console.log(this);
  $('#requester_id').val(data.user._id);
  $('#requester_firstName').val(data.user.local.firstName);
  $('#requester_lastName').val(data.user.local.lastName);
  $('#requester_email').val(data.user.local.email);
  $('#requester_picture').val(data.user.local.picture);
 })
}


function sendRequestForm(){
  event.preventDefault();
  $("#requestModal").modal('hide');
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/api/requests',
    beforeSend: setHeader,
    data: $(this).serialize(),
    }).done(function(data) {
      displayOneUserRequests();
    }).fail(function(data){
      return showErrors(data.responseJSON.message);
    });
}

// function displayRequest(data){
//   $('#user-profile-requests').prepend(        
//     '<div class="row">'+
//         '<div class="col-sm-4">' +
//           '<img id="requests-image" src='+ data.requester_picture + '>' +
//         '</div>'+
//         '<div class="col-sm-8">'+
//           '<div class="row">'+
//             '<div class="col-sm-12">'+
//               '<h3 id="requests-name">'+ data.requester_firstName+ '</h3>' +
//             '</div>'+
//           '</div>'+
//           '<div class="row">'+
//             '<div class="col-sm-12">'+
//               '<p id="requests-email">' + data.requester_email +'</p>'+
//             '</div>'+
//           '</div>'+
//           '<div class="row">'+
//             '<div class="col-sm-12">'+
//               '<p id="requests-message">' + data.requester_message + '</p>'+
//             '</div>'+
//           '</div>'+
//         '</div>'+
//         '</div>'
//   )
// }

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

