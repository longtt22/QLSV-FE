import ApiService from "../../../core/http/ApiServiceFactory";
import {StudentType} from "../type";
import {EmployeeType} from "../../employee/type";
import {STUDENT} from "../../../commons/constants";

export const getAllStudent = async (): Promise<StudentType[]> => {
    const res = await ApiService.get<EmployeeType[]>('/user/getAll', {type: STUDENT});
    return res.data;
};

export const findByStudentId = async (ID: number): Promise<StudentType> => {
    const res = await ApiService.get<StudentType>('/user/find-by-id/' + ID);
    return res.data;
};

export const createStudent = async (student: any): Promise<StudentType> => {
    const res = await ApiService.post<EmployeeType>('/user/' + STUDENT, student);
    return res.data;
};

export const deleteStudent = async (ID: number): Promise<void> => {
    const res = await ApiService.get<void>('/user/delete/' + ID);
    return res.data;
};