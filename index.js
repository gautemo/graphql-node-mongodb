const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

const mongodbUrl = 'mongodb://localhost:27017/monsters';
mongoose.connect(mongodbUrl, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

let monsterDbSchema = new mongoose.Schema({
    name: String,
    color: String
});

let Monster = mongoose.model('Monster', monsterDbSchema);

app.get('/', (req, res) => res.send('Hello World!'));

let schema = buildSchema(`
    input MonsterInput{
        name: String
        color: String
    }

    type Monster{
        name: String,
        color: String
    }

    type Query {
        monsters: [Monster]
    }

    type Mutation{
        addMonster(monster: MonsterInput): String
        updateMonster(nameOfMonsterToUpdate: String, monster: MonsterInput): String
        deleteMonster(name: String): String
    }
`);

let root = { 
    monsters: async () => {
        return await Monster.find();
    },
    addMonster: async (data) => {
        let newMonster = new Monster(data.monster);
        let savedMonster = await newMonster.save();
        return `Monster with name ${savedMonster.name} is added`;
    },
    updateMonster: async (data) => {
        let find = { name: data.nameOfMonsterToUpdate };
        let query = await Monster.update(find, data.monster);
        return `${query.n} monster(s) updated`;
    },
    deleteMonster: async (data) => {
        let query = await Monster.remove({name: data.name});
        return `${query.n} monster(s) deleted`;
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));

module.exports = app;