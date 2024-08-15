const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    task:{
        type : String,
        require : true
    },
    status : {
        type : String,
        require : true
    },
    deadline : {
        type : Date
    }
})

const todoList = mongoose.model("ToDoList", todoSchema);

module.exports = todoList;