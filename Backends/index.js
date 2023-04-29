const express = require("express");
const cors=require("cors");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.route");

require('dotenv').config();
const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World, welcome Social Media App....!!!!!!");
});

app.use("/api", userRouter)

app.listen(process.env.port, async()=>{
    try{
        await connection;
        console.log("connected with Social Media App DB")
    }catch(error){
        console.log(error);
    }
    console.log(`Server is running on port ${process.env.port}`);
})