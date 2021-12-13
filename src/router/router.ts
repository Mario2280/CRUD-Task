import FileController from "../controllers/fileController";
import FolderController from "../controllers/folderController";
import { Router } from "express";
import upload from "../middlewares/multer";

import  {checkErr, sanitazeName, checkDest} from "../middlewares/pathValidator";
const router = Router();

//Endpoints

//File
//:dest = path(Cannot upload files with the same names)
//query names a,c,v,b without ext
//validators
//path to upload exists?
router.post('/file/create', checkDest, sanitazeName, checkErr , upload, FileController.create);
//:dest = path + fileName
router.get('/file/download', checkDest, checkErr, FileController.read);
//:dest = path + fileName + ext
router.get('/file/getView', checkDest, checkErr, FileController.getView);
//Prop in json & dest in query
router.put('/file/update/changeProp', checkDest, checkErr, FileController.update);
//:dest = path(Cannot upload files with the same names)
//query names a,c,v,b without ext
router.put('/file/update/rewrite', checkDest, checkErr, upload, FileController.rewrite);
router.delete('/file', checkDest, checkErr, FileController.delete);

//:dest = path + folderName
router.post('/folder/create', checkDest, checkErr, FolderController.create);
//count пагинация param ctime noEmpty
//extended = array<idForFullInfo>
//:dest:extended:offset:count:sort(name of field)
router.get('/folder/getView', checkDest, checkErr, FolderController.getView);
///:dest
router.get('/folder/download', checkDest, checkErr, FolderController.read);
//:dest:newName
router.put('/folder/update', checkDest, checkErr, FolderController.update);
//:dest
router.delete('/folder', checkDest, checkErr, FolderController.delete);




export default router;


