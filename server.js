// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ todos: [] })
  .write();

const Todo = db.get('todos');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.send('I love CodersX');
});

app.get('/todos', (req, res) => {
  const q = req.query.q;
  
  if (q) {
    const matchTodos = Todo.filter(todo => {
      return todo.content.toLowerCase()
        .includes(q.toLowerCase());
    }).value();
  
    return res.render('todo/list', {
      todos: matchTodos,
      q: q,
    });  
  }
  
  const todos = Todo.value();
  return res.render('todo/list', {
    todos,
  });
});

app.get('/todos/create', (req, res) => {
  return res.render('todo/create');
});

app.post('/todos/create', (req, res) => {
  const content = req.body.content;
  const todos = db.get('todos');
  const id = todos.length;
  db.get('todos').push({
    id: id,
    content: content,
  }).write();
  return res.redirect('/todos');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
