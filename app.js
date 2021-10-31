const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const _ = require('lodash');

app.use(express.urlencoded({ extended: true }));
app.set("view engin", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("article", articleSchema);

app.route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundarticles) {
      if (!err) {
        res.send(foundarticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const newpost = new Article({
      title: title,
      content: content,
    });
    newpost.save(function (err) {
      if (!err) {
        res.send("Article successfully added.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });


// Request targeting a specific article

app.route("/articles/:articleTitle")
  .get(function(req, res){
    const requestedtitle =req.params.articleTitle;
    Article.findOne({title:requestedtitle}, function(err,foundarticle){
        if(foundarticle){
            res.send(foundarticle)
        }else{
            res.send("No articles was found.")
        }
    })
  } )
  .put(function(req,res){
    Article.replaceOne(
        {title:req.params.articleTitle},
        {title: req.body.title, content: req.body.content}, 
        function(err){
        if (!err){
            res.send("No errors")
        }else{
            res.send(err)
        }
    });
  })
  .patch(function (req,res){
      Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("No errors")
            }else{
                res.send(err)
            }
        }
      )
  })
  .delete(function (req,res){
      Article.deleteOne(
          {title:req.params.articleTitle},
          function(err){
              if(!err){
                  res.send("Successfully deleted.")
              }else{
                  res.send(err)
              }
          });
  });






app.listen(3000, function () {
  console.log("At your service😊");
});
