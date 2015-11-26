$(bindEvents);

function bindEvents() {
  var buttons = [
  ".btn-facebook"
  ];

  $.each(buttons, function(index, button){
    $(button).on('click', authenticate)
  });
}

function authenticate() {
  var authType = $(this).data('auth');

  switch (authType) {
    case 'facebook':
      return hello(authType).login();
      break;
    default:
      return hello(authType).login();
      break;
  }
}

hello.on('auth.login', function(auth){
  hello(auth.network).api('/me').then(function(data) {
    data.access_token = hello(auth.network).getAuthResponse().access_token;
    return $.ajax({
      method:'post',
      url: 'http://localhost:3000/api/facebook',
      data: data
    }).done(function(data){
      console.log(data);
      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user._id);
      return loggedInStatus();
    })
  })
})

hello.init({
  facebook: "1659814474278990"
}, {
  redirect_uri: window.location.href
})

