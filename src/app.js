const express = require('express');

function createApp() {
  const app = express();
  app.use(express.json());

  let tasks = [];
  let nextId = 1;

  app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
  });

  app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required' });
    }
    const task = { id: nextId++, title: title.trim(), completed: false };
    tasks.push(task);
    res.status(201).json(task);
  });

  app.patch('/tasks/:id/complete', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }
    task.completed = true;
    res.status(200).json(task);
  });

  app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'task not found' });
    }
    tasks.splice(index, 1);
    res.status(204).send();
  });

  app._reset = () => {
    tasks = [];
    nextId = 1;
  };

  return app;
}

module.exports = createApp;
