import express from "express";
import { students ,teachers } from "./localDatas.js";


const studentRouter = express.Router();

 //API for create a students with CURD operation
//get all students 

studentRouter.get("/",(req,res) =>{
    const { teacherId } = req.query;

    if(teacherId){
        res.send({
            students:students.filter((stu)=>stu.teacherId === teacherId),

        });


    }
    res.send( {students} );

});

//create (post ) student
studentRouter.post ("/",(req,res) =>{
    const { body } =req;

    students.push({id:Date.now().toString(),teacherId:null, ...body});
   

    res.send({msg:"created student successfully"});
});

//Update students
studentRouter.put("/:studentId",(req,res) =>{
    const {studentId} =req.params;
    const {body} = req; 
    const index = students.findIndex((stu) => stu.id === studentId);
    students[index ]={...body, id:studentId};
    res.send({msg:"Update student successfully"});
 
});


//Delete students
studentRouter.delete("/:studentId",(req,res)=>{
    const { studentId } = req.params;

    if(students.filter((stu)=>stu.id === studentId).length>0){
     
        students = students.filter((stu) => stu.id !== studentId);
        res.send({msg:"Deleted student sucssfully"})
    }else{
        res.status(404).send({msg:"student not found"});
    }
    

});

//Assign a teacher to a student
studentRouter.patch("/assign-teacher/:studentId",(req,res) =>{
    const { body } =req;
     
    const { teacherId}= body;
    const { studentId } = req.params;

    const stuObj =students.find((student)=>student.id === studentId);
    const teacherObj =students.find((teacher)=>teacher.id === teacherId);

    //Assign a student to Mentor.
    if(stuObj && teacherObj){
    const index = students.findIndex((student)=>student.id === studentId);
    const teacherIndex = teachers.findIndex((teacher)=>teacher.id === teacherId);
   
   
    students[index].teacherId = teacherId;
    teachers[teacherIndex].studentId= [... teachers[teacherIndex].studentId,studentId]
     


    res.send({msg:"teacher Assign successfully"})

    }else{
        res.status(400).send({msg:"Please check the student & teacher ids"});
    }
});


export default studentRouter;