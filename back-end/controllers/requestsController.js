var Post = require('../models/post');
var Request = require('../models/request');

//Index
function requestsIndex(req, res){
  Request.find({}, function(err, requests){
    if (err) return res.status(404).json({ message: "Requests could not be found" });

    return res.status(200).json( {requests: requests} );
  })
}

//Show
function requestsShow(req, res){
  var id = req.params.id;

  Request.findById({_id: id}, function(err, request){
    if (err) return res.status(500).json({ message: "Something went wrong" });
    if (!request) return res.status(404).json({ message: "Request could not be found" });

    return res.status(200).json({ request: request });
  })
  
}

//Create
function requestsCreate(req, res){
  var postId  = req.body.post;
  console.log(postId);
  Post.findOne({_id: postId}, function(err, post){
    console.log(1);
    var request = new Request({
      requester_id: currentUser._id,
      requester_firstName: currentUser.firstName,
      requester_lastName: currentUser.lastName,
      requester_email: currentUser.email,
      requester_picture: currentUser.picture,
      message: req.body.message
    });
    console.log(request);
    request.save(function(err, request){
      if (err) return res.status(500).json({ message: "Something went wrong" });
      post.requests.push(request);

      post.save(function(err, post){
        if (err) return res.status(500).json({ message: "Something went wrong" });
        return res.status(201).json({ message: 'Request succesfully created', request: request }); 
      });
      console.log(post);
    });
  });  
}
  

//Update
function requestsUpdate(req, res){
  var id = req.params.id

  Request.findById({_id: id}, function(err, request){
    if (err) return res.status(500).json({ message: "Something went wrong" });
    if (!request) return res.status(404).json({ message: "Request could not be found" } )

    if (req.body.receiver_id) request.receiver_id   = req.body.receiver_id;
    if (req.body.requester_id) request.requester_id = req.body.requester_id;
    if (req.body.status) request.status             = req.body.status;

    request.save(function(err) {
      if (err) return res.status(500).json({ message: "Something went wrong" });

      return res.status(201).json({ message: 'Request successfully updated.' , request: request });
    })
  })
}

//Delete
function requestsDelete(req, res){
  var id =  req.params.id;

  Request.remove({_id: id}, function(err) {
    if (err) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ message: 'Request succesfully deleted' });
  });  
}   

module.exports = {
  requestsIndex: requestsIndex,
  requestsShow: requestsShow,
  requestsCreate: requestsCreate,
  requestsUpdate: requestsUpdate,
  requestsDelete: requestsDelete
}