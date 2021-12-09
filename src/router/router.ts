import FileController from "../controllers/fileController"
import FolderController from "../controllers/folderController"
import { Router } from "express";
import upload from "../middlewares/multer"

// import path from "path";
// import multer from "multer";
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {    
//         cb(null, path.join(__dirname,'../../DiskStorage/', req.query.dest?.toString().trim() as string));         
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
// const mineArr: string[] = ["image/png", "audio/mp4", "video/mp4"];
// const maxSize: number = 1024 * 1024 * 40;
// var upload = multer({
//     storage: storage,
//     fileFilter(req, file, cb) {
//         //fileName.add(file.originalname);
//         if(!mineArr.includes(file.mimetype)){
//             cb(new Error("Only png, mp4 audi and video"));           
//         } else{
//             cb(null, true);
//         }
//     },
//     limits: {fieldSize: maxSize}
// }).fields([{name: 'file', maxCount: 3}]);

const router = Router();

//Endpoints

//File
//:dest = path(Cannot upload files with the same names)
//query names a,c,v,b without ext
router.post('/file/create', upload, FileController.create);
//:dest = path + fileName
router.get('/file/download/:dest', FileController.read);
//:dest = path + fileName + ext
router.get('/file/getView/:dest', FileController.getView);
//Prop in json & dest in query
router.put('/file/update/changeProp', FileController.changeProp);
router.put('/file/update/rewrite/:dest', FileController.rewrite);
router.delete('file/:dest', FileController.delete);

//:dest = path + folderName
router.post('/folder/create/:dest', FolderController.create);
//count пагинация param ctime noEmpty
//extended = array<idForFullInfo>
router.get('/folder/getView/:dest:extended:offset:count', FolderController.getView);
router.get('/folder/download/:dest', FolderController.read);
router.put('/folder/update/:dest:newName', FolderController.changeProp);
router.delete('/folder/:dest', FolderController.delete);




export default router;


