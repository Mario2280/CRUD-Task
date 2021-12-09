import Collection from "../models/CollectionSchema";
import { parse } from "path";
import { ICollectionSchema } from '../models/CollectionSchema'
interface IFile {
    name?: string,
    path?: string,
    extname?: string,
}

class CollectionService {

    async createFile(dest: string) {
        const parsedDest = parse(dest);
        const newFile = new Collection({
            name: parsedDest.name,
            path: parsedDest.dir,
            isFile: true,
            extname: parsedDest.ext
        });
        await newFile.save();
    }

    async downloadFile(dest: string) {



    }

    async getViewFile(dest: string): Promise<ICollectionSchema | null> {
        const parsedDest = parse(dest);
        const result = await Collection.findOne({ path: parsedDest.dir, name: parsedDest.name }).lean();
        return result;
    }

    async rewrite(dest: string) {

    }
    async createFolder(dest: string) {

    }
    async getViewFolder(dest: string) {

    }
    async downloadFolder(dest: string) {

    }

    async changeCollectionProp(dest: string, newProp: ICollectionSchema) {
        const parsedDest = parse(dest);
        await Collection.findOneAndUpdate({ path: parsedDest.dir, name: parsedDest.name }, newProp);
    }

    async deleteCollection(dest: string) {

    }






}

export default new CollectionService();
