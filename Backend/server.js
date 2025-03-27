const express = require("express");
const http = require("http");
const path = require("path");
require("dotenv").config();
const {connectMongoDB} = require('./connection.js');
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { initializeSocket } = require("./services/initializeSocket.js");

// More robust CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'], // Match the origins in socket.io
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Initialize socket.io
const io = initializeSocket(server);

//connect MongoDB
connectMongoDB(process.env.MONGO_URL).then((result) => {
    console.log("DataBase Connected SuccessFully!");
})
.catch((err) => {
    console.log("Database Can't Connect Error:", err);
});




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));



//Cokies handling
const cookieParser = require("cookie-parser");
app.use(cookieParser());



//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files (CSS and JS)  
// this means every request on this server : http://localhost:5000/public/upload is changes into http://localhost:5000/uploadand
// and  all request on this path is treated staticlly
app.use(express.static(path.join(__dirname ,'./public')));  
// Serve static files for uploaded images

//check that user has cookie stored or not 
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication.js");

app.use(checkForAuthenticationCookie("token"));

//Adding routers

const userRouter = require("./routes/userRouter.js");
app.use("/user" , userRouter);

// Add Room Router
const roomRouter = require("./routes/roomRouter.js");
app.use("/room", roomRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`);
});
