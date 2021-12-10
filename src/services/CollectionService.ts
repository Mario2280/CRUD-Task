import Collection from "../models/CollectionSchema";
import { parse, sep, ParsedPath, dirname, basename, join } from "path";
import { ICollectionSchema } from '../models/CollectionSchema';

interface INewProp {
    name?: string;
    path?: string;
    extname?: string;
}

const CheckAndChangeEmptyStatusParentFolder = async function (oldDest: string | '', newDest: string | '') {
    if (oldDest !== newDest) {
        if (!oldDest) {
            await Collection.findOneAndUpdate({ path: dirname(newDest), name: basename(newDest) }, { isEmpty: false });
        } else if (!newDest) {
            const anyFileByTheWay = await Collection.findOne({ path: oldDest }).lean();
            if (!anyFileByTheWay) {
                await Collection.findOneAndUpdate({ path: dirname(oldDest), name: basename(oldDest) }, { isEmpty: true });
            }
        }
    }
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
        await CheckAndChangeEmptyStatusParentFolder('', parsedDest.dir);
    }
    async getViewFile(dest: string): Promise<ICollectionSchema | null> {
        const parsedDest = parse(dest);
        const result = await Collection.findOne({ path: parsedDest.dir, name: parsedDest.name }).lean();
        return result;
    }
    async createFolder(dest: string) {
        const candidate = await Collection.findOne({ path: dest }).lean();
        if (candidate) {
            throw new Error(`Folder already exists`);
        } else {
            const parsedDest = parse(dest);
            const newFolder = new Collection({
                name: parsedDest.name,
                path: parsedDest.dir,
                isFile: false,
                isEmpty: true,
            });
            await newFolder.save();
            await CheckAndChangeEmptyStatusParentFolder('', parsedDest.dir);
        }
    }
    async getViewFolder(dest: string, extended: Array<string>, offset: number, count: number, sortField?: string) {
        let sortBy;
        if (sortField && Collection.hasOwnProperty(sortField)) {
            sortBy = sortField;
        }
        const View = await Collection.find({ path: dest }).sort({ sortBy: 1 })
            .select('name path extname').skip(offset ?? 0).limit(count ?? 0).lean();
        if (extended.length) {
            for await (let el of extended) {
                let extendedFile = await Collection.findById(el).select(['name', 'path', 'extname', 'ctime']).lean();
                if (extendedFile) {
                    View.push(extendedFile);
                }
            }
        }
        return View;
    }
    async changeCollectionProp(dest: string, newProp: INewProp) {
        const parsedDest = parse(dest);
        const deleted = await Collection.findOneAndUpdate({ path: parsedDest.dir, name: parsedDest.name }, newProp).lean();
        if (deleted && newProp.path) {
            await CheckAndChangeEmptyStatusParentFolder(deleted.path, newProp.path);
            //, {path: join(newProp.path,newProp.name ?? deleted.name)}
            //Dont Work
            const reg = new RegExp(join(deleted.path, deleted.name).replaceAll('\\', '\\\\'));
            const reg1 = /E:\\TestTaskCRUD\\DiskStorage\\a/;
            //const pathToUpdate = await Collection.find({ path: { $regex: new RegExp(`E:\\TestTaskCRUD\\DiskStorage\\a`) , $options: 'i' } });
            const pathToUpdate = await Collection.find({ path: { $regex: reg } });
            for (let el of pathToUpdate) {
                console.log(join(newProp.path, newProp.name ?? deleted.name));
                console.log(el.path.replace(reg, join(newProp.path, newProp.name ?? deleted.name)));
                el.path = el.path.replace(reg, join(newProp.path, newProp.name ?? deleted.name));
                el.save();
            }
        }
    }
    async deleteCollection(dest: string) {
        const parsedDest = parse(dest);
        const deleted = await Collection.findOneAndDelete({ path: parsedDest.dir, name: parsedDest.name }).lean();
        if (deleted) {
            await CheckAndChangeEmptyStatusParentFolder(deleted.path, '');
        }
    }

}

export default new CollectionService();
