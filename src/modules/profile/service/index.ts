import ApiService from "../../../core/http/ApiServiceFactory";
import {ProfileType} from "../type";

export const getProfile = async (): Promise<ProfileType> => {
    const res = await ApiService.get<ProfileType>('/jwt/profile');
    return res.data;
};

export const editProfile = async (data: any): Promise<ProfileType> => {
    const res = await ApiService.post<ProfileType>('/user/edit-profile', data);
    return res.data;
};