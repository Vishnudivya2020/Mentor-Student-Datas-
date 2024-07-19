import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
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
        default: 'Unknown Course',
    },
    batch:{
        type:"string",
        required:true,
    },
    cteacher:{
        type : mongoose.Schema.Types.ObjectId,
        default : undefined,
        ref : 'teacher'
     },
     pteacher: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Teacher', 
        default: [] 
    },
});

const studentModel = new mongoose.model("students" , studentSchema,"students")
 
export default studentModel;