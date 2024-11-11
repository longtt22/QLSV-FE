import ApiService from './ApiService';
import {store} from '../../redux/store';

// Khởi tạo một instance của ApiService với dispatch từ store của Redux
const apiService = new ApiService(store.dispatch);

export default apiService;
