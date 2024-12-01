import ApiService from "../../../core/http/ApiServiceFactory";
import {ApplicationType} from "../type";

export const getAllType = async (): Promise<ApplicationType[]> => {
    const res = await ApiService.get<ApplicationType[]>('/application-type/getAll');
    return res.data;
};

export const findByTypeId = async (ID: number): Promise<ApplicationType> => {
    const res = await ApiService.get<ApplicationType>('/application-type/' + ID);
    return res.data;
};

export const createType = async (student: any): Promise<ApplicationType> => {
    const res = await ApiService.post<ApplicationType>('/application-type', student);
    return res.data;
};

export const deleteType = async (ID: number): Promise<void> => {
    const res = await ApiService.get<void>('/application-type/delete/' + ID);
    return res.data;
};