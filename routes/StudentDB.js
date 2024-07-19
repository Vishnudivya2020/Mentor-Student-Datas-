import express from "express";
import connectToDB,{db} from "../DataBase/Mongo-connection.js"; 
 import { students  } from "./localDatas.js";
import mongoose from "mongoose";
import studentModel from "../Model/Studentmodel.js";
import teacherModel from "../Model/Teachermodel.js";
const  studentDB = express.Router();
  
const router=express.Router();
//GET all student and the query params use to find the student for the particular teacher,
studentDB.get('/', async(req,res) =>{
   const {teacherId} = req.query;
  const collection =db.collection("students");
  console.log(teacherId);
  
 if(teacherId){
  const students =await collection.find({teacherId:teacherId}).toArray();
  console.log(students);
  res.send({students});

  
 }else{ 
  const data=await collection.find({}).toArray();
   res.send(data);
  
 }
 
});


 //student who  not have a teacher
studentDB.get("/student-without-teacher",async(req,res)=>{
  try{
    await connectToDB();
    //student who do not have a mentor
    const student =await db.collection("students").find({teacherId:null}).toArray();
    console.log(student);
    res.send(student);
  }catch(err){
    console.log('Error fetching students without teacher:',err);
    res.send(500).send({msg:"Internal server error"})
  }
});

//Show the previously assigned mentor for a particular student.
studentDB.get('/:studentId/pteacher',async(req,res) =>{
 try{
     const {studentId}=req.params;
    
     console.log(studentId);
    const student = await students.findById(studentId).populate("pteacher").exec();
    console.log(student)
    if(!student||!student.pteacher){
     return res.status(404).json({error:"no previous mentor available"})
    }else{
     res.json(student.pteacher);
    };
  }catch(error){
    console.log(error);
    res.status(500).json({message:'server error',error});
  }

});


//Inserting a new student 
studentDB.post('/', async(req,res)=>{
    const {body} =req;
    const collection = db.collection("students");

    await collection.insertOne({
        ...body,
        id:Date.now().toString(),
        teacherId:null,
    });
    res.send({msg:"Insert student successfully"})
});

//update student
studentDB.put("/:studentId", async(req,res)=>{
    const {studentId} =req.params;
    const { body } = req;

  if(Object.keys(body).length>0){
    await db.collection("students")
    .updateOne({id:studentId},{$set:{...body,id:studentId}});
    res.send({msg:"update student successfully"})
  }else{
    res.send({msg:"Please Enter the student data"})
  }
});

//Assign or change Mentor for particular student
studentDB.put("/:studentId/change-teacher/:teacherId", async (req, res) => {
  const {studentId} =req.params;
  const {teacherId} =req.params;
  console.log(studentId,teacherId);
 try{
  if(!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(teacherId)){
    return res.status(400).json({error:"Invalid studentId or teacherId"})
  }
  const student = await studentModel.findById(studentId);
    const nteacher = await teacherModel.findById(teacherId);
    console.log('Student:', studentModel);
    console.log('New Teacher:', teacherModel);

   if(!student){
    return res.status(400).json({error:"Student not found"});
   }
   if(!nteacher){
    return res.status(404).json({error:'Teacher not found'})
   } 
   if(student.cteacher){
    student.pteacher.push(student.cteacher);
   }
   student.cteacher=nteacher._id;
   await student.save();

   res.status(200).json(student);
 }catch(error){
  console.error('Error during teacher assignment:',error);
  res.status(500).json({error:'server error'})
 }
 
});


//Delete the student
studentDB.delete("/:studentId", async(req,res)=>{
    const {studentId} =req.params;
    
    const stuObj = await db.collection("students").findOne({id:studentId});
   if(stuObj){
    await db.collection("students").deleteOne({id:studentId});
    res.send({msg:"Deleted student successfully"});
  }else{
    res.status(404).send({msg:"student not found"});
  }
});






//Assign a student to teacher
studentDB.patch("/assign-teacher/:studentId", async (req, res) => {
    const { body } = req;
  
    const { teacherId } = body;
    const { studentId } = req.params;
    console.log(`Assigning Teacher ID:${teacherId} to student ID:${studentId}`);
  try{
    const stuObj = await db.collection("students").findOne({ id: studentId });
    const teachObj = await db.collection("teacher").findOne({ id: teacherId });
   console.log(teachObj);
   console.log(stuObj);
    if (stuObj && teachObj) {
      // Update the teacher in student collection
      await db.collection("students").updateOne(
        { id: studentId },
        { $set: { teacherId } });

      //Ensure teachObj.students is an array
      const students = Array.isArray(teachObj.students)? teachObj.students : [];

   
      //  add student to teacher collection
      await db
        .collection("teacher")
        .updateOne({ id: teacherId },
          { $set: { students: [...students, studentId] } }
        );
      res.send({ msg: "Teacher Assigned Successfully" });
    } else {
      res.status(400).send({ msg: "Please check Student & Teacher Details" });
    }
  }catch(err){
    console.log('Error processing request:',err);
    res.status(500).send({msg:"Internal server error"})
  }
  });

 

  
export default studentDB;