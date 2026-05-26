import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (
req: Request,
res: Response,
next: NextFunction
): void => {

try{

const authHeader=req.headers.authorization;

if(
!authHeader ||
!authHeader.startsWith("Bearer ")
){

res.status(401).json({
success:false,
message:"No token provided"
});

return;

}

const token=authHeader.substring(7);

const decoded=verifyToken(token);

if(!decoded){

res.status(401).json({
success:false,
message:"Invalid token"
});

return;

}

req.user=decoded;

next();

}catch{

res.status(401).json({
success:false,
message:"Authentication failed"
});

}

};

export const authorize=(...roles:string[])=>{

return(
req:Request,
res:Response,
next:NextFunction
):void=>{

if(!req.user){

res.status(401).json({
success:false,
message:"No user found"
});

return;

}

if(
req.user.role==="admin"
){

next();
return;

}

if(
!roles.includes(req.user.role)
){

res.status(403).json({
success:false,
message:"Access denied"
});

return;

}

next();

};

};

export default {
authenticate,
authorize
};
