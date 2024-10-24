export interface CalculationResult {
    id: number,
    region: Region,
    province: Province,
    district: District,
    commune: Commune,
    voltageLevel: VoltageLevel,
    distanceFactor: DistanceFactor,
    distance: number,
    total: number,
}

export interface CalculationRequest {
    region: Region,
    province: Province,
    district: District,
    commune: Commune,
    voltageLevel: VoltageLevel,
    kilometer: number,
}

export interface Region {
    regionId: number;
    regionName: string;
    factor: number;
}

export interface Province {
    provinceId: number;
    provinceName: string;
}

export interface District {
    districtId: number;
    districtName: string;
}

export interface Commune {
    communeId: number;
    communeName: string;
}

export interface VoltageLevel {
    id: number;
    description: string;
    baseCost: number;
}

export interface DistanceFactor {
    distanceFactorId: number;
    distanceMin: number;
    distanceMax: number;
    factor: number;
}


