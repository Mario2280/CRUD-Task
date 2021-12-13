import Collection from "../models/CollectionSchema";
import { check, validationResult } from "express-validator"
import { join, parse } from "path";
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
        return res.status(400).json({
            error: errorValidation.array()[0].msg
        });
    }
    next();
}

const sanitazeName = check('names', 'Names is reqired').notEmpty()
.customSanitizer(names => {
    const sanitizedNames = (<string>names).split(',').map(el => el.replaceAll(" ", "")).join();
    return sanitizedNames;
});

const checkDest = check('dest', 'Dest is reqired').notEmpty()
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
    const existDest = await Collection.exists(filter);
    parsedPath.ext ? filter.extname = parsedPath.ext : null;
    if((<string>req.url).match('folder') && req.method === 'POST'){
        if(!await Collection.exists({path:parsedPath.dir})){ 
            return Promise.reject(`Path ${value} doesn't exist`);
        }
    } else {
        
        if (!existDest) {
            return Promise.reject(`Path ${value} doesn't exist`);
        }
    }   
    if((<string>req.url).match('folder')?.length && req.method === 'POST' && existDest) {
        return Promise.reject(`Folder ${value} already exists`);
    }
    
});



const checknewName = check('newName').notEmpty().not().contains( "/").not().contains( ".")
.custom(async (value, {req}) => {
    let newpath = join(STORAGE,parse(<string>req.query?.dest).dir);
    if (newpath[newpath.length - 1] === "\\" || newpath[newpath.length - 1] === "/") {
        newpath = newpath.slice(0, newpath.length - 1).replaceAll(" ", "");
    }
    const candidate = await Collection.exists({path: newpath, name : value}); 
    if(candidate){
        throw new Error(`Folder ${value} already exists`);
    }
});







export { checkErr, sanitazeName, checkDest, checknewName };

