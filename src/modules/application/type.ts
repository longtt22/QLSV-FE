export interface RequestType {
    id: number | null;
    requestType: String | null,
    description: String | null,
    fileNameRequest: String | null,
    filePathRequest: String | null,
    fileNameResponse: String | null,
    filePathResponse: String | null,
    fromDate: String | null,
    toDate: String | null,
    reason: String | null,
    status: String | null,
    handlerUser: String | null,
    createdAt: String | null,
    createdBy: String | null,
    updatedAt: String | null,
    updatedBy: String | null,
}

export type StatusProp = {
    status: string;
    totalRequests: any;
    totalAllRequests: any;
};

export type handlerUserProp = {
    handlerUser: string;
    totalRequests: any;
};