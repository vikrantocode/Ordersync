const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const mainRoutes = require("./Routes/MainRouter");

const customerRoutes = require("./Routes/CustomerRouter");

const userRoutes = require("./Routes/UserRouter");
const OrderimportSync = require("./Routes/OrderSync")  // Order import sync Route
const server = http.createServer(app);
require("dotenv").config();
app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {
  console.log("Client Connected");
  socket.on("ping", (msg) => {
    socket.emit("pong", "Hello From Server!");
  });
});

/****

server.listen(5000, () => {
  console.log('listening on *:5000');
});
*/

const port = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use("/api/customers", customerRoutes);
app.use("/api/manage/users", userRoutes);

app.use("/api", mainRoutes);
app.use('/', OrderimportSync) // Order import sync Route 

server.listen(port, () => console.log(`App is running on  ${port}!`));
const db = require("./config/database.js");
const { add } = require("lodash");

db.authenticate()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
