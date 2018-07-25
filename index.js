const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

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

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));

module.exports = app;