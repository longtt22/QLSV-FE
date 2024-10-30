import ApiService from "../../../core/http/ApiService";
import {Student} from "../type";

export const getAllStudent = async (): Promise<Student[]> => {
    const res = await ApiService.get<Student[]>('/students/getAll');
    return res.data;
};

export const findByStudentId = async (ID: number): Promise<Student> => {
    const res = await ApiService.get<Student>('/students/' + ID);
    return res.data;
};