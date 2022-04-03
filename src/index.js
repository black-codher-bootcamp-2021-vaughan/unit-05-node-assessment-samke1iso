require('dotenv').config();
const fs = require('fs');
const express = require('express');
// app.use(express.json());
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const todoFilePath = process.env.BASE_JSON_PATH;
const today = new Date;


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
  console.log(completedTodos)
})

app.get('/todos/completed', (_, res) => { 

  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  res.status(200).send(completedTodos);
}) ;

//Add POST request with path '/todos'



//Add PATCH request with path '/todos/:id

//Add POST request with path '/todos/:id/complete

// app.post()
//Add POST request with path '/todos/:id/undo

// app.post()
//Add DELETE request with path '/todos/:id

// app.delete()


app.listen(port, function () {
    console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;