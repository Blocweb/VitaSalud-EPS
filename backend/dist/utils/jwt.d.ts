interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export declare const decodeToken: (token: string) => TokenPayload | null;
declare const _default: {
    generateToken: (payload: TokenPayload) => string;
    verifyToken: (token: string) => TokenPayload | null;
    decodeToken: (token: string) => TokenPayload | null;
};
export default _default;
//# sourceMappingURL=jwt.d.ts.map