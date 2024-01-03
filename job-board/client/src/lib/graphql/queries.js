import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink, concat } from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
    const jwt = getAccessToken();
    if (jwt) {
        operation.setContext({
            headers: { 'Authorization': `Bearer ${jwt}` },
        });
    }
    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        title
        description
        date
        company {
            id
            name
        }
    }`

export const jobByIdQuery = gql`
    query JobById($id:ID!){
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}`;

export const companyByIdQuery = gql`
    query CompanyById($id:ID!){
        company(id:$id) {
        id
        name
        description
        jobs {
            id
            date
            title
            } 
        }
    }`;

export const jobsQuery = gql`
    query ($limit:Int, $offset: Int) {
        jobs(limit:$limit, offset:$offset) {
            items{
                id
                date
                title
                company {
                    id
                    name
                }
            }
            count
            
        } 
    }`;

export const createJobmutation = gql`
    mutation($input: CreateJobInput!) {
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
    `;