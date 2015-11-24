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
    data: $(this).serialize()
  }).done(function(data){
    console.log(data)
  });
}