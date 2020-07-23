const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const shortID = require('shortid');

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

let meetings = [];
const users = {};

app.use(express.static(__dirname + '/build'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

io.on('connection', (socket) => {

    console.info('Connection established');

    // const existingSocket = activeUsers.find(
    //     (each) => each === socket.id
    // );

    // if (!existingSocket) {
    //     activeUsers.push(socket.id);
    //     socket.broadcast.emit('update-user-list', {
    //         users: activeUsers
    //     });
    // }

    // send all meetings on connection
    io.sockets.emit('update-meetings', meetings);

    // when meeting is created
    socket.on('create-meeting', (name) => {

        console.info('Create meeting called');

        const meetingId = shortID.generate();

        const newMeeting = {
            id: meetingId,
            name
        };

        meetings.push(newMeeting);
        users[meetingId] = [];

        // to create new routes in application
        io.sockets.emit('update-meetings', meetings);

        // to notify user with the meeting link
        socket.emit('create-meeting-success', newMeeting);

        // to remove meeting route after 1 hour
        setTimeout(() => {
            meetings = meetings.filter(
                (each) => each.id !== meetingId
            );
            io.sockets.emit('update-meetings', meetings);
        }, (1000 * 60 * 60));
    });

    // when user wants list of users who have joined the meeting
    socket.on('get-participants', (meetingId) => {
        io.in(meetingId).clients((error, clients) => {
            socket.emit('update-participants', clients);
        });
    });

    // when user joins a meeting
    socket.on('join-meeting', ({meetingId, name}) => {
        socket.join(meetingId);
        users[meetingId].push({
            name,
            id: socket.id
        });
        const meetingUsers = users[meetingId];

        console.log(meetingUsers);
        io.in(meetingId).emit('update-participants', meetingUsers);
    });

    socket.on('disconnect', () => {

        console.info('Connection lost');
        // activeUsers = activeUsers.filter(
        //     (each) => each !== socket.id
        // );
        // socket.broadcast.emit('update-user-list', {
        //     users: activeUsers
        // });
    });
});

httpServer.listen(PORT, () => {
    console.log('Server is up');
});

module.exports = app;
