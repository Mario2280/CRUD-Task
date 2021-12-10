import { IControl } from "./IControl"
import { Request, Response } from "express";
import { mkdir, rmdir, rename } from "fs/promises";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises"
import folderService from "../services/CollectionService";
import { join, dirname, basename } from "path";
import tar from "tar";
const STORAGE: string = join(__dirname, '../../DiskStorage/');





class FolferController implements IControl {
    async create(req: Request, res: Response) {
        try {
            if (req.query.dest) {
                const absolutePath = join(STORAGE, <string>req.query.dest);
                await mkdir(absolutePath);
                await folderService.createFolder(absolutePath);
                res.status(200).send("Folder created");
            } else {
                throw new Error("Dest is required");
            }
        } catch (error) {
            res.status(400).send((<Error>error).message);
        }
    }
    async read(req: Request, res: Response) {
        try {
            const absolutePath = join(STORAGE, <string>req.query.dest);
            const downloadZip = join(STORAGE, "DOWNLOAD.tgz");
            const streamForZip = createWriteStream(downloadZip).on('finish', () => {
                res.setHeader('Content-Type', 'application/x-gzip');
                res.download(downloadZip);
                //res.status(200).send("OK");
            })
            res.on('close', async () => {
                await unlink(downloadZip);
            })
            tar.c({ gzip: true }, [absolutePath]).pipe(streamForZip);

        } catch (error) {
            res.status(400).send((<Error>error).message);
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const absolutePath = join(STORAGE, <string>req.query.dest);
            await rmdir(absolutePath);
            await folderService.deleteCollection(absolutePath);
            res.status(200).send("Folder deleted");
        } catch (error) {
            res.status(400).send((<Error>error).message);
        }
    }
    async getView(req: Request, res: Response) {
        try {
            let extendedArray;
            const sortBy = <string>req.query.sort;
            if (req.query.dest) {
                res.status(200);
                const absolutePath = join(STORAGE, <string>req.query.dest);
                if (req.query.extended) {
                    extendedArray = req.query.extended.toString().split(',');
                }
                const offset = parseInt(<string>req.query.offset, 10);
                const count = parseInt(<string>req.query.count, 10);
                const records = await folderService.getViewFolder(
                    absolutePath,
                    extendedArray ?? [],
                    isNaN(offset) ? 0 : offset,
                    isNaN(count) ? 0 : count,
                    sortBy
                );
                if (records) {
                    res.send(records);
                } else {
                    res.send(`Folder is empty`);
                }
            }
        } catch (error) {
            res.status(400).send((<Error>error).message);
        }
    }
    async update(req: Request, res: Response) {
        try {
            const absoluteOldPath = join(STORAGE, <string>req.query.dest);
            const absoluteNewPath = join(STORAGE, <string>req.query.dest, '../', <string>req.query.newName);
            await rename(absoluteOldPath, absoluteNewPath);
            const newProp = {
                path: dirname(absoluteNewPath),
                name: basename(absoluteNewPath),
            }
            await folderService.changeCollectionProp(absoluteOldPath, newProp);
            res.status(200).send("Folder name changed");
        } catch (error) {
            res.status(400).send((<Error>error).message);
        }
    }
}

export default new FolferController();