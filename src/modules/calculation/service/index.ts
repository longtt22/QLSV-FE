import ApiService from "../../../core/http/ApiService";
import {CalculationResult, Commune, District, Province, Region, VoltageLevel} from "../type";


export const getRegionData = async (): Promise<Region[]> => {
    const res = await ApiService.get<Region[]>('/regions');
    return res.data;
};

export const getProvinceData = async (): Promise<Province[]> => {
    const res = await ApiService.get<Province[]>('/provinces');
    return res.data;
};

export const getProvinceDataByRegionId = async (id: number): Promise<Province[]> => {
    const res = await ApiService.get<Province[]>('/provinces/find-all-by-region-id/' + id);
    return res.data;
};

export const getDistrictData = async (): Promise<District[]> => {
    const res = await ApiService.get<District[]>('/districts');
    return res.data;
};

export const getDistrictDataByProvinceId = async (id: number): Promise<District[]> => {
    const res = await ApiService.get<District[]>('/districts/find-all-by-province-id/' + id);
    return res.data;
};

export const getCommuneData = async (): Promise<Commune[]> => {
    const res = await ApiService.get<Commune[]>('/communes');
    return res.data;
};

export const getCommuneDataByDistrictId = async (id: number): Promise<Commune[]> => {
    const res = await ApiService.get<Commune[]>('/communes/find-all-by-district-id/' + id);
    return res.data;
};

export const getVoltageLevelData = async (): Promise<VoltageLevel[]> => {
    const res = await ApiService.get<VoltageLevel[]>('/voltage-level');
    return res.data;
};

export const executeCalculationData = async (data: any): Promise<CalculationResult> => {
    const res = await ApiService.post<CalculationResult>('/calculation', data);
    return res.data;
};
export const getCalculationData = async (): Promise<CalculationResult[]> => {
    const res = await ApiService.get<CalculationResult[]>('/calculation');
    return res.data;
};