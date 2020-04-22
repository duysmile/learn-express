// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const todos = [
  {id: 1, content: 'Ăn'},
  {id: 2, content: 'Ngủ'},
  {id: 3, content: 'Code'},
];

app.set('view engine', 'pug');
app.set('views', './views');

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.send('I love CodersX');
});

app.get('/todos', (req, res) => {
  const q = req.query.q;
  if (q) {
    const matchTodos = todos.filter(todo => {
      return todo.content.toLowerCase()
        .includes(q.toLowerCase());
    });
  
    return res.render('todo/list', {
      todos: matchTodos,
      q: q,
    });  
  }
  
  return res.render('todo/list', {
    todos,
  });
});

app.get('/todos/create', (req, res) => {
  return res.render('todo/create');
});

app.post('/todos/create', (req, res) => {
  const content = req.body.content;
  const id = todos.length;
  todos.push({
    id: id,
    content: content,
  });
  return res.redirect('/todos');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
