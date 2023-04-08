const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeave, getUsers, formatMessageFirst,
    formatMessageSecond, chatHistory } = require('./other');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'front')));

//run when client connects
io.on('connection', socket => {
    //catch the join room from chatapp.js
    socket.on('joinRoom', ({ username, color }) => {
        //get value for user using id
        const user = userJoin(socket.id, username, color);
        //update the user who just joined to the list of users
        io.emit('chatUsers', {
            users: getUsers()
        })
        //show all messages based on the user chat history before you joined
        for (var i = 0; i < chatHistory.length; i++) {
            //emit messages to just you, based on the index of the message
            socket.emit('otherMessage', chatHistory.at(i));
        }
    })
    //listen for chatMessage
    socket.on('chatMessage', msg => {
        //get value for user using id
        const user = getCurrentUser(socket.id);
        //show message just for you 
        socket.emit('yourMessage', formatMessageFirst(user.username, msg));
        //show message for everyone but you
        socket.broadcast.emit('otherMessage', formatMessageSecond(user.username, msg));
    });

    //runs when client disconnects
    socket.on('disconnect', () => {
        //update the user
        const user = userLeave(socket.id);

        if (user) {
            //update who the users are remaining
            io.emit('chatUsers', {
                users: getUsers()
            })
        }
    });
})
//listen to the server at port 3000
server.listen(
    3000,
    () => console.log('Server is running on PORT 3000, enter \'http://localhost:3000\' to web browser')
);
//for all clients
//io.emit
//for just you 
//socket.emit
//for everyone except you 
//socket.broadcast.emit