export type TypeUserInfo = {
    id: string;
    email: string;
    name: string;
    picture?: string;
    acsessToken?: string;
    refreshToken?: string;
    expriesAt?: number;
    provider?: string;
}