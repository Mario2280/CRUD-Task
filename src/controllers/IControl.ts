import { Request, Response } from "express";

interface IControl {
    create(req: Request, res: Response): Promise<void>;
    read(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}

interface ModIControl extends IControl {
    getView(req: Request, res: Response): Promise<void>;
    rewrite(req: Request, res: Response): Promise<void>;
}

export default ModIControl;