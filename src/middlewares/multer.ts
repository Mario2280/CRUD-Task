import multer from "multer";
import { join, extname } from "path";
import { Request, Response, NextFunction } from "express";
import fileService from "../services/CollectionService"


let copyNameArrForDB : Array<string> = [];


class Multer {
    
    #mineArr: string[] = ["image/png", "audio/mp4", "video/mp4"];
    #STORAGE = join(__dirname, '../../DiskStorage/');
    #maxSize: number = 1024 * 1024 * 40;
    public nameArr: Array<string> = [];
    public copyNameArrForDB: Array<string> = [];
    public isPut = false;
    
    
    #storage = multer.diskStorage({
        destination:  (req, _, cb) => {
            const newPath = join(this.#STORAGE, req.query.dest?.toString().trim() as string);
            cb(null, newPath);
        },
        filename: async (req, file, cb) => {
            const Fullname = `${<string>this.nameArr.pop() ?? file.originalname}${extname(file.originalname)}`;
            this.copyNameArrForDB.push(Fullname);
            cb(null, Fullname);
        }
    });
    
    #myMulter = multer({
        storage: this.#storage,
        fileFilter: (req, file, cb) => {
            if (!this.isPut) {
                const rev = this.nameArr.reverse();
                rev.forEach(async el => {
                    const testPath = join(this.#STORAGE, <string>req.query.dest, el);
                    await fileService.getViewFile(testPath).then(res => {
                        if (res) {
                            cb(null, false);
                        }
                    });
                });
            }
            if (!this.#mineArr.includes(file.mimetype)) {
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
        this.nameArr = (<string>req.query.names).split(',');
        this.nameArr = this.nameArr.reverse();
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
                res.send(err.message ?? `Not all files were uploaded or you specified a wrong quantity of query parameters`);
            }
        }
        copyNameArrForDB = downloader.copyNameArrForDB;
        downloader.nameArr = [];
        downloader.isPut = false;
        next();
    });
    // copyNameArrForDB = [];
    // ReadNewFileNames(req);
    // if (req.method === 'PUT') {
    //     isPut = true;
    //     myMulter.single('file')(req, res, (err) => {
    //         if (err || nameArr.length !== 0) {
    //             if (err instanceof multer.MulterError) {
    //                 res.status(400).send(err.code);
    //             } else {
    //                 res.send(err.message ?? `Not all files were uploaded or you specified a wrong quantity of query parameters`);
    //             }
    //         }
    //         nameArr = [];
    //         isPut = false;
    //         next();
    //     });
    // } else {
    //     myMulter.fields([{ name: 'file', maxCount: 3 }])(req, res, (err) => {
    //         if (err || nameArr.length !== 0) {
    //             if (err instanceof multer.MulterError) {
    //                 res.status(400).send(err.code);
    //             } else {
    //                 res.send(err?.message ?? `Not all files were uploaded or you specified a wrong quantity of query parameters`);
    //             }
    //         }
    //         nameArr = [];
    //         next();
    //     });
    // }
}


export { copyNameArrForDB };
export default Upload;
