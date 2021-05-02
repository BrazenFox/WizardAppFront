import axios from "axios";
import authHeader from './auth-header';
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {gql, useMutation} from '@apollo/client'
//const API_URL = "http://localhost:8080/auth/";
const API_URL = process.env.REACT_APP_SERVER_URL + '/auth/';
const client = new ApolloClient({
    //uri: "http://localhost:8081/query",
    uri: (process.env.REACT_APP_SERVER_URL && process.env.REACT_APP_SERVER_URL) || "http://192.168.99.102:8081/query",
    cache: new InMemoryCache(),
})


class AuthService {

    loginGraphQL(username, password) {
        return client.mutate({
            variables: {username, password},
            mutation: gql`
                mutation loginAuth($username: String!, $password: String!) {
                    loginAuth(input: { username: $username, password:$password}){
                        id
                        username
                        accessToken
                        tokenType
                        roles
                    }
                }
            `
        }).then((response) => {
            debugger
            if (response.data.loginAuth.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data.loginAuth));
            }
            console.log('\n=================MUTATE')
            console.log(response)
            return response.data.loginAuth
        })
    }

    logoutGraphQL() {
        localStorage.removeItem("user");
        client.query({
            query: gql`
                query logoutAuth {
                     logoutAuth
                }
            `
        })
    }

    /*login(username, password) {
        return axios
            .post(API_URL + "login", {
                username,
                password
            })
            .then(response => {
                console.warn(response)
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                debugger
                console.warn(response.data)
                return response.data;
            });
    }*/

    /* logout() {
         localStorage.removeItem("user");
         axios.post(API_URL + "logout", {headers: authHeader()}, {headers: authHeader()})
     }*/


    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
        ;
    }
}

export default new AuthService();
