import HttpClient, {RESPONSE_CODE} from "./index";
import {SERVER_API_URL} from "../../commons/AppConfig";
import {tokenResponse} from "../../modules/login/type";
import {toast} from "react-toastify";

class ApiService extends HttpClient {
    constructor() {
        super(SERVER_API_URL || '');
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                const tokenData = this.getTokenData();
                if (tokenData?.token) {
                    config.headers['Authorization'] = `Bearer ${tokenData.token}`;
                }
                this.showLoading(true);
                return config;
            },
            (error) => {
                this.showLoading(false);
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                this.showLoading(false);
                return response;
            },
            (error) => {
                this.showLoading(false);
                if (error.response?.status === RESPONSE_CODE.TOKEN_EXPIRED) {
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('tokenData');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public setTokenData(tokenData: tokenResponse) {
        localStorage.setItem('tokenData', JSON.stringify(tokenData));
    }

    public getTokenData(): tokenResponse | null {
        const data = localStorage.getItem('tokenData');
        return data ? JSON.parse(data) : null;
    }

    public clearTokenData() {
        localStorage.removeItem('tokenData');
    }

    private showLoading(isLoading: boolean) {
        console.log(isLoading);
    }
}

export default new ApiService();
