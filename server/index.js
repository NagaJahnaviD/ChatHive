const exp = require("express");
const app = exp();
const http = require("http").createServer(app); // Create HTTP server
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
app.use(exp.json());

// APIs
const userApp = require('./APIs/userApi');
app.use('/user-api', userApp);
const chatApp = require('./APIs/chatAPI');
app.use('/message-api', chatApp);

// Connect to DB and start server
mongoose.connect("mongodb://localhost:27017/chathive")
  .then(() => {
    http.listen(1234, () => console.log(`Server listening on port 1234...`));
  })
  .catch(err => console.log("Error in DB connection", err));

// Socket.IO setup
const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Listen to client connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send-message', (data) => {
    // Emit the message to recipient
    socket.broadcast.emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// error handler 
app.use((err, req, res, next) => {
  console.log('Error object in express error handler: ', err);
  res.send({ message: err.message });
});
