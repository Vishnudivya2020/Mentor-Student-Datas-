import express from "express";
import teacherRouter from "./routes/Teachers.js";
import studentRouter from "./routes/Student.js";
import connectToDB  from "./DataBase/Mongo-connection.js";
import studentDB from "./routes/StudentDB.js";
import TeacherDB from "./routes/TeacherDB.js";
import mongooseConnect from "./DataBase/mongoose-connection.js";
const server = express();

await connectToDB();
await mongooseConnect();

server .use(express.json());
 

 

// Adding the Router for teachers Endpoints/APIs,
server.use('/teachers',TeacherDB);
server.use('/students',studentDB);


server.get('/',(req,res)=>{
    res.send('Mentor and Student Assigning with Database')
});

const port =3000;

server.listen(port, () =>{
    console.log(Date().toString(), "server listening on port"+port);

});
