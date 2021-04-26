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

    /*createResult(user_id, wizard_id, notes) {
        return axios.post(API_URL + "create", {
            user_id,
            wizard_id,
            notes
        }, {headers: authHeader()});
    }*/

    createResultGraphQL(user_id, wizard_id, notes){
        return client.mutate({
            variables: {token: authHeader().Authorization, user_id, wizard_id, notes},
            mutation: gql`
                mutation createResult($token: String!, $user_id: ID!, $wizard_id: ID!, $notes: [InputNote!]! ) {
                     createResult(input: {token: $token, user_id:$user_id, wizard_id: $wizard_id, notes: $notes})
                }
            `
        })
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
                        note{
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


    /*getResultsForCreator(id, roles) {
        client.cache.reset()
        if (roles.includes("ADMIN")) {
            return axios.get(API_URL + 'findall', {headers: authHeader()});
        } else if (!roles.includes("ADMIN") && roles.includes("MODERATOR")) {
            return axios.get(API_URL + 'findformoder/' + id, {headers: authHeader()});
        }
    }*/

    getResultsForCreatorGraphQL(id, roles) {
        client.cache.reset()
        if (roles.includes("ADMIN")) {
            return client.query({
                variables: {token: authHeader().Authorization, id},
                query: gql`
                query getResults($token: String!) {
                     getResults(input: {token: $token})
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
                        note{
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
                        note{
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
    }


}

export default new ResultService();
