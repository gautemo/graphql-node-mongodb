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

## Authors

* **Gaute Meek Olsen** - [Twitter](https://twitter.com/GauteMeekOlsen)