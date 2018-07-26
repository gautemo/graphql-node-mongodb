# GraphQL MongoDB Node.js Guide
This is a minimalistic guide of how to create a CRUD application with GraphQL, MongoDB, mongoose, Node.js and Express

### Prerequisites
[Node](https://nodejs.org/en/download/)

## Guide

This is a guide/tutorial/walkthrough. See this links for more information about the subjects, [GraphQL](https://graphql.org/learn/), [MongoDB](https://docs.mongodb.com/), [Mongoose](http://mongoosejs.com/), [Node.js](https://nodejs.org/en/docs/guides/) and [Express](https://expressjs.com/)

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

### Webpage
* Add a public folder
```
- public
    - index.html
    - controller.js
```
* Add `app.use(express.static('public'));` and change `app.get('/', (req, res) => res.send('Hello World!'));` with `app.get('/', (req, res) => res.render('index'));`
* Now when you run `npm start` you will find your html page on `localhost:3000/`
* How to get all monsters
```
const url = '/graphql?query={monsters{name,color}}';
fetch(url)
.then(data=>{return data.json()})
.then(res=>{
    console.log(res.data);
});
```
* How to send POST request for mutations
```
function sendGraphPostRequest(query, variables, callback){
    const url = '/graphql';
    const data = {
        query: query,
        variables: variables
    }
    const otherParam = {
        headers:{
            'content-type': 'application/json; charset=UTF-8'
        },
        body:JSON.stringify(data),
        method: 'POST'
    };
    fetch(url, otherParam)
    .then(data=>{return data.json()})
    .then(res=>{callback(res)})
    .then(error=>console.log(error));       
}
```
```
const variables = {
    monster:{
        name: name,
        color: color
    }
};
const query = `mutation AddMonster($monster: MonsterInput){
    addMonster(monster: $monster)
}`;
sendGraphPostRequest(query, variables, function(res){
    let history = document.getElementById('add-res').innerHTML;
    document.getElementById('add-res').innerHTML = history + '\n' + res.data.addMonster;
}); 
```
```
const variables = {
    nameOfMonsterToUpdate: oldName,
    monster:{
        name: newName ? newName : undefined,
        color: color ? color : undefined 
    }
};
const query = `mutation UpdateMonster($nameOfMonsterToUpdate: String, $monster: MonsterInput){
    updateMonster(nameOfMonsterToUpdate: $nameOfMonsterToUpdate, monster: $monster)
}`;
sendGraphPostRequest(query, variables, function(res){
    let history = document.getElementById('update-res').innerHTML;
    document.getElementById('update-res').innerHTML = history + '\n' + res.data.updateMonster;
}); 
```
```
const variables = {
    name: name
};
const query = `mutation DeleteMonster($name: String){
    deleteMonster(name: $name)
}`;
sendGraphPostRequest(query, variables, function(res){
    let history = document.getElementById('delete-res').innerHTML;
    document.getElementById('delete-res').innerHTML = history + '\n' + res.data.deleteMonster;
});
```

### And that is all
* Feel free to clone project to see the code in action (needs mongodb connection)
`git clone https://github.com/gautemo/graphql-node-mongodb.git`
* See [commit history](https://github.com/gautemo/graphql-node-mongodb/commits/master) to see progress of the steps above, instead of end result

## Authors

* **Gaute Meek Olsen** - [Twitter](https://twitter.com/GauteMeekOlsen)