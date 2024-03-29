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

#### Fragments

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

#### ApolloClient Cache

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
            	// The GQL query which stores the data into the cache
                query: ...,
                // The variables for the previous query
                variables: { ... },
                // The data to store
                result.data,
            });
        }
    })
```

- Write a query result in the cache will overlap the query info, but sometimes you may need to update the query instead, Apollo Client Cache allows this using **updateQuery** instead of **writeQuery**.

```
const result = await apolloClient.mutate({
        .
        .
        .
        update: (cache, result) => {
            cache.updateQuery({
            	// The GQL query which stores the data into the cache
                query: ...,}, (infoStoredOnCache) => {
                	return {
                		//The infoStoredOnCache modified 
                	};
                });
        }
    });
```

#### Apollo Client React Integration

- ApolloClient came with a React integration to simplify the code, this integration allows to get rid of the states handling ```import { useEffect, useState } from 'react';```. Its required to:

	- Wrap the app inside and **ApolloProvider** tag, and asign a property of a configured ApolloClient.
	- Call the useQuery function, which receives the gql and the variables for such query, and returns the data, loading and error states.

```
const { data, loading, error } = useQuery(gqlQuery, {
    variables: { //your variables here
    	},
  });
```

- It's a good idea to write custom hooks, which simple are, function that encapsulates the **useQuery** call an create a custom response. Also is advisable to group the hooks in their own js file, instead of polluting the controller with this functions. For standard purpouses, you should call the hook function, starting with the word **use**.

- For mutations, you use a hook **useMutation** instead of useQuery, similarly in needs as the first parameter the gql DocumentNode. You should call the **useMutation** function which returns an array, where the first element is the **mutate function**, as the call to the server is not performed in this step, the mutate function, is async. In the call to the mutate function, you pass the the variables to mutate, this function also executes an **update** where it's possible to write in the cache.

```
const [mutateFunction] = useMutation(gqlmutation);

const { data } = await mutateFunction({
      variables: { // Your variables here
      	},
      update: (cache, { data }) => {
        // Your code to write in the cache
      },
    });
```

- The call to **useMutation** also returns a **result** object in the array, this object is useful to obtain the loading and error states, which may be used in the UX.

```
const [mutateFunction, result] = useMutation(gqlmutation);

const isError = result.error;
const isLoading = result.loading;
```

- To substract the code for **useMutation** and avoid polluting the view-controller components with GraphQL code, you write the hook a little different than the queries, by returning the required result objects (loading and/or error) and a function that will execute the call to the server (the mutateFunction).

```
export function useMutate() {

    const [mutateFunction, { loading }] = useMutation(gqlmutation);

    const mutationCall = async (//mutation variables here) => {
        const { data: { responseObject } } = await mutate({
            variables: { input: { //mutation variables here } },
            update: (cache, { data }) => {
                //Update the cache here
            },
        })
        return responseObject;
    };

    return {
        mutationCall,
        loading,
    }
}

//And to call the hook
const { mutationCall, loading } = useMutate();
mutationCall(//mutation variables here);
```

### N + 1

The N + 1 is a common problem that ocurrs when fetching data sources, let's say you have a table Player, and then a table Games, where there's a one to many relationship between them. Let's say you want to know all the Games for all the player, so you may do something like:

```
//This is a kind of pseudocode, nevermind the details
const ids = 'Select id from Player';
let games;
for id in ids :
	games = 'Select * from Game where player_id = ${id}';

```

In the previous snippet, you'll make 1 query to obtain all the players, and then N queries (1 for each player), this is highly inneficient.

A great approach to tackle this is Batching, which will reduce this to only two queries:

```
//This is a kind of pseudocode, nevermind the details
const ids = 'Select id from Player';

// A Select IN will make only one request to the database
games = 'Select * from Game where player_id IN $ids'
```

There's a npm utiliy called **DataLoader** which implements this pattern. Dataloaders uses a Cache per request, which means it detects if the query to the server has already been done, in which case it returns the same result from the previous query. To avoid this behavior you may create a new instance of dataloader for each request and passing it to the resolvers in the context, in the same fashion we pass the auth user.

### Pagination

Naturally, on an application which exposes data items to the user, when there's a lot of data to show you'll need to came with some UI (and backend) strategy of pagination. There are two common approaches, offset and cursor.

The offset split the server data into "pages" with a defined limit of items, an offset (index) will be assigned to each page, so for a NEXT event on pagination, the client will retrieve the items for the corresponding offset:

```
 --------   -------
| Item 1 |     |
 --------      |
 --------   Offset 0     
| Item 2 |     |
 --------      |
            -------
 --------   -------
| Item 1 |     |
 --------      |
 --------   Offset 1     
| Item 2 |     |
 --------      |
            -------
 --------   -------
| Item 1 |     |
 --------      |
 --------   Offset 2     
| Item 2 |     |
 --------      |
            -------
```

The offset tends to repeat some data in the pagination if new items are added to the database, as this will move some items for a new offset.

The other approach is a **cursor**, here you select an identifier for the items, and store this identifier as a cursor for the last shown element, when a new pagination is requested, the items with an identifier greater than the cursor will be retrieved.

Both approaches have their tradeoffs, let's see:

|              Offset				|               Cursor
|-----------------------------------|-----------------------------------|
|Simpler to implement.              |More complex to implement.         |
|Useful when data doesn't change too often. ("Often" meaning dependsof your business context).|Useful when there is new data all the time, for example on social network timelines (feeds).|
|Work's well with the pagination UI |Work's well with infinite scrolling|

- In order for pagination to works, the items should be ordered.
- The LIMIT clause is a must in the query to handle pagination, you may add it as a parmeter to the GraphQL schema.

```
players (limit: Int): [Player!]
```

- To complete the pagination from the server side, you must add the **offset** clause, offset may be interpreted as how many records should be skipped on the query result. As a matter of fact, is common to name **limit** and **offset** parameters in the code as **first** (give me the first n records) and **skip** (skipping m records).
- You will need the total count to control pagination, as after presenting the last record you should disable the UI to ask for more pages, a common way to do this is to return the count as a field in the GraphQL query.
- To calculate the total number of pages is pretty simple just round up the division among the total count of items and your number of items per page:

```
const pages = Math.ceil(itemsCount/itemsPerPage);
```

### Subscriptions

Subscriptions are defined as another high level type in the schema, the only change is that by convention, they should be named as events.

```
type Subscription {
  playerDeleted: Player
}
```

Subscriptions runs on websocket protocol, in which case is necessary to use **GraphQL-WS-Server**, according to the official documentation, is recommended to use **graphql-ws** package.

```
 npm install graphql-ws ws @graphql-tools/schema
```

In contrast with other types, the **Subscriptions** resolvers doesn't return a single value, for which they aren't functions, instead, they are defined as objects. The resolver must notify the client, and must be implemented as an object that provides a subscribe method which in turn returns an **asyncIterable**. AsyncIterable is a protocol from javascript for objects that may return multiple values over time.

For testing purpouses, you can use the **PubSub** implementation (for production use more fancy solutions, as Kafka or Redis). In order to write a subscription, you must use a string as a trigger name (PLAYER_DELETED in the example), and then use that string to make the publication when necessary.

```
Subscription: {
    playerDeleted: {
      subscribe: () => pubSub.asyncIterator('PLAYER_DELETED'),
    },
  }
```

```
pubSub.publish('PLAYER_DELETED', { playerDeleted: player });
```

#### Subscriptions Client Side

As a first operation, is required to configure the GraphQL WS-Client on the client side, this must be done by installing the proper module ```graphql-ws```, then creating a proper link to listen for the subscriptions and writing a function to check if an operation is a subscription or a normal query:

```
import {split} from '@apollo/client';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient as createWsClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(createWsClient({
  url: 'ws://{the rest of your url here}',
}));

export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
});

function isSubscription(operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === Kind.OPERATION_DEFINITION
    && definition.operation === OperationTypeNode.SUBSCRIPTION;
}
``` 

- Live reloading on pages, are achieved through Web Sockets.

A web socket connection, starts as an http connection, with some special request headers:

```
Connection: Upgrade
Upgrade: websocket
```

The successful status code, will be **101 Switching Protocols**. In the ws section of the Network tab on Google Chrome Developer Tools, you may check the request for initiating a subscription and also the incoming packages from such subscription.

#### Subscription Auth

- One way to authenticate the client, is to send the token as a **connectionParams** value when creating the **GraphQLWsLink**

```
const wSocketLink = new GraphQLWsLink(createWsClient({
  url: 'ws://{the rest of your url here}',
  connectionParams: () => ({ accessToken: {your auth token here}} }),
}));
```

- On the server side, is necessary to build a specific context for the wsLink, since the **expressjwt** works for http connections, you should indicate how to obtain the context in the **useServer** from 'graphql-ws/lib/use/ws' call.

```
import { useServer } from 'graphql-ws/lib/use/ws';
function getWsContext({ connectionParams }) {
	// Get the access token
	// Validate and decode the access token
	// Return the payload
}

useWsServer({ schema, context: getWsContext }, wsServer);
```
