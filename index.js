const express = require("express");
const {connection}=require("./db");
const {userRouter}=require("./route/user.route");
const {noteRoute}=require("./route/note.route");
const { auth } = require("./middleware/note.middleware");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
app.use("/user",userRouter);
const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"backend docs swagger",
            version:"1.0.0"
        },
        servers:[
            {
                url:"https://localhost:3000"
            }
        ]
    },
    apis:["./route/*.js"]
}
const swaggerSpec = swaggerJSDoc(options)
app.use("/documentations",swaggerUi.serve,swaggerUi.setup(swaggerSpec))


app.use(auth);
app.use("/note",noteRoute);

app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to db");
    } catch (error) {
        console.log(error);
    }
    console.log("server is running");
})
