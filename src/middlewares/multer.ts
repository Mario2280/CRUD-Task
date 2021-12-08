import multer from "multer";
import { join, extname } from "path";
import { Request, Response, NextFunction } from "express";

const mineArr: string[] = ["image/png", "audio/mp4", "video/mp4"];
const STORAGE = '../../DiskStorage/';
const maxSize: number = 1024 * 1024 * 40;
let nameArr: Array<string>,
    copyNameArrForDB: Array<string> = [];
const storage = multer.diskStorage({
    destination: function (req, _, cb) {
        const newPath = join(__dirname, STORAGE, req.query.dest?.toString().trim() as string);
        cb(null, newPath);
    },
    filename: function (req, file, cb) {
        const Fullname =  `${<string>nameArr.pop() ?? Date.now()}${extname(file.originalname)}`;
        copyNameArrForDB.push(Fullname);
        cb(null, Fullname);
    }
});

const myMulter = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!mineArr.includes(file.mimetype)) {
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
    limits: { fieldSize: maxSize }
}).fields([{ name: 'file', maxCount: 3 }]);


function ReadNewFileNames(req: Request) {
    nameArr = (<string>req.query.names).split(',');
    nameArr = nameArr.reverse();
}

const Upload = function (req: Request, res: Response, next: NextFunction) {
    copyNameArrForDB = [];
    ReadNewFileNames(req);
    myMulter(req, res, (err) => {
        if (err || nameArr.length !== 0) {
            if (err instanceof multer.MulterError) {                
                res.status(400).send(err.code);
            } else {
                res.send(err?.message ?? `Not all files were uploaded or you specified a wrong quantity of query parameters`);
            }
        }
        nameArr = [];
        next();
    });
}


export {copyNameArrForDB};
export default Upload;