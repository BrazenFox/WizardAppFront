import axios from 'axios';
import authHeader from './auth-header';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

//const API_URL = 'http://localhost:8080/user/';
const API_URL = process.env.REACT_APP_SERVER_URL + '/user/';
const client = new ApolloClient({
    //uri: "http://localhost:8081/query",
    uri: process.env.REACT_APP_SERVER_URL,
    cache: new InMemoryCache(),
})


class UserService {
    /*getUsers() {
        return axios.get(API_URL + 'find', { headers: authHeader() });
    }*/
    getUsersGraphQL(){
        //const token = authHeader().Authorization
        client.cache.reset()
        return client.query({
            variables: {token: authHeader().Authorization},
            query: gql`
                query getUsers($token: String!) {
                     getUsers(input: {token: $token}){
                        id
                        username
                        password
                        roles {
                            name
                        }
                     }
                }
            `
        })
    }
    /*getUser(id) {
        return axios.get(API_URL + 'find/' + id, { headers: authHeader() });
    }*/
    getUserGraphQL(id){
        client.cache.reset()
        return client.query({
            variables: {token: authHeader().Authorization,id},
            query: gql`
                query getUser($id:ID!,$token: String!) {
                     getUser(input: {id:$id, token: $token}){
                        id
                        username
                        password
                        roles {
                            name
                        }
                     }
                }
            `
        })
    }
    /*updateUser(id, username, password, roles) {
        return axios.put(API_URL + "update/" + id, {
            username,
            password,
            roles
        }, {headers: authHeader()});
    }*/

    updateUserGraphQL(id, username, password, roles){
        client.cache.reset()
        return client.mutate({
            variables: {token: authHeader().Authorization,username, password, roles, id},
            mutation: gql`
                mutation updateUser($token: String!, $id: ID!, $username: String!, $password: String!, $roles: [String!]! ) {
                     updateUser(input: {token: $token, id: $id, username:$username, password:$password, roles:$roles})
                }
            `
        })
    }

    /*deleteUser(id){
        return axios.delete(API_URL + 'delete/' + id, { headers: authHeader() });
    }*/

    deleteUserGraphQL(id){
        client.cache.reset()
        return client.mutate({
            variables: {token: authHeader().Authorization, id},
            mutation: gql`
                mutation deleteUser($token: String!, $id: ID!) {
                     deleteUser(input: {token: $token, id: $id})
                }
            `
        })
    }

    /*createUser(username, password, roles) {
        return axios.post(API_URL + "create", {
            username,
            password,
            roles
        }, {headers: authHeader()});
    }*/
    createUserGraphQL(username, password, roles){
        return client.mutate({
            variables: {token: authHeader().Authorization,username, password, roles},
            mutation: gql`
                mutation createUser($token: String!, $username: String!, $password: String!, $roles: [String!]! ) {
                     createUser(input: {token: $token, username:$username, password:$password, roles:$roles})
                }
            `
        })
    }


}

export default new UserService();
