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
- All request are made by the POST operation.
- Nodemon is a functionality that will restart the server whenerver we change the code.
- Bulma is a CSS lightweight library.
- Null in graphql means the field is not available, if we want to restrict a field to be mandatory we must add the exclamation mark in the type, for example ```salary: Int!``.
- Not nullable in GraphQL means that if the client request the value, the server must provided. It doesn't mean is mandatory to the client to request it.
- To define an array as a response type, you should use [] in the elementType definition, for example:
```player: Player``` to ```players: [Player]```, in the same way you should change the resolver from:
```player: () => {//player object here}``` to ```player: () => {[//players objects here]}```.
- Similary, to define nullability into an array response use the exclamation mark: 
```
// Nullable
players: [Player]
```
```
// Not Nullable
playeres: [Player!]
```

- Let's say you want to include a field in the schema that is not present in the data base definition, so you need to "resolve" the field. That's the use of field resolvers, which defines in the resolvers file how to return the value to the client. Also, you may define field resolvers to make some format expected by the client.
- The field resolver function, always runs firts, which means it override other data for the same field.
- To document the elementTypes the commentaries must be enclosed into """, you may use __ to enclose bold strings.

```
"""
The __money__ earn by the worker at the end of the month.
"""
salary: Int
```

- Object associations means you may return a response object that is composed by other objects, it's only needed to state the objects in your schema and define the proper resolvers.

```
type Player {
	name: String
	team: Team
}

type Team {
	name: String
	color: String
}
```

- Resolvers **can be async!!!**
