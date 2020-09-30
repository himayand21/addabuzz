const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const shortID = require('shortid');

const {
    GET_MEETING,
    CREATE_MEETING,
    GET_USERS,
    JOIN_MEETING,
    GOT_MEETING,
    GOT_USERS,
    CREATED_MEETING,
    JOINED_MEETING,
    MEETING_EXPIRED,
    USER_LEFT,
    USER_JOINED,
    MUTE_USER,
    BLIND_USER,
    GET_MUTED_USERS,
    GET_BLINDED_USERS,
    GOT_BLINDED_USERS,
    GOT_MUTED_USERS
} = require('./socket');

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = http.createServer(app);

const io = socketIO(httpServer);

let meetings = [{
    id: 123,
    name: 'Let us meet'
}];
let users = [];
const mutedUsers = {};
const blindedUsers = {};

app.use(express.static(__dirname + '/build'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

io.on('connection', (socket) => {
    // when user needs meeting details on /:meetingId route mount
    socket.on(GET_MEETING, (id) => {
        const meeting = meetings.find((each) => `${each.id}` === `${id}`);
        socket.emit(GOT_MEETING, meeting);
    });

    // when meeting is created
    socket.on(CREATE_MEETING, (name) => {
        // generate new meeting ID
        const meetingId = shortID.generate();
        const newMeeting = {
            id: meetingId,
            name
        };
        meetings.push(newMeeting);

        // notify user with the meeting link
        socket.emit(CREATED_MEETING, newMeeting);

        // expire meeting after 1 day
        setTimeout(() => {
            meetings = meetings.filter(
                (each) => each.id !== meetingId
            );
            users = users.filter((each) => each.meetingId !== meetingId);
            io.sockets.emit(MEETING_EXPIRED, meetingId);
        }, (1000 * 60 * 60 * 24));
    });

    // when user wants list of users who have joined the meeting
    socket.on(GET_USERS, (meetingId) => {
        io.in(meetingId).clients((error, clients) => {
            const meetingUsers = users.filter((each) => {
                return clients.includes(each.id);
            });
            socket.emit(GOT_USERS, meetingUsers);
        });
    });

    // when user mutes oneself
    socket.on(MUTE_USER, ({meetingId, muted}) => {
        if (!mutedUsers[meetingId]) {
            mutedUsers[meetingId] = {};
        }
        if (muted) {
            mutedUsers[meetingId][socket.id] = true;
        } else if (mutedUsers[meetingId][socket.id]) {
            delete mutedUsers[meetingId][socket.id];
        }
        socket.to(meetingId).emit(GOT_MUTED_USERS, mutedUsers[meetingId]);
    });

    // when user blinds oneself
    socket.on(BLIND_USER, ({meetingId, blinded}) => {
        if (!blindedUsers[meetingId]) {
            blindedUsers[meetingId] = {};
        }
        if (blinded) {
            blindedUsers[meetingId][socket.id] = true;
        } else if (blindedUsers[meetingId][socket.id]) {
            delete blindedUsers[meetingId][socket.id];
        }
        socket.to(meetingId).emit(GOT_BLINDED_USERS, blindedUsers[meetingId]);
    });

    // when user asks for muted users
    socket.on(GET_MUTED_USERS, (meetingId) => {
        socket.emit(GOT_MUTED_USERS, mutedUsers[meetingId] || {});
    });

    // when user asks for blinded users
    socket.on(GET_BLINDED_USERS, (meetingId) => {
        socket.emit(GOT_BLINDED_USERS, blindedUsers[meetingId] || {});
    });

    // when user joins a meeting
    socket.on(JOIN_MEETING, ({meetingId, name, muted, blinded}) => {
        socket.join(meetingId);
        users.push({
            name,
            id: socket.id,
            meetingId
        });

        // informing all members in this room that this user has joined
        io.in(meetingId).clients((error, clients) => {
            const meetingUsers = users.filter((each) => {
                return clients.includes(each.id);
            });
            io.in(meetingId).emit(GOT_USERS, meetingUsers);
        });
        io.in(meetingId).emit(USER_JOINED, socket.id);

        // letting all members other than sender know that user has preferred mute / blind
        if (blinded) {
            if (!blindedUsers[meetingId]) {
                blindedUsers[meetingId] = {};
            }
            blindedUsers[meetingId][socket.id] = true;
        }
        if (muted) {
            if (!mutedUsers[meetingId]) {
                mutedUsers[meetingId] = {};
            }
            mutedUsers[meetingId][socket.id] = true;
        }

        // letting this user enter
        socket.emit(JOINED_MEETING, socket.id);
    });

    socket.on('disconnect', () => {
        const {meetingId} = users.find((each) => each.id === socket.id) || {};
        users = users.filter((each) => each.id !== socket.id);
        if (meetingId) {
            socket.leave(meetingId);

            // informing all members in this room that this user has left
            io.in(meetingId).clients((error, clients) => {
                const meetingUsers = users.filter((each) => {
                    return clients.includes(each.id);
                });
                io.in(meetingId).emit(GOT_USERS, meetingUsers);
            });
            io.in(meetingId).emit(USER_LEFT, socket.id);
        }
    });
});

httpServer.listen(PORT, () => {
    console.log('Server is up');
});

module.exports = app;
