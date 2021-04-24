import axios from 'axios';
import authHeader from './auth-header';

//const API_URL = 'http://localhost:8080/wizard/';
const API_URL = 'http://192.168.99.102:8080/result/';

class ResultService {

    createResult(user_id, wizard_id, notes) {
        console.warn(API_URL + "create", {
            user_id,
            wizard_id,
            notes
        }, {headers: authHeader()})
        return axios.post(API_URL + "create", {
            user_id,
            wizard_id,
            notes
        }, {headers: authHeader()});
    }

    getResultsForUser(id) {
        console.warn(API_URL + 'findforuser/' + id, {headers: authHeader()})
        return axios.get(API_URL + 'findforuser/' + id, {headers: authHeader()});
    }


    getResultsForCreator(id, roles) {
        if (roles.includes("ADMIN")) {
            return axios.get(API_URL + 'findall', {headers: authHeader()});
        } else if (!roles.includes("ADMIN") && roles.includes("MODERATOR")) {
            return axios.get(API_URL + 'findformoder/' + id, {headers: authHeader()});
        }
    }


}

export default new ResultService();
