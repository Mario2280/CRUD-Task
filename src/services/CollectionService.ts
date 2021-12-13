import Collection from "../models/CollectionSchema";
import { parse, dirname, basename, join } from "path";
import { ICollectionSchema } from '../models/CollectionSchema';

interface INewProp {
    name?: string;
    path?: string;
    extname?: string;
}

interface IFilter{ 
    path: string,
    [key:string]:string
}

const CheckAndChangeEmptyStatusParentFolder = async function (oldDest: string | '', newDest: string | '') {
    if (oldDest !== newDest) {
        if (!oldDest) {
            await Collection.findOneAndUpdate({ path: dirname(newDest), name: basename(newDest) }, { isEmpty: false });
        } else if (!newDest) {
            const anyFileByTheWay = await Collection.exists({ path: oldDest });
            if (!anyFileByTheWay) {
                await Collection.findOneAndUpdate({ path: dirname(oldDest), name: basename(oldDest) }, { isEmpty: true });
            }
        }
    }
}

class CollectionService {

    async createFile(dest: string) {
        const parsedDest = parse(dest);
        const candidate = await Collection.exists({
            path: parsedDest.dir,
            name:parsedDest.name,
            extname:parsedDest.ext 
            });
        if (candidate) {
            return parsedDest.name;
        } else {
            const newFile = new Collection({
                name: parsedDest.name,
                path: parsedDest.dir,
                isFile: true,
                extname: parsedDest.ext
            });
            await newFile.save();
            await CheckAndChangeEmptyStatusParentFolder('', parsedDest.dir);
        }
        
    }
    async getViewFile(dest: string): Promise<ICollectionSchema | null> {
        const parsedDest = parse(dest);
        const result = await Collection.findOne({ path: parsedDest.dir, name: parsedDest.name }).lean();
        return result;
    }
    async createFolder(dest: string) {
        const parsedDest = parse(dest);
        const candidate = await Collection.exists({ path: dest });
        if (candidate) {
            throw new Error(`Folder ${parsedDest.name} already exists`);
        } else {            
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
    async getViewFolder(dest: string, extended: Array<string>, offset: number, count: number,onlyWithExt:string | null, sortField?: string) {
        let sortBy;
        
        if (sortField && ['extname','name','ctime', 'isEmpty'].includes(sortField)) {
            sortBy = sortField;
        }
        const filter : IFilter = {
            path: dest,
        }
        onlyWithExt ? filter.extname = onlyWithExt : null;
        const View = await Collection.find(filter).sort([[sortBy, -1]])
            .select('name path extname').skip(offset ?? 0).limit(count ?? 0).lean();
        if (extended.length) {
            for await (const el of extended) {
                const extendedFile = await Collection.findById(el).select(['name', 'path', 'extname', 'ctime']).lean();
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
            const reg = new RegExp(join(deleted.path, deleted.name).replaceAll('\\', '\\\\'));
            const pathToUpdate = await Collection.find({ path: { $regex: reg } });
            for (const el of pathToUpdate) {
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
