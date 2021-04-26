import axios from 'axios';
import authHeader from './auth-header';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

//const API_URL = 'http://localhost:8080/wizard/';
const API_URL = 'http://192.168.99.102:8080/result/';
const client = new ApolloClient({
    uri: "http://localhost:8081/query",
    cache: new InMemoryCache(),
})

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

    /*getResultsForUser(id) {
        console.warn(API_URL + 'findforuser/' + id, {headers: authHeader()})
        return axios.get(API_URL + 'findforuser/' + id, {headers: authHeader()});
    }*/

    getResultsForUserGraphQL(id){
        client.cache.reset()

        return client.query({
            variables: {token: authHeader().Authorization, id},
            query: gql`
                query getResultsForUser($token: String!, $id: ID!) {
                     getResultsForUser(input: {token: $token, id: $id})
                     {
                        id
                        wizard{
                            id
                            name
                            creator{
                                id
                                username
                            }
                        }
                        
                        user{
                            id
                            username
                        }
                        date
                        notes{
                          page{
                            id
                            name
                          }
                          button{
                            id
                            name
                          }
                        }
                    }
                }
            `
        })
    }


    getResultsForCreator(id, roles) {
        client.cache.reset()
        if (roles.includes("ADMIN")) {
            return axios.get(API_URL + 'findall', {headers: authHeader()});
        } else if (!roles.includes("ADMIN") && roles.includes("MODERATOR")) {
            return client.query({
                variables: {token: authHeader().Authorization, id},
                query: gql`
                query getResultsForModer($token: String!, $id: ID!) {
                     getResultsForModer(input: {token: $token, id: $id})
                     {
                        id
                        wizard{
                            id
                            name
                            creator{
                                id
                                username
                            }
                        }
                        
                        user{
                            id
                            username
                        }
                        date
                        notes{
                          page{
                            id
                            name
                          }
                          button{
                            id
                            name
                          }
                        }
                    }
                }
            `
            });
        }
    }


}

export default new ResultService();
