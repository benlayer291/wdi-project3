var Post = require('../models/post');
var User = require('../models/user');

// Index-GET

function postsIndex(req, res){
  Post.find({}, function(err, posts){
    if (err) return res.status(404).json({ message: "Posts could not be found" });

    return res.status(200).json({ posts: posts });
  })
}

// Show-GET

function postsShow(req, res){
  var id = req.params.id;

  Post.findById({_id: id}, function(err, post){
    if (err) return res.status(500).json({ message: "Something went wrong" });
    if (!post) return res.status(404).json({ message: "Post could not be found" });

    return res.status(200).json({ post: post });
  });
  
}

// Create-POST

function postsCreate(req, res){
  User.findById({_id: currentUser._id}, function(err, user){

    var post = new Post(req.body);
    post.save(function(err, post){
      console.log(err)
      if (err) return res.status(500).json({ message: "Something went wrong"});
      
      user.local.posts.push(post);

      user.save(function(err, user) { 
        if (err) return res.status(500).json({ message: "Not saving"});
        return res.status(201).json({ message: 'Post succesfully created', post: post });  
      });
    });
  });
}

// Update-POST

function postsUpdate(req, res){
  var id = req.params.id;

  // Find the post by Id.
  Post.findById({_id: id}, function(err, post) {
    if (err) return res.status(500).json({ message: "Something went wrong" });
    if (!post) return res.status(404).json({ message: "Post could not be found" });

    if (req.body.where) post.where   = req.body.where;
    if (req.body.when) post.when     = req.body.when;
    if (req.body.what) post.what     = req.body.what;
    if (req.body.status) post.status = req.body.status;

    post.save(function(err) {
      if (err) return res.status(500).json({ message: "Something went wrong" });

      return res.status(201).json({ message: 'Post successfully updated.' , post: post });
    });
  });
}

// Delete-POST

function postsDelete(req,res){
  var id =  req.params.id;

  Post.remove({_id: id}, function(err) {
    if (err) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ message: 'Post succesfully deleted' });
  });  
}

// Search

function postsSearch(req, res) {
  Post.find({ $text : { $search : req.body.search } },
            { score : { $meta: "textScore" } }
  ).sort({ score : { $meta : 'textScore' } }).exec(function(err, posts) {
    console.log(err)
    if (err) return res.status(500).json({ message: "Something went wrong " });

    res.status(200).json({ posts: posts })
  })
}

module.exports = {
  postsIndex:  postsIndex,
  postsShow:   postsShow,
  postsCreate: postsCreate,
  postsUpdate: postsUpdate,
  postsDelete: postsDelete,
  postsSearch: postsSearch
}
