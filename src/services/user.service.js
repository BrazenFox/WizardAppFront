import axios from 'axios';
import authHeader from './auth-header';

//const API_URL = 'http://localhost:8080/user/';
const API_URL = 'http://192.168.99.102:8080/user/';

class UserService {
    getUsers() {
        const g = axios.get(API_URL + 'find', { headers: authHeader() });
        //console.warn(g)
        return g;
    }
    getUser(id) {
        const g = axios.get(API_URL + 'find/' + id, { headers: authHeader() });
        //console.warn(g)
        return g;
    }
    updateUser(id, username, password, roles) {
        return axios.put(API_URL + "update/" + id, {
            username,
            password,
            roles
        }, {headers: authHeader()});
    }

    deleteUser(id){
        const g = axios.delete(API_URL + 'delete/' + id, { headers: authHeader() });
        //console.warn(g)
        return g;
    }
    createUser(username, password, roles) {
        return axios.post(API_URL + "create", {
            username,
            password,
            roles
        }, {headers: authHeader()});
    }


}

export default new UserService();
