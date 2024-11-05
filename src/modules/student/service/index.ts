import ApiService from "../../../core/http/ApiService";
import {StudentType} from "../type";

export const getAllStudent = async (): Promise<StudentType[]> => {
    const res = await ApiService.get<StudentType[]>('/students/getAll');
    return res.data;
};

export const findByStudentId = async (ID: number): Promise<StudentType> => {
    const res = await ApiService.get<StudentType>('/students/' + ID);
    return res.data;
};

export const createStudent = async (student: any): Promise<StudentType> => {
    const res = await ApiService.post<StudentType>('/students/create', student);
    return res.data;
};