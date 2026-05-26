import { Request, Response } from 'express';
export declare const getRooms: (req: Request, res: Response) => Promise<void>;
export declare const getRoomById: (req: Request, res: Response) => Promise<void>;
export declare const getAvailableRooms: (req: Request, res: Response) => Promise<void>;
export declare const createRoom: (req: Request, res: Response) => Promise<void>;
export declare const updateRoom: (req: Request, res: Response) => Promise<void>;
export declare const deleteRoom: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getRooms: (req: Request, res: Response) => Promise<void>;
    getRoomById: (req: Request, res: Response) => Promise<void>;
    getAvailableRooms: (req: Request, res: Response) => Promise<void>;
    createRoom: (req: Request, res: Response) => Promise<void>;
    updateRoom: (req: Request, res: Response) => Promise<void>;
    deleteRoom: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=rooms.controller.d.ts.map