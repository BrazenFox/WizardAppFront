import axios from 'axios';
import authHeader from './auth-header';

//const API_URL = 'http://localhost:8080/wizard/';
const API_URL = 'http://192.168.99.102:8080/result/';
class ResultService {

    createResult(user_id, wizard_id, data) {
        return axios.post(API_URL + "create", {
            user_id,
            wizard_id,
            data
        });
    }



}

export default new ResultService();
