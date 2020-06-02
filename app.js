const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { MONGOURI } = require('./keys');
const User = require('./models/user');
const authRouter = require('./routes/auth');

app.use(express.json());
app.use(authRouter);

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('Connected to Mongo'));
mongoose.connection.on('error', () => console.log('Error connecting to Mongo'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started at localhost:${PORT}`))