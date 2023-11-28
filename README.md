# graphql-tutorial
A repo to learn graphql using Node.js, Express, Apollo Server, React, Apollo Client.

## Graph QL

- A language to query APIs instead of databases.
- Ask exactly the information you need.
- Enable to ask for a set of information in just one request, in contrast with REST.
- It's supposed to be ease to add GraphQL to your application.
- Internal project for Facebook, developed to speed their mobile app, due to the number of calls from client to server.
- The response is wrapped into a **data** object, because the response may contain other data as errors, which will came into an object different than data.
- Schema Polling is a feature from Apollo Server, which periodically request the schema to has the latest version.
