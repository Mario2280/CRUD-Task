import multer from "multer";
import { join, extname, dirname, parse, basename } from "path";
import { Request, Response, NextFunction } from "express";
import {config} from "dotenv";
config({path: join(__dirname, "../../")});

let copyNameArrForDB : Array<string> = [];


class Multer {
    
    #mineArr: string[] | undefined = process.env.minetypes?.split(" ");
    #STORAGE = join(__dirname, '../../DiskStorage/');
    #maxSize: number = 1024 * 1024 * 40;
    public nameArr: Array<string> = [];
    public nameArrSecondary: Array<string> = [];
    public copyNameArrForDB: Array<string> = [];
    public isPut = false;
    
    
    #storage = multer.diskStorage({
        destination:  (req, _, cb) => {
            if(!this.isPut) {
                const newPath = join(this.#STORAGE, <string>req.query.dest);
                cb(null, newPath);
            } else {
                const newPath = join(this.#STORAGE, dirname(<string>req.query.dest));
                cb(null, newPath);
            }
            
        },
        filename: async (req, file, cb) => {
            if(!this.isPut) {
                const Fullname = `${<string>this.nameArr.pop() ?? basename(file.originalname)}${extname(file.originalname)}`;
                this.copyNameArrForDB.push(Fullname);
                cb(null, Fullname);
            } else {
                const Fullname = `${parse(<string>req.query.dest).name}${parse(<string>req.query.dest).ext ?? extname(file.originalname)}`;
                this.copyNameArrForDB.push(Fullname);
                cb(null, Fullname);
            }            
        }
    });
    
    #myMulter = multer({
        storage: this.#storage,
        fileFilter: (req, file, cb) => {
            if (!this.#mineArr?.includes(file.mimetype)) {
                cb(null, false);
            } else {
                cb(null, true);
            }
            
        },
        limits: { fieldSize: this.#maxSize }
    });

    #Single = this.#myMulter.single('file');

    #Multiple = this.#myMulter.fields([{ name: 'file', maxCount: 3 }]);

    public ReadNewFileNames(req: Request) {        
        if(this.#mineArr == undefined){
            throw new Error(`minetypes is not defined`);
        }
        this.nameArr = (<string>req.query.names).split(',');
        this.nameArr = this.nameArr.reverse();
        this.nameArrSecondary = Array.from(this.nameArr);
        return this.#ConfigMulter(req);
    }
    #ConfigMulter(req: Request){
        if(req.method === "PUT"){
            this.isPut = true;
            return this.#Single;
        } else {
            return this.#Multiple;
        }
    }
}


const Upload = function (req: Request, res: Response, next: NextFunction) {
    const downloader = new Multer();
    downloader.copyNameArrForDB = [];
    const configuredMulter = downloader.ReadNewFileNames(req);
    configuredMulter(req,res, (err) => {
        if (err || downloader.nameArr.length !== 0) {
            if (err instanceof multer.MulterError) {
                res.status(400).send(err.code);
            } else {
                res.send(err.message ? err.message : `Not all files were uploaded or you specified a wrong quantity of query parameters`);
            }
        }
        copyNameArrForDB = downloader.copyNameArrForDB;
        downloader.nameArr = [];
        downloader.isPut = false;
        next();
    });
}


export { copyNameArrForDB };
export default Upload;
