const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();


const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const db = require('./config/MongoConfig.js')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

const server = http.createServer(app);
const io = socketIO(server);


const AdminRouter = require('./Routers/AdminRouter.js');
startRoutes();
 

let port = process.env.PORT || 2123;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


function startRoutes(){
  app.use('/',AdminRouter);
}