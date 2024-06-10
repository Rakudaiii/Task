// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const port = 3001;

const creds = {
  username: "arthur",
  password: "L6BZ2m94u3xxum9B"
}

// Подключение к MongoDB

mongoose.connect(
	`mongodb+srv://${creds.username}:${creds.password}@cluster.lb7dgmh.mongodb.net/?retryWrites=true&w=majority&appName=cluster`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Создание схемы и модели пользователя
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  id: Number
});

const User = mongoose.model('User', userSchema);

const Post = mongoose.model('Post', postSchema)

// Настройка body-parser для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

app.use(bodyParser.json())

// Обработка POST-запроса с данными формы
app.post('/register', async (req, res) => {
  const { username, password } = req.body

  const newUser = new User({
    username: username,
    password: password,
  });


  try {
    data = await newUser.save()
    res.send(true);
  } catch (e) {
    res.send('User registered successfully.');
  }
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params

  const post = await Post.findOne({ id })

  const user = await User.find()
  const postResponse = {
    user: user[user.length - 1],
    post: null
  }

  if (!post) {
    const newPost = new Post({
      id: 1,
      title: "Заголовок статьи",
      description: "Описание"
    })

    try {
      data = await newPost.save()
      postResponse.post = newPost


      res.send(postResponse);
    } catch (e) {
      console.log(e)
      res.send(false);
    }

    return
  }

  postResponse.post = post
  res.send(postResponse)
});

app.patch('/post/:id', async (req, res) => {
  const { id } = req.params
  const { title, description, author } = req.body

  try {
    await Post.findOneAndUpdate({ id }, { title, description, author }, { upsert: true })

    res.send(true)
  } catch (e) {
    console.log(e)
    res.send(false)
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
