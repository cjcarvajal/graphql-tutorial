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

const jobByIdQuery = gql`
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

export async function createJob({ title, description }) {
    const mutation = gql`
        mutation($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${jobDetailFragment}
        `;
    const { data } = await apolloClient.mutate({
        mutation,
        variables: { input: { title, description } },
        update: (cache, { data }) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: data.job.id },
                data,
            });
        }
    })

    return data.job;
}

export async function getCompanyById(id) {
    const query = gql`
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
    }`

    const { data } = await apolloClient.query({
        query,
        variables: { id }
    });
    return data.company;
}

export async function getJobById(id) {

    const { data } = await apolloClient.query({
        query: jobByIdQuery,
        variables: { id },
    });
    return data.job;
}

export async function getJobs() {
    const query = gql`
    query {
        jobs {
            id
            date
            title
            company {
                id
                name
            }
        } 
    }`;

    const { data } = await apolloClient.query({
        query,
        fetchPolicy: 'network-only',
    });
    return data.jobs;
}