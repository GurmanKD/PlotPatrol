const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const AdminSchema=new Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
})

module.exports=mongoose.model("admins",AdminSchema);
