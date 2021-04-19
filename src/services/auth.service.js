import axios from "axios";
import authHeader from './auth-header';
//const API_URL = "http://localhost:8080/auth/";
const API_URL = 'http://192.168.99.102:8080/auth/';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "login", {
                username,
                password
            })
            .then(response => {
                debugger
                console.warn(response.data)
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        axios.post(API_URL + "logout", {headers: authHeader()})
    }



    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
        ;
    }
}

export default new AuthService();
