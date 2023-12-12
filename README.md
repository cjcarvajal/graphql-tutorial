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
- Express-jwt is library to handle auth on server side using JWT.
- To obtain the context into a resolver, you can pass the object as a third parameter, beside the \_root, the args for the query, you declare the **context**.

```
player:(_root,{ alias }, context) => {
	//Do something with the context
}
```

- To obtain the context, you declare it in the apolloMiddleware declaration:

```app.use('/graphql',apolloMiddleware(apolloServer,{ context: getContext }));```

- In the ```getContext``` function, you can refer to a req object which contains all the request information incoming to the server: ```getContext({req})```.
- The context object can return a promise.
- The strategy to follow in auth, is to extract from the request (from the context) the required data.
- Http headers are case-insensitive.
- To configure auth on the client side, you can configure the headers for all request in the GraphQL configuration, by passing a second parameter (beside the url), and **options** object, and then specify the configuration element, in this scenario, the headers, lets see:

```
const client = new GraphQLClient('http://localhost:9000/graphql', {
    headers: () => {
    	//Get the auth header content here
        return getAuthHeader();
    },
});
```

- In Knex, a way to debug the queries is to log them, you do this by calling the **.toSQL()** method and then **.toNative()**.

### Apollo Client

Apollo client ease the process of configuration in the client side, some of the useful features are the Out of the box configuration for caching and the data fetching to handle states inside React app avoiding the need to write specific code in each query.

To add ApolloClient to your project you just simply use:

```
npm install @apollo/client
```

ApolloClient cames with a gql library too, is similar to the one imported from GaphQLClient, but beside highlighting GraphQL code, it returns a DocumentNode instead of a string.

For queries, you call ```.query``` from ApolloClient, it receives an options object with the query and the attributes. It returns a Promise, which contains (among many other info) a **data** object with the query result, so you made the call like:

```
const result = await apolloClient.request({
	query,
	variables: { 
			//your variables here 
		},
	});
```
- Mutations are similar in ApolloClient, you just call the **mutate** method, which also receives a document node (from the gql string) and the variables:

```
apolloClient.mutate({
	mutationQuery,
	variables: {
			//your variables here 
		},
	})
```

- To configure the auth on ApolloClient, you should use Links configuration, the ApolloClient execution strategy, chains calls from link to link, until the last link (called terminating link) makes the http request to the GraphQL server. So it's mandatory to create a link object configured to put the auth header in all requests. Also, it's required to chain the links in the proper order, for example:

```
 -----------      --------------      ----------
| Auth Link | -> | Logging Link | -> | HttpLink |
 -----------      --------------      ----------
```

```
const someLink = new ApolloLink((operation, forward) => {
	// Do the operations you need here, set the data into the 'operation'
    return forward(operation); //Chain the outcoming operation with the next link.
});
```

- ApolloClient Cache, cleverly merge the data from separates queries but stores the objects separately for memory optimization, it's important to know, ApolloClient assigns an id to the objects in the cache, this id is composed from the type name (\__typename) and the object id, which means, you need to assign an ID to the GraphQL schema for the objects.

- The cache behavior is configured by the **Fetch policies** these tells apollo client when to use data from the cache and when to obtain it from the network. The most common choices are **network-only** and **cache-first**. You can configure this on the apolloClient method or in the apolloClient configuration.

```
const { data } = await apolloClient.query({ 
		query,
		fetchPolicy: 'network-only',
	 });
```

- It's (of course) possible to modify the cache, this is useful to optimize the request made for the client to the server. The **mutation** accepts an update option, the code inside will be executed when the mutation completes. The **update** option accepts **cache** and **result**.

- To write into the cache, you should use the **writeQuery**, it requires the gql query, an object **variables** that should contain the variables required for the gql query and the data to store.

```
const result = await apolloClient.mutate({
        // The gql mutation query
        mutation,
        // The variables for mutation here
        variables: {...},
        update: (cache, result) => {
            cache.writeQuery({
            	// The query which stores the data into the cache
                query: ...,
                // The variables for the previous query
                variables: { ... },
                // The data to store
                result.data,
            });
        }
    })
```

- It may be cumbersome to duplicate code when you ask for the same variables in separates gql operations. There's where **fragments** are useful, fragments allows to declarate a set of fields to be reused into mutations and queries:

```
query {
	players {
		...PlayerDetail
	}
}

fragment PlayerDetail on Player {
	alias
	realName
	score
}
```










