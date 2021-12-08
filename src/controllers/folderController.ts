import ModIControl from "./IControl"
import {NextFunction, Request, Response} from "express";

class FolferController implements ModIControl {
    async create(req: Request, res: Response, next: NextFunction) {

        // try {
        //     if(!req.query.hasOwnProperty('path') || !req.query.path?.length || !req.query.path.toString().trim()){
        //         res.send('Query path are required');
        //     } else{
        //         uploadMultiple(req as Request, res, (err) => {
        //             if(err){
        //                 if(err instanceof multer.MulterError){
        //                     res.send(err.code);
        //                 } else{
        //                     res.send(err.message);
        //                 }
                        
        //             } else {
        //                 res.send("OK");
        //             }
        //         });
        //     }
        // } catch (error) {
        //     res.status(500).send((<Error>error).message);
        // }
        res.download('E:\\TestTaskCRUD\\src\\controllers\\IControl.ts', (err) => {
            if(err){
                console.log(err.message);
            }
        });
        
    }
    async read(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }
    async getView(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }
    async changeProp(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }
    async rewrite(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }

}

export default new FolferController();