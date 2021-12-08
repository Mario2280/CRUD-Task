import { NextFunction, Request, Response } from "express";
import fileService from "../services/CollectionService";
import ModIControl from "./IControl"
import { join, parse } from "path";
import { copyNameArrForDB } from "../middlewares/multer"
const STORAGE: string = './DiskStorage';
import { rename } from "fs";

function changePropInFs(props: { name?: string, dest: string, ext?: string, newPath?: string}) {
   
    // const candidate = fileService.getViewFile(join(props.dest, props.name));

    // let rebuiltNewFullPath = '';
    // if (props.name) {
    //     if (!candidate) {
    //         throw new Error('File not found');
    //     } else {
    //         if(props.newPath) {
    //             rename(join(props.dest,name, props.newPath)
    //         } else {

    //         }
    //     }
    // } else {

    // }
}

class FileController implements ModIControl {
    async create(req: Request, res: Response) {
        //validate dest exist 
        try {
            //This is relative path 
            let rebuiltPath;
            for (let i = 0; i < copyNameArrForDB.length; i++) {
                rebuiltPath = join(
                    STORAGE,
                    <string>req.query.dest,
                    copyNameArrForDB[i]);
                fileService.createFile(rebuiltPath)
            }
        }
        catch (error) {
            res.status(500).send((<Error>error).message);
        }

    }

    async read(req: Request, res: Response) {
        try {

        } catch (error) {

        }
    }
    async update(req: Request, res: Response) {
        try {

        } catch (error) {

        }
    }
    async delete(req: Request, res: Response) {
        try {

        } catch (error) {

        }
    }
    async getView(req: Request, res: Response) {
        try {

        } catch (error) {

        }
    }
    async changeProp(req: Request, res: Response) {
        try {
            //validate req.body
            if (req.query.dest) {
                changePropInFs(req.body);
            } else {
                throw new Error("Dest is required");
            }

            res.send("OK");
        } catch (error) {
            res.status(400).send((<Error>error).message);
        }
    }
    async rewrite(req: Request, res: Response) {
        try {
            //const Editable = await 
        } catch (error) {

        }
    }

}

export default new FileController();