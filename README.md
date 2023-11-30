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
- GraphQL Request is a great tool for the client side to ease the creation of requests to a GraphQL server.
- You may use gql, a feature from GraphQLCLient, you use the tag **gql** in your js files to highlight GraphQL syntax.

```
gql`
    query {
        // Your query fields here.
    }`;
```

- You define an argument for your GraphQL query in the schema, using ```{returnVariable}({argName}:{ArgType}):{returnType}``` for example:

```
player(alias:String!): Player
```

- To get the argument from the query into the resolver, you should refer to the default arguments passed by default from the query ```(_root,args)```, as args is an array of arguments, you may use the deestructuration from java: 

```player:(_root,{ alias }) => getPlayerByAlias(alias),```

- As in the query definition, you define the argument, it will be hardcoded if you don't define the variables to carry the data, so you need to create your query specifing a variable name in the client side, to see the differences check:

```
// Just argument definition no variable, hardcoded value for alias
query {
	Player(alias: "someString") {
		realName
		score
	}
}
```

```
// Variable definition, no hardcode value
query ($alias: String!) {
	Player(alias: $alias) {
		realName
		score
	}
}
```

- Thanks to the query recursivity, GraphQL is a great tool to avoid multiple calls from the client to the server, nevertheless, IMHO, this may be a risk in the server, if not implemented right and with the proper cache use, it may harm the databases and core systems.
- Even is possible to handle errors in your react app using states, is really cumbersone to put all that code for the GraphQL possible responses. So the **Apollo React Integration** may suit good for this issue.

### Mutations

- In GraphQL there's a clear separation bewteen read and write operations, the operation for write data into the server is a **Mutation**, you define a mutation in the schema by using this identifier instead of **Query**. Also, instead of using nouns (like in the query operation), you should use verbs which declares what your operation is going to do:

```
type Mutation {
	createSomething(data1: String!, data2: String!): Something
}
```
- As in queries, you should have to pass values to a mutation operation, but let's say your object contains a lot of fields, it'll be cumbersome to declare individually each value, a better approach an a recommended practice is to create an **input** type which encloses the data you need for your mutation, instead of:

```
mutation ($alias: String!, $realName: String!, $score: Int!){
	createPlayer(alias: $alias,realName: $realName, score: $Score){
		.
		.
		.
	}
}
```

Better define an input type in your schema:

```
input CreatePlayerInput {
	alias: String!, 
	realName: String!,
	score: Int!
}
```

And use it in your mutation:

```
mutation ($input: CreatePlayerInput) {...}
```

- To complete CRUD operations; updates and deletes are also **mutations**.
- Apparantly, and until this point, due to the query sintax is on the client side, I think a refactor of somevalue in the server side should be a disaster. Although, is the same scenario that should happend with a REST architecture, where the server changes (breaks) the contract.





