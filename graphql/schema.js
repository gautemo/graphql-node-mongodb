const { buildSchema } = require('graphql');

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

module.exports = schema;