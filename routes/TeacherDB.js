import express from "express";
import { db } from "../DataBase/Mongo-connection.js";
import { MongoClient } from "mongodb";
import teacherModel from "../Model/Teachermodel.js";
import studentModel from "../Model/Studentmodel.js";
import { teachers } from "./localDatas.js";
const  TeacherDB = express.Router();
 


TeacherDB.get('/', async(req,res) =>{
  try{
    const collection =db.collection("teacher");
  
    const data=await collection.find({}).toArray();
    res.send(data);
  }catch(err){
    console.log("Error:",err);
    res.status(500).send({msg:"Something went wrong"});
  }
    
  });
//get all student for particular teacherId

  
  //Show all student for a specific teacher
  // TeacherDB.get("/Show-student/:teacherId",async(req,res) =>{
  //   const {teacherId} = req.params;
  //   const studentData = studentshema.filter((stu) =>stu.teacherId === teacherId);
  //    console.log(studentData);
  //   if(teacherId){
  //     res.send(studentshema = studentData);
  //   }else{
  //     res.send(teacherModel)

  //   }
  // });
 
  //Add a new teacher
  TeacherDB.post('/', async(req,res)=>{
    const {body} =req;
    const collection = db.collection("teacher");

    await collection.insertOne({
        ...body,
        id:Date.now().toString(),
        students:[],
    });
    res.send({msg:"Add a teacher successfully"})
});

//update teacher
TeacherDB.put("/:teacherId", async(req,res)=>{
    const {teacherId} =req.params;
    const { body } = req;

  if(Object.keys(body).length>0){
    await db.collection("teacher")
    .updateOne({id:teacherId},{$set:{...body,id:teacherId}});
    res.send({msg:"update teacher successfully"})
  }else{
    res.send({msg:"Please Enter the teacher data"})
  }
});

TeacherDB.delete("/:teacherId", async(req,res)=>{
    const {teacherId} =req.params;
    
    const TeachObj = await db.collection("teacher").findOne({id:teacherId});
   if(TeachObj){
    await db.collection("teacher").deleteOne({id:teacherId});
    res.send({msg:"Deleted teacher successfully"});
  }else{
    res.status(404).send({msg:"teacher not found"});
  }
});




  export default TeacherDB;
  