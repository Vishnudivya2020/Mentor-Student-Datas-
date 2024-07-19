import express from "express";
import { teachers , students } from "./localDatas.js";
const teacherRouter = express.Router();


//API for create a mentor with CURD operation
//Get all the teachers
teacherRouter.get("/",(req,res)=>{

    const { studentId } =req.query;
    if(studentId){
        const teacherData = teachers.filter(t =>t.students.includes(studentId));
         res.send({teacherData});
    }else{
    res.send({teachers})
    }
});

teacherRouter.get("/get-students/:teacherId",(req,res)=>{
    const { teacherId } = req.params;

    const studentData = students.filter((stu) =>stu.teacherId  === teacherId);
    if(teacherId){
        res.send({students:studentData})
    }else {
        res.send(teachers);
    } 
    
     
});


//Create a teacher
teacherRouter.post("/",(req,res)=>{
    const { body } =req;

    teachers.push({id:Date.now().toString(), ...body});
   

    res.send({msg:"created teacher successfully"});
});

//update teacher
teacherRouter.put("/:teacherId",(req,res)=>{
   const { teacherId } = req.params;
   const {body} = req;

   const index = teachers.findIndex((teacher)=>teacher.id === teacherId);
   teachers[index]={
    ...body,
    id:teacherId,
   };


    res.send({msg:"Teacher Updated successfully"});

}); 

//Delete a teacher
teacherRouter.delete("/:teacherId",(req,res)=>{
    let {teacherId} = req.params;

    if(teachers.filter((tchr)=>tchr.id === teacherId).length>0){
     
        teachers = teachers.filter((tchr) => tchr.id !== teacherId);
        res.send({msg:"Deleted teacher sucssfully"})
    }else{
        res.status(404).send({msg:"teacherData not found"});
    }
    

});





export default teacherRouter;
