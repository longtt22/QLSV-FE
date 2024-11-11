import ApiService from "../../../core/http/ApiServiceFactory";
import {tokenResponse} from "../type";

export const loginByUsernameAndPassword = async (data: any): Promise<tokenResponse> => {
    const res = await ApiService.post<tokenResponse>('/jwt/token', data);
    return res.data;
};