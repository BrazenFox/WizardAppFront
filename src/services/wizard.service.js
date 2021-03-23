import axios from 'axios';
import authHeader from './auth-header';

//const API_URL = 'http://localhost:8080/wizard/';
const API_URL = 'http://192.168.99.102:8080/wizard/';
class WizardService {
    getWizards() {
        return axios.get(API_URL + 'find', { headers: authHeader() });
    }

    getWizard(id) {
        const g = axios.get(API_URL + 'find/' + id, { headers: authHeader() });
        console.warn(g)
        return g;
    }

    deleteWizard(id){
        const g = axios.delete(API_URL + 'delete/' + id, { headers: authHeader() });
        console.warn(g)
        return g;
    }

    createWizard(name, pages, buttons) {
        return axios.post(API_URL + "create", {
            name,
            pages,
            buttons
        });
    }


}

export default new WizardService();
