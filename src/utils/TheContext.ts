import {Request, Response} from 'express';

export interface TheContext {
    req: Request | any,
    res: Response
}