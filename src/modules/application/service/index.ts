import ApiService from "../../../core/http/ApiServiceFactory";
import {handlerUserProp, RequestType, StatusProp} from "../type";
import axios from "axios";
import {SERVER_API_URL} from "../../../commons/AppConfig";
import Storage from "../../../commons/storage";
import {toast} from "react-toastify";

export const getAllApplication = async (): Promise<RequestType[]> => {
    const res = await ApiService.get<RequestType[]>('/request/getAll');
    return res.data;
};

export const findAllByStatus = async (status: string): Promise<RequestType[]> => {
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

export const approvalRequest = async (request: any, files: File[]): Promise<void> => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(request)], {type: 'application/json'}));
    files?.forEach((file) => {
        formData.append('file', file)
    })
    const res = await axios.post(SERVER_API_URL + 'request/approval', formData, {
        headers: {
            'Authorization': `Bearer ${Storage.getTokenString()}`
        },
    });
    return res.data;
};
export const rejectRequest = async (id: number, reason: string): Promise<void> => {
    const res = await ApiService.get<void>('/request/reject', {id: id, reason: reason});
    return res.data;
};

export const reception = async (id: number): Promise<void> => {
    const res = await ApiService.get<void>('/request/reception', {id: id});
    return res.data;
};

export const countStatus = async (): Promise<StatusProp[]> => {
    const res = await ApiService.get<StatusProp[]>('/request/count-status');
    return res.data;
};
export const countHandlerUser = async (): Promise<handlerUserProp[]> => {
    const res = await ApiService.get<handlerUserProp[]>('/request/count-handler-user');
    return res.data;
};

export const downloadFile = async (fileName: string, filePath: string): Promise<void> => {
    try {
        const res = await ApiService.get<Blob>('/request/download', {filePath: filePath}, {responseType: 'blob'});
        const a = document.createElement('a');
        document.body.appendChild(a);
        const blob = new Blob([res.data]);
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        // @ts-ignore
        toast.error(`Error downloading file: ${error.message}`);
        throw error;
    }
};
