require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');
const todoFilePath = process.env.BASE_JSON_PATH;
const today = new Date();


//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  
  res.header("Content-Type", "text/html");
  res.sendFile("./public/index.html", { root: __dirname });
  
  res.status(200);
});

app.get('/todos', (_, res) => {
  
  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });
  
  res.status(200).send(todos);
});



//Add GET request with path '/todos/overdue'
const overdueTodos = [];
todos.forEach(function (element){
  if ( new Date (element.due) < today) {
    overdueTodos.push(element)
  }
})

app.get('/todos/overdue', (_, res) => { 

  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  res.status(200).send(overdueTodos);
}) ;

//Add GET request with path '/todos/completed'
const completedTodos = [];
todos.forEach(function (element){
  if (element.completed = true ) {
    completedTodos.push(element)
  }

})

app.get('/todos/completed', (_, res) => { 

  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  res.status(200).send(completedTodos);
}) ;

//Add POST request with path '/todos'

app.post('/todos', (_, res) => { 
  const oneNewTodo= {
      "id"    : todos.length + 1,
    "name" : 'Turn on central heating',
    "created" : "2021-10-20T18:25:43.511Z",
     "due": new Date,
     "completed" : true
  };
  todos.push(oneNewTodo)
 if (!_.body.due){
   return res.status(400).end();
 }
 
  res.header("Content-Type","application/json");
  fs.writeFile(__dirname + process.env.BASE_JSON_PATH,  JSON.stringify(todos), err => {
   
    if (err) {
      console.error(err)
      return
    }

 res.status(201).send(todos);
 })});

//Add PATCH request with path '/todos/:id

// app.patch('todos/:id', (_,res) => {

// })

//Add POST request with path '/todos/:id/complete

app.post('/todos/:id/complete', (_, res) => { 
  
 if (todos.completed =true){
   return res.status(400).end();
 }
 
  res.header("Content-Type","application/json");
  fs.writeFile(__dirname + process.env.BASE_JSON_PATH,  JSON.stringify(todos), err => {
   
    if (err) {
      console.error(err)
      return
    }

 res.status(200).send(completedTodos);
 })});

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id


app.listen(port, function () {
    console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;