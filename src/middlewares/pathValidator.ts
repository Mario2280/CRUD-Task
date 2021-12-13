import Collection from "../models/CollectionSchema";
import { check, validationResult } from "express-validator"
import { join, basename, parse } from "path";
import { Request, Response, NextFunction } from "express";

const STORAGE = join(__dirname, '../../DiskStorage');

interface IFilter{ 
    path: string,
    name:string,
    [key:string]:string
}

function checkErr(req: Request, res: Response, next: NextFunction) {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
        return res.status(500).json({
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
.custom(async value => {
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
});



export { checkErr, sanitazeName, checkDest };

