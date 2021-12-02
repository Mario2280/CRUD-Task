
import { Router, Request, Response } from "express";
import fileController from "../controllers/fileController";
import folderController from "../controllers/folderController";
const router = Router();

//Endpoints
router.get('/folder/:name:path:count');//count пагинация param ctime noEmpty
router.post('/folder/:dest/:name');
router.put('/folder/:name/:newName'); // newDest
router.delete('/folder/:name');

router.get('/file/:name/:param');//param ctime data - получить содержимое 
router.post('/file/:dest');
router.put('/file/:name/:newName'); // new Data перезапись
router.delete('/file/:name');

export default router;