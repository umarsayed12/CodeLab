const multer = require("multer");
const path = require("path");


// Set up multer storage to specify where to store the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("reached in File Section of Multer file contains: ", "\n",file);
    //cb is an call back jiska first value mostly null rhna 
    // hai yh basically error rkhe ke liye hai yaha 
    const dirpath= path.join(__dirname , "../public/uploads/userProfiles");
    return cb(null, dirpath);
    
     // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    console.log("the multer file is:" , "\n",file);
    const fileUniqueName = file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(null,fileUniqueName); // Example: profileImage_12345678.png
    // Adding timestamp to file name jisse yh koi samename 
    // ki file upload kare to exsting file overwrite na ho 
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports={upload};



