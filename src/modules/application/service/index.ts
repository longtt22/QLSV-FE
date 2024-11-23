import ApiService from "../../../core/http/ApiServiceFactory";
import {RequestType} from "../type";
import axios from "axios";
import {SERVER_API_URL} from "../../../commons/AppConfig";
import Storage from "../../../commons/storage";
import {ALL} from "../../../commons/constants";

export const getAllApplication = async (): Promise<RequestType[]> => {
    const res = await ApiService.get<RequestType[]>('/request/getAll');
    return res.data;
};

export const findAllByStatus = async (status: string): Promise<RequestType[]> => {
    if (status === ALL) {
        return getAllApplication();
    }
    const res = await ApiService.get<RequestType[]>('/request/find-by-status', {status: status});
    return res.data;
};

export const findById = async (ID: number): Promise<RequestType> => {
    const res = await ApiService.get<RequestType>('/request/' + ID);
    return res.data;
};

export const deleteApplication = async (ID: number): Promise<void> => {
    const res = await ApiService.get<void>('/request/delete/' + ID);
    return res.data;
};

export const createApplication = async (request: any, files: File[]): Promise<RequestType> => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(request)], {type: 'application/json'}));
    files?.forEach((file) => {
        formData.append('file', file)
    })
    const res = await axios.post(SERVER_API_URL + 'request/upload', formData, {
        headers: {
            'Authorization': `Bearer ${Storage.getTokenString()}`
        },
    });
    return res.data;
};
