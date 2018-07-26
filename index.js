const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const schema = require('./graphql/schema.js');
const root = require('./graphql/root.js');

const mongodbUrl = 'mongodb://localhost:27017/monsters';
mongoose.connect(mongodbUrl, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));