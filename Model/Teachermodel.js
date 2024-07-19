import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({
    id:{
        type:"string",
        required:true,
    },
    name:{
        type:"string",
        required:true,
    },
    course:{
        type:"string",
        required:true,
    },
    batch:{
        type:"string",
        required:true,
    },
    students:{
        type:mongoose.Types.ObjectId,
        required:true,
        default:[],
    },
});

const teacherModel = new mongoose.model("teacher" , teacherSchema,"teacher")
 
export default teacherModel;