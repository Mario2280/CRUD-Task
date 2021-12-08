import Collection from "../models/CollectionSchema";
import { parse } from "path";

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

    async getViewFile(dest: string) {
        const parsedDest = parse(dest);
        return Collection.find({ path: parsedDest.dir, name: parsedDest.name }).lean();
    }

    async rewrite(dest: string) {

    }
    async createFolder(dest: string) {

    }
    async getViewFolder(dest: string) {

    }
    async downloadFolder(dest: string) {

    }

    async changeCollectionProp(dest: string, newProp: IFile) {
        const parsedDest = parse(dest);
        return Collection.findOneAndUpdate({ path: parsedDest.dir, name: parsedDest.name }, newProp).lean();
    }

    async deleteCollection(dest: string) {

    }
   





}

export default new CollectionService();
