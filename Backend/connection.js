//Adding DataBase
//import mongoose Libraray
const mongoose = require("mongoose");
//Add a Connection
//give Url in that
async function connectMongoDB(url) {
    return mongoose
    .connect(url);
}

module.exports= {
    connectMongoDB,
}


