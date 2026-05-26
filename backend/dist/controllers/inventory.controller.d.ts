import { Request, Response } from 'express';
export declare const getInventory: (req: Request, res: Response) => Promise<void>;
export declare const getInventoryById: (req: Request, res: Response) => Promise<void>;
export declare const getLowStockItems: (req: Request, res: Response) => Promise<void>;
export declare const createInventoryItem: (req: Request, res: Response) => Promise<void>;
export declare const updateInventoryItem: (req: Request, res: Response) => Promise<void>;
export declare const deleteInventoryItem: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getInventory: (req: Request, res: Response) => Promise<void>;
    getInventoryById: (req: Request, res: Response) => Promise<void>;
    getLowStockItems: (req: Request, res: Response) => Promise<void>;
    createInventoryItem: (req: Request, res: Response) => Promise<void>;
    updateInventoryItem: (req: Request, res: Response) => Promise<void>;
    deleteInventoryItem: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=inventory.controller.d.ts.map