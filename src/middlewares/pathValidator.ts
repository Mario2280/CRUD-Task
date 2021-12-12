import Collection from "../models/CollectionSchema";
import { check, validationResult } from "express-validator"
import { join, basename } from "path";
import { Request, Response, NextFunction } from "express";

const STORAGE = join(__dirname, '../../DiskStorage');

function checkErr(req: Request, res: Response, next: NextFunction) {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
        return res.status(500).json({
            error: errorValidation.array()[0].msg
        });
    }
    next();
}


export default [
    check('dest', 'Dest is reqired').not().isEmpty()
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
            const existDest = await Collection.exists({ path: thisPath }) ||
            await Collection.exists({ path: join(thisPath, '..'), name: basename(thisPath)});
            if (!existDest) {
                return Promise.reject(`Path ${value} doesn't exist`);
            }
        }),
    check('names', 'Names is reqired').not().isEmpty()
        .customSanitizer(names => {
            const sanitizedNames = (<string>names).split(',').map(el => el.replaceAll(" ", "")).join();
            return sanitizedNames;
        })
        .custom(async (names, { req }) => {
            const nameArr = (<string>names).split(',');
            for await (const el of nameArr) {
                if (req?.query?.dest || req?.query?.dest === '') {
                    const candidate = await Collection.exists({ path: join(STORAGE,req.query.dest), name: el });
                    if (candidate) {
                        throw new Error(`${el} already exists`);
                    }
                }
            }
        })
];

export { checkErr };

