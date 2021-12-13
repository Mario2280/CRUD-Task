import { Request, Response } from "express";
import fileService from "../services/CollectionService";
import ModIControl from "./IControl"
import { join, parse } from "path";
import { copyNameArrForDB } from "../middlewares/multer"
const STORAGE: string = join(__dirname, '../../DiskStorage/');
import { rename, unlink } from "fs/promises";


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
            const dontSaved = [];
            for (let i = 0; i < copyNameArrForDB.length; i++) {
                rebuiltPath = join(
                    STORAGE,
                    <string>req.query.dest,
                    copyNameArrForDB[i]);
                const candidate = await fileService.createFile(rebuiltPath);
                if(candidate){
                    dontSaved.push(candidate);
                }
            }
            if(dontSaved.length){
                res.status(200).send(`File(s) ${dontSaved} already exists, you overwritten it`);
            } else {
                res.status(200).send("OK");
            }
            
        }
        catch (error) {
            res.status(500).send((<Error>error).message);
        }

    }
    async read(req: Request, res: Response) {
        try {
            //validate path
            if (req.query.dest) {
                res.download(join(STORAGE, <string>req.query.dest));
            } else {
                throw new Error("Dest is required");
            }

        } catch (error) {
            res.status(500).send((<Error>error).message);
        }
    }
    async update(req: Request, res: Response) {
        try {
            //validate req.body
            if (req.query.dest) {
                await changePropInFs(req.body, <string>req.query.dest);
                res.send(`File was change`);
            } else {
                throw new Error("Dest is required");
            }

        } catch (error) {
            res.status(500).send((<Error>error).message);
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const fullPath = join(STORAGE, <string>req.query.dest);
            await unlink(fullPath);
            await fileService.deleteCollection(fullPath);
            res.status(200).send('File was deleted');
        } catch (error) {
            res.status(500).send((<Error>error).message);
        }
    }
    async getView(req: Request, res: Response) {
        try {
            const fullPath = join(STORAGE, <string>req.query.dest);
            const result = await fileService.getViewFile(fullPath);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send((<Error>error).message);
        }
    }
    async rewrite(req: Request, res: Response) {
        try {
            res.status(200).send("File updated");
        } catch (error) {
            res.status(500).send((<Error>error).message);
        }
    }

}

export default new FileController();