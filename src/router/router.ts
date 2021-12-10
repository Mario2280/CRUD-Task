import FileController from "../controllers/fileController";
import FolderController from "../controllers/folderController";
import { Router } from "express";
import upload from "../middlewares/multer";

const router = Router();

//Endpoints

//File
//:dest = path(Cannot upload files with the same names)
//query names a,c,v,b without ext
router.post('/file/create', upload, FileController.create);
//:dest = path + fileName
router.get('/file/download', FileController.read);
//:dest = path + fileName + ext
router.get('/file/getView', FileController.getView);
//Prop in json & dest in query
router.put('/file/update/changeProp', FileController.update);
//:dest = path(Cannot upload files with the same names)
//query names a,c,v,b without ext
router.put('/file/update/rewrite',upload, FileController.rewrite);
router.delete('/file', FileController.delete);

//:dest = path + folderName
router.post('/folder/create', FolderController.create);
//count пагинация param ctime noEmpty
//extended = array<idForFullInfo>
//:dest:extended:offset:count:sort(name of field)
router.get('/folder/getView', FolderController.getView);
///:dest
router.get('/folder/download', FolderController.read);
//:dest:newName
router.put('/folder/update', FolderController.update);
//:dest
router.delete('/folder', FolderController.delete);




export default router;


