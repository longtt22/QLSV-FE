import HttpClient from "./index";
import {SERVER_API_URL} from "../../commons/AppConfig";

class ApiService extends HttpClient {
    constructor() {
        console.log('SERVER_API_URL', SERVER_API_URL)
        super(SERVER_API_URL || '');
    }
}

export default new ApiService();