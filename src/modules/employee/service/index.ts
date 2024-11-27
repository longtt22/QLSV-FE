import ApiService from "../../../core/http/ApiServiceFactory";
import {EmployeeType} from "../type";
import {STAFF} from "../../../commons/constants";
import {StatCardProps} from "../../../components/StatCard";

export const getAllEmployee = async (): Promise<EmployeeType[]> => {
    const res = await ApiService.get<EmployeeType[]>('/user/getAll', {type: STAFF});
    return res.data;
};

export const findByEmployeeId = async (ID: number): Promise<EmployeeType> => {
    const res = await ApiService.get<EmployeeType>('/user/find-by-id/' + ID);
    return res.data;
};

export const createEmployee = async (employee: any): Promise<EmployeeType> => {
    const res = await ApiService.post<EmployeeType>('/user/' + STAFF, employee);
    return res.data;
};

export const deleteEmployee = async (ID: number): Promise<void> => {
    const res = await ApiService.get<void>('/user/delete/' + ID);
    return res.data;
};

export const countUser = async (): Promise<StatCardProps[]> => {
    const res = await ApiService.get<StatCardProps[]>('/user/count');
    return res.data;
};