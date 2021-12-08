import { NextFunction, Request, Response } from "express";

interface IControl {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    read(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface ModIControl extends IControl {
    getView(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeProp(req: Request, res: Response, next: NextFunction): Promise<void>;
    rewrite(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default ModIControl;