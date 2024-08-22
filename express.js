import express from "express";
import teacherRouter from "./routes/Teachers.js";
import studentRouter from "./routes/Student.js";



const server = express();

await mongooseConnect();

server .use(express.json());
 

 

// Adding the Router for teachers Endpoints/APIs,
server.use('/teachers',teacherRouter);
server.use('/students',studentRouter);


server.get('/',(req,res)=>{
    res.send('Mentor and Student Assigning with Database')
});

const port =3000;

server.listen(port, () =>{
    console.log(Date().toString(), "server listening on port"+port);

});
