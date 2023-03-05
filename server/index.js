const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const User = require('./models/User');
const Post = require('./models/Post');


const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

mongoose.connect(process.env.CONNECTION_URL);

app.post('/register', async (req, res) => {
  const { username, password, type } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      type,
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id, type: userDoc.type }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id: userDoc._id,
          username,
          type: userDoc.type
        });
      });
    } else {
      res.status(400).json('Wrong Credentials');
    }
  }
  catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.get('/profile', (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', async (req, res) => {

  try {
    const { token } = req.cookies;
    const { title, summary } = req.body;

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const postDoc = await Post.create({
        title,
        summary,
        author: info.id,
      });
      res.json(postDoc);
    });
  }
  catch (e) {
    console.log(e);
    res.status(400).json(e);
  }

});

app.put('/post', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.update({
        title,
        summary,
      });

      res.json(postDoc);
    });
  }
  catch (e) {
    console.log(e);
    res.status(400).json(e);
  }

});

app.delete('/post', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.delete();

      res.json(postDoc);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }

});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.listen(4000, () => console.log(`Server is running successfully on PORT4000`));