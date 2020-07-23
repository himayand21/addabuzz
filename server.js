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
let users = [];

app.use(express.static(__dirname + '/build'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

io.on('connection', (socket) => {

    // send all meetings on connection
    io.sockets.emit('update-meetings', meetings);

    // when meeting is created
    socket.on('create-meeting', (name) => {

        const meetingId = shortID.generate();
        const newMeeting = {
            id: meetingId,
            name
        };
        meetings.push(newMeeting);

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
            const meetingUsers = users.filter((each) => {
                return clients.includes(each.id);
            });
            socket.emit('update-participants', meetingUsers);
        });
    });

    // when user joins a meeting
    socket.on('join-meeting', ({meetingId, name}) => {
        socket.join(meetingId);
        users.push({
            name,
            id: socket.id,
            meetingId
        });

        io.in(meetingId).clients((error, clients) => {
            const meetingUsers = users.filter((each) => {
                return clients.includes(each.id);
            });
            io.in(meetingId).emit('update-meeting-users', meetingUsers);
        });
    });

    socket.on('disconnect', () => {
        const {meetingId} = users.find((each) => each.id === socket.id) || {};
        users = users.filter((each) => each.id !== socket.id);
        if (meetingId) {
            socket.leave(meetingId);
            io.in(meetingId).clients((error, clients) => {
                const meetingUsers = users.filter((each) => {
                    return clients.includes(each.id);
                });
                io.in(meetingId).emit('update-meeting-users', meetingUsers);
            });
        }
    });
});

httpServer.listen(PORT, () => {
    console.log('Server is up');
});

module.exports = app;
