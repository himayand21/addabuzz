// actions
const GET_MEETING = 'get-meeting';
const CREATE_MEETING = 'create-meeting';
const GET_USERS = 'get-users';
const JOIN_MEETING = 'join-meeting';

// action success response
const GOT_MEETING = 'got-meeting';
const CREATED_MEETING = 'created-meeting';
const GOT_USERS = 'got-users';
const JOINED_MEETING = 'joined-meeting';

// action side effects
const MEETING_EXPIRED = 'meeting-expired';
const USER_LEFT = 'user-left';
const USER_JOINED = 'user-joined';

module.exports = {
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
    USER_JOINED
};
