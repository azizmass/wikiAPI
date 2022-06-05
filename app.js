const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyPaser=require("body-parser");
const express=require("express");
const app =express();
app.use(bodyPaser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikDB");
const articleSchema={
    title:String,
    content:String
}
const Article=mongoose.model("Article",articleSchema);
app.route("/articles")
    .get(function(req,res){
        Article.find({},function(err,articlesFound){
            if(err) res.send(err);
            else res.send(articlesFound);
        })
    })
    
    .post(function(req,res){
        const articl=new Article({
            title:req.body.title,
            content:req.body.content
        });
        articl.save(function(err){
            if(!err) res.send("seccessfully added a new articale.");
            else res.send(err);
        });
    })
    
    .delete(function(req,res){
        Article.deleteMany({},function(err){
            if(!err) res.send("successfully deleted all articles");
            else res.send(err);
        })
    })


    app.route("/articles/:articlTitle")


    .get(function(req,res){
     Article.findOne({title:req.params.articlTitle},function(err,foundArtical){
         if(!err) res.send(foundArtical);
         else res.send("no articles matching that title");
     })
    })
    .put(function(req,res){
        Article.updateOne({title:req.params.articlTitle},
            {title:req.body.title,
            content:req.body.content},
            {overwrite:true},function(err){
                if(!err)res.send("yes");
                else res.send("no"); 
            })
    })
    .patch(function(req,res){
        Article.updateOne({title:req.params.articlTitle},
            {$set:req.body},function(err){
                if(!err) res.send("Successfully updated article.");
                else res.send(err);
            })
    })
    .delete(function(req,res){
        Article.deleteOne({title:req.params.articlTitle},function(err){
            if(!err) res.send("Successfully deleted article.");
                else res.send(err);
        })
    })



app.listen(3000,function(){
    console.log("server started on port 3000");
})