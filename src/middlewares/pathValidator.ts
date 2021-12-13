import Collection from "../models/CollectionSchema";
import { check, validationResult } from "express-validator"
import { join, parse } from "path";
import { Request, Response, NextFunction } from "express";

const STORAGE = join(__dirname, '../../DiskStorage');
let maxCount : number;
let requestCount  = 0;
interface IFilter{ 
    path: string,
    name:string,
    [key:string]:string
}

function checkErr(req: Request, res: Response, next: NextFunction) {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
        return res.status(400).json({
            error: errorValidation.array()[0].msg
        });
    }
    next();
}

const sanitazeName = check('names', 'Names is reqired').not().isEmpty()
.customSanitizer(names => {
    const sanitizedNames = (<string>names).split(',').map(el => el.replaceAll(" ", "")).join();
    return sanitizedNames;
});

const checkDest = check('dest', 'Dest is reqired').not().isEmpty()
.customSanitizer(dest => {
    const str: string = dest;
    if (str[str.length - 1] === "\\" || str[str.length - 1] === "/") {
        return str.slice(0, str.length - 1).replaceAll(" ", "");
    }
    return dest;
})
.custom(async (value, {req}) => {
    const thisPath = join(STORAGE, value);
    if(value === ''){
        return Promise.reject(`You can save files only in folder`);
    }
    const parsedPath = parse(thisPath);
    const filter : IFilter = {
        name: parsedPath.name,
        path: parsedPath.dir,
    };
    parsedPath.ext ? filter.extname = parsedPath.ext : null;
    const existDest = await Collection.exists(filter);
    if (!existDest) {
        return Promise.reject(`Path ${value} doesn't exist`);
    }
    if((<string>req.url).match('folder') && req.method === 'POST' && existDest) {
        return Promise.reject(`Folder ${value} already exists`);
    }
    
});

const checkOffset = check('offset').isInt({min:0})
.custom(async (value, {req}) => {
    const absolutePath = join(STORAGE,<string>req.query?.dest)
    maxCount = await Collection.count({ path:absolutePath});
    requestCount+=parseInt(value, 10);
    if(requestCount> maxCount){
        throw new Error(`Offset is more than maxCount`);
    }
});

const checkCount = check('count').isInt({min:0})
.custom(value => {
    requestCount += parseInt(value, 10);
    if(requestCount > maxCount){
        throw new Error(`Offset + count is more than maxCount`)
    }
});

const checkGetViewQuery = [checkOffset,checkCount]



export { checkErr, sanitazeName, checkDest, checkGetViewQuery };

