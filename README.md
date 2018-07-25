# GraphQL MongoDB Node.js Tutorial
This is a minimalistic tutorial of how to create a CRUD application with GraphQL, MongoDB, NodeJS and Express

### Prerequisites
[Node](https://nodejs.org/en/download/)

## Tutorial

### Node.js
* `mkdir projectname`
* `npm init`
* Add `"start": "node index.js",` to scripts in package.json
* Create `index.js` file in root folder

### Express
* `npm install express --save`
* Add this to index.js
```
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));

module.exports = app;
```
* `npm start` and navigate to `localhost:3000` and you should see Hello World!

### GraphQL
* `npm install express-graphql graphql --save`
* Add this to index.js
```
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
```
```
let schema = buildSchema(`
    type Monster{
        name: String,
        color: String
    }

    type Query {
        monsters: [Monster]
    }
`);

let monsters = [{name: 'Slimy Terrortree', color: 'blue'}, {name: 'Groggy', color: 'pink'}];

let root = { monsters: () => monsters };

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
```
* `npm start` and navigate to `http://localhost:3000/graphql` and you should see the GraphiQL display
* In left panel you can query exactly what data you need. I.E.
```
{
  monsters {
    name
    color
  }
}
```
```
{
  monsters {
    name
  }
}
```

## Authors

* **Gaute Meek Olsen** - [Twitter](https://twitter.com/GauteMeekOlsen)