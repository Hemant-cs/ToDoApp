//importing files and library
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ToDoApp = require("./Model/toDOApp.js");

const app = express();
app.use(cors());
app.use(express.json());
//mongoDB Connection
mongoose.connect("mongodb://localhost:27017/ToDoApp");
//if mongoDB Connection got error
mongoose.connection.on("error",error=>{
    console.error("MongoDb Connection running into an issue : "+error);
    
})



//routes
app.get("/",async(req,res)=>{
    try {
        const allToDoList = await ToDoApp.find({});
        res.send(allToDoList);
        
    } catch (error) {
        console.log("Get Operation running into an issue : "+error);
        res.status(500);
        res.send({
            message : "Internal Server Error",
            detailError : error
        })
    }
});

app.post("/addTask",async(req,res)=>{
    try {
        const insertData = {
            task : req.body.task,
            status : req.body.status ? req.body.status : "Not Started",
            deadline : req.body.deadline
        }
        let addTask = new ToDoApp(insertData)
        addTask = await addTask.save();
        if(addTask.task && addTask.status){
            res.send({
                message : "Details added successfully!"
            });
        }else{
            res.status(400);
            res.send({ message : "Unknown Error Occurred"});
        }
    } catch (error) {
        console.log("Error Occured while add task : "+error);
        res.status(500);
        res.send({
            message : "Internal Server Error",
            detailError : error
        })
    }
});

app.put("/update/:id",async(req,res)=>{
    try {
        const updateBody = {
            task : req.body.task,
            status : req.body.status,
            deadline : req.body.deadline
        }
        const updateStatus = await ToDoApp.updateOne({_id : req.params.id},{$set:updateBody});
        if(updateStatus.acknowledged) {
            res.send({message : `${updateStatus.modifiedCount} Data Updated Successfully`});            
        }else{
            res.status(400);
            res.send({ message : "Unknown Error Occurred"});
        }
        
    } catch (error) {
        console.log("Error Occured while updating : "+error);
        res.status(500);
        res.send({
            message : "Internal Server Error",
            detailError : error
        })
    }
});

app.delete("/removeTask/:id",async(req,res)=>{
    try {
        const removeTask = await ToDoApp.deleteOne({_id : req.params.id});
        if(removeTask.acknowledged){
            res.send({message : `${removeTask.deletedCount} Data Deleted Successfully`}); 
        }else{
            res.status(400);
            res.send({ message : "Unknown Error Occurred while removing"});
        }
    } catch (error) {
        console.log("Error Occured while Deleting : "+error);
        res.status(500);
        res.send({
            message : "Internal Server Error",
            detailError : error
        });        
    }
})

app.listen("8000",()=>{
    console.log("Server is running on 8000");
})