import axios from 'axios';
import authHeader from './auth-header';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

//const API_URL = 'http://localhost:8080/wizard/';
const API_URL = 'http://192.168.99.102:8080/wizard/';
const client = new ApolloClient({
    uri: "http://localhost:8081/query",
    cache: new InMemoryCache(),
})

class WizardService {
    /*getWizards() {
        return axios.get(API_URL + 'find', { headers: authHeader() });
    }*/

    getWizardsGraphQL(){
        client.cache.reset()
        return client.query({
            variables: {token: authHeader().Authorization},
            query: gql`
                query getWizards($token: String!) {
                     getWizards(input: {token: $token})
                     {
                        id
                        name
                        creator{
                            id
                            username
                        }
                        pages{
                            id
                            name
                            buttons{
                                id
                                name
                            }
                        }
                    }
                }
            `
        })
    }

    /*getWizard(id) {
        return axios.get(API_URL + 'find/' + id, { headers: authHeader() });
    }*/

    getWizardGraphQL(id){
        client.cache.reset()
        return client.query({
            variables: {token: authHeader().Authorization,id},
            query: gql`
                query getWizard($token: String!, $id:ID!) {
                     getWizard(input: {token: $token, id: $id})
                     {
                        name
                        creator{
                            id
                            username
                            roles{
                                id
                                name
                            }
                        }
                        pages{
                            id
                            name
                            content
                            type
                            buttons{
                                id
                                name
                                toPage{
                                    id
                                    name
                                    type
                                }
                            }
                        }
                    }
                }
            `
        })
    }

    /*deleteWizard(id){
        return axios.delete(API_URL + 'delete/' + id, { headers: authHeader() });
    }*/

    deleteWizardGraphQL(id){
        client.cache.reset()
        return client.mutate({
            variables: {token: authHeader().Authorization, id},
            mutation: gql`
                mutation deleteWizard($token: String!, $id: ID!) {
                     deleteWizard(input: {token: $token, id: $id})
                }
            `
        })
    }

    /*createWizard(name, pages, creator) {
        return axios.post(API_URL + "create", {
            name,
            pages,
            creator
        }, { headers: authHeader() });
    }*/

    createWizardGraphQl(name, pages, creator){
        return client.mutate({
            variables: {token: authHeader().Authorization,name, pages, creator},
            mutation: gql`
                mutation createWizard($token: String!, $name: String!, $pages: [InputPage!]!, $creator: InputUser! ) {
                     createWizard(input: {token: $token, name:$name, pages: $pages, creator: $creator})
                }
            `
        })
    }

    /*updateWizard(id, name, pages, creator) {
        return axios.put(API_URL + "update/" + id, {
            name,
            pages,
            creator
        }, { headers: authHeader() });
    }*/

    updateWizardGraphQl(id, name, pages, creator){
        return client.mutate({
            variables: {token: authHeader().Authorization, id, name, pages, creator},
            mutation: gql`
                mutation updateWizard($token: String!,$id: ID!, $name: String!, $pages: [InputPage!]!, $creator: InputUser! ) {
                     updateWizard(input: {token: $token, id: $id, name: $name, pages: $pages, creator: $creator})
                }
            `
        })
    }


}

export default new WizardService();
