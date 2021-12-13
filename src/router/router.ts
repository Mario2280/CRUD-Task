import FileController from "../controllers/fileController";
import FolderController from "../controllers/folderController";
import { Router } from "express";
import upload from "../middlewares/multer";

import  {checkErr, sanitazeName, checkDest, checknewName} from "../middlewares/pathValidator";
const router = Router();


router.post('/file/create', checkDest, sanitazeName, checkErr , upload, FileController.create);
router.get('/file/download', checkDest, checkErr, FileController.read);
router.get('/file/getView', checkDest, checkErr, FileController.getView);
router.put('/file/update/changeProp', checkDest, checkErr, FileController.update);
router.put('/file/update/rewrite', checkDest, checkErr, upload, FileController.rewrite);
router.delete('/file', checkDest, checkErr, FileController.delete);

router.post('/folder/create', checkDest, checkErr, FolderController.create);
router.get('/folder/getView', checkDest, checkErr, FolderController.getView);
router.get('/folder/download', checkDest, checkErr, FolderController.read);
router.put('/folder/update', checkDest, checknewName, checkErr, FolderController.update);
router.delete('/folder', checkDest, checkErr, FolderController.delete);




export default router;


