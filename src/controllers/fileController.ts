import { NextFunction, Request, Response } from "express";
import fileService from "../services/CollectionService";
import ModIControl from "./IControl"
import { join, parse } from "path";
import { copyNameArrForDB } from "../middlewares/multer"
const STORAGE: string = join(__dirname, '../../DiskStorage/');
import { rename } from "fs/promises";


async function changePropInFs(props: { name?: string, path?: string, extname?: string }, relativePath: string) {
    const absolutePath = join(STORAGE, relativePath);
    const candidate = await fileService.getViewFile(absolutePath);
    if (!candidate) {
        throw new Error(`File not found`);
    } else {
        const newPath = props.path ?? parse(relativePath).dir,
            newName = props.name ?? parse(relativePath).name,
            newExtname = props.extname ?? parse(relativePath).ext;
        const newDest = join(STORAGE, newPath, `${newName}${newExtname}`),
            oldDest = join(STORAGE, relativePath);
        if (!(newDest.indexOf(STORAGE) == 0)) {
            throw new Error(`Incorrect new dest`);
        }
        await rename(oldDest, newDest);
        const Prop = {
            path: parse(newDest).dir,
            extname: parse(newDest).ext,
            name: parse(newDest).name
        };
        await fileService.changeCollectionProp(absolutePath, Prop);
        //return fileInDB;
    }
}

class FileController implements ModIControl {
    async create(req: Request, res: Response) {
        //validate dest exist 
        try {
            let rebuiltPath;
            for  (let i = 0; i < copyNameArrForDB.length; i++) {
                rebuiltPath = join(
                    STORAGE,
                    <string>req.query.dest,
                    copyNameArrForDB[i]);
                    await fileService.createFile(rebuiltPath)
            }
            res.status(200).send("OK");
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
                await changePropInFs(req.body, <string>req.query.dest);
                res.send(`File was change`);
            } else {
                throw new Error("Dest is required");
            }

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