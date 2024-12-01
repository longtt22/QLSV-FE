import HttpClient, {RESPONSE_CODE} from './index';
import {SERVER_API_URL} from '../../commons/AppConfig';
import {tokenResponse} from '../../modules/login/type';
import {toast} from 'react-toastify';
import {AppDispatch} from '../../redux/store';
import {setLoading} from '../../redux/slice/loadingSlice';

class ApiService extends HttpClient {
    private dispatch: AppDispatch;

    constructor(dispatch: AppDispatch) {
        super(SERVER_API_URL || '');
        this.dispatch = dispatch;
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                const tokenData = this.getTokenData();
                if (tokenData?.token) {
                    config.headers['Authorization'] = `Bearer ${tokenData.token}`;
                }
                this.dispatch(setLoading(true));
                console.log('Request Headers:', config.headers);
                return config;
            },
            (error) => {
                this.dispatch(setLoading(false));
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                this.dispatch(setLoading(false));
                return response;
            },
            (error) => {
                this.dispatch(setLoading(false));
                if (error.response?.status === RESPONSE_CODE.TOKEN_EXPIRED) {
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('tokenData');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public getTokenData(): tokenResponse | null {
        const data = localStorage.getItem('tokenData');
        return data ? JSON.parse(data) : null;
    }
}

export default ApiService;
