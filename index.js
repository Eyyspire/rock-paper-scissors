import http from 'http'
import RequestController from './controllers/requestController.js';
import { Server as ServerIO } from 'socket.io';
import IOController from './controllers/IOController.js';


const server = http.createServer(
    (request, response) => new RequestController(request,response).handleRequest())

const io = new ServerIO(server);
const iocontroller = new IOController(io);
io.on('connection', socket => {
    iocontroller.registerSocket(socket);
}); 


server.listen(8080)