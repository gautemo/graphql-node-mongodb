# GraphQL MongoDB Node.js Tutorial
This is a minimalistic tutorial of how to create a CRUD application with GraphQL, MongoDB, mongoose, NodeJS and Express

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

### MongoDB
* Install [MongoDB](https://www.mongodb.org/downloads)
  - Alternativly you could host your database on [mLab](https://mlab.com/)
* Add MongoDB to your environment variable path
  - [Example](https://dangphongvanthanh.wordpress.com/2017/06/12/add-mongos-bin-folder-to-the-path-environment-variable/)
* Open a new terminal and run `mongod --dbpath=/data`
* Add `const mongodbUrl = 'mongodb://localhost:27017/monsters';` to index.js

### Mongoose
* `npm install mongoose --save`
* Add this to index.js
```
const mongoose = require('mongoose');
```
```
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

let MonsterModel = mongoose.model('Monster', monsterDbSchema);
```

### GraphQL and Mongoose 
* To query your monsters change the monster function in root to
```
monsters: async () => {
    return await Monster.find();
}
```
* To add, update and delete monsters we need to update our schema and our root
```
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
```
```
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
```

### Time to clean up index.js and add some project structure
* How I structured the project
```
- index.js
- mongodb
    - monsterModel.js
- graphql
    - schema.js
    - root.js
```
* Then copied the code from index.js into their files and exported with `module.exports = root;` and imported with `const root = require('./graphql/root.js');` (for all 3 files)

## Authors

* **Gaute Meek Olsen** - [Twitter](https://twitter.com/GauteMeekOlsen)