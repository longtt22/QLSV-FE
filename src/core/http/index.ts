import axios, {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios';

enum LogType {
    REQUEST = 'req',
    RESPONSE = 'res',
    ERROR = 'err',
}

export const API_REQUEST_TIMEOUT = 20000; // 20s
export const RESPONSE_CODE = {
    TOKEN_EXPIRED: 401,
};

const log = (...params: any) => {
    if (process.env.NODE_ENV === `development`) {
        console.warn(...params);
    }
};

const requestLog = (method: string = '', url: string = '', data: any, type: LogType, baseURL: string) => {
    const tag = type === LogType.REQUEST || type === LogType.RESPONSE ? method : LogType.ERROR;
    const colors = {
        [LogType.REQUEST]: 'blue',
        [LogType.RESPONSE]: 'green',
        [LogType.ERROR]: 'red',
    };
    const icons = {
        [LogType.REQUEST]: '>>>',
        [LogType.RESPONSE]: '<<<',
        [LogType.ERROR]: 'xxx',
    };

    log(
        `%c${icons[type]} [${tag.toUpperCase()}] | %c${url.replace(baseURL, '')} \n`,
        `color: ${colors[type]}; font-weight: bold`,
        'color: violet; font-weight: bold',
        data
    );
};

const headers = {
    'Content-Type': 'application/json',
};

abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers,
            timeout: API_REQUEST_TIMEOUT,
        });
    }

    public get = <T>(url: string, params = {}, config: AxiosRequestConfig = {}): AxiosPromise<T> =>
        this.instance.get<T>(url, {params, ...config});

    public post = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => this.instance.post<T>(url, data, {...config});

    public put = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => this.instance.put<T>(url, data, {...config});

    public patch = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => this.instance.patch<T>(url, data, {...config});

    public delete = <T>(url: string, config: AxiosRequestConfig = {}) => this.instance.delete<T>(url, {...config});
}

export default HttpClient;
