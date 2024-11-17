import ApiService from "../../../core/http/ApiServiceFactory";
import {ApplicationType} from "../type";

export const getAllEmployee = async (): Promise<ApplicationType[]> => {
    const res = await ApiService.get<ApplicationType[]>('/users/getAll');
    return res.data;
};

export const findByEmployeeId = async (ID: number): Promise<ApplicationType> => {
    const res = await ApiService.get<ApplicationType>('/users/' + ID);
    return res.data;
};

export const createEmployee = async (student: any): Promise<ApplicationType> => {
    const res = await ApiService.post<ApplicationType>('/users', student);
    return res.data;
};

export const deleteEmployee = async (ID: number): Promise<void> => {
    const res = await ApiService.get<void>('/users/delete/' + ID);
    return res.data;
};