// actions
const GET_MEETING = 'get-meeting';
const CREATE_MEETING = 'create-meeting';
const GET_USERS = 'get-users';
const JOIN_MEETING = 'join-meeting';
const MUTE_USER = 'mute-user';
const BLIND_USER = 'blind-user';
const GET_MUTED_USERS = 'get-muted-users';
const GET_BLINDED_USERS = 'get-blinded-users';

// action success response
const GOT_MEETING = 'got-meeting';
const CREATED_MEETING = 'created-meeting';
const GOT_USERS = 'got-users';
const JOINED_MEETING = 'joined-meeting';
const GOT_MUTED_USERS = 'got-muted-users';
const GOT_BLINDED_USERS = 'got-blinded-users';

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
    USER_JOINED,
    MUTE_USER,
    BLIND_USER,
    GOT_MUTED_USERS,
    GOT_BLINDED_USERS,
    GET_BLINDED_USERS,
    GET_MUTED_USERS
};
