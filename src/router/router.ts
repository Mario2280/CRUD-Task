
import { Router } from "express";




const router = Router();

//Endpoints

//File
//:dest = path + fileName
router.post('/file/create/:dest');
router.get('file/download/:dest');
router.get('/file/getView/:dest');
router.put('/file/update/changeProp/:dest');
router.put('/file/update/rewrite/:dest');
router.delete('/file/:dest');

//:dest = path + folderName
router.post('/folder/create/:dest');
//count пагинация param ctime noEmpty
//extended = array<idForFullInfo>
router.get('/folder/getView/:dest:extended:offset:count');
router.get('/folder/download/:dest');
router.put('/folder/update/:dest:newName'); 
router.delete('/folder/:dest');




export default router;


