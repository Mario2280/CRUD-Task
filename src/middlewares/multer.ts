import multer from "multer";
import path from "path";
//import {existsSync} from "fs";


const extArr: string[] = ["image/png", "audio/mp4", "video/mp4"];
const maxSize: number = 1024 * 1024 * 40;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../DiskStorage/", req.query.path as string));
        //проверку закину в др место 
        // if(existsSync(path.join(__dirname, "../../DiskStorage/", req.query.path as string))){            
        // }         
    },
    filename: function (req, file, cb) {
        cb(null, `${file.filename}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

var upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if(extArr.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only png, mp4 audi and video"));
        }
    },
    limits: {fieldSize: maxSize}
}).fields([{name: "file", maxCount: 3}]);

export default upload;