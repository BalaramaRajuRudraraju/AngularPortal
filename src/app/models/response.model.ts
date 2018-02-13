import { Error } from './error.model';

export class Response {
    timestamp: Date;
    status: number;
    error: Error;
    message: string;
    path: string;
}
