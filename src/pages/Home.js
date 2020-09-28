import React, {useState, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';

import {GET_MEETING, GOT_MEETING, MEETING_EXPIRED} from '../../socket';

import {SocketContext} from '../context';

import {Join} from './Join';

export const Home = () => {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expired, setExpired] = useState(false);

    const {meetingId} = useParams();

    const socket = useContext(SocketContext);

    useEffect(() => {
        if (meetingId) {
            socket.emit(GET_MEETING, meetingId);
            setLoading(true);
        }
    }, [meetingId]);

    useEffect(() => {
        socket.on(GOT_MEETING, (gotMeeting) => {
            setMeeting(gotMeeting);
            setLoading(false);
        });
        socket.on(MEETING_EXPIRED, (id) => {
            if (id === meetingId) {
                setExpired(true);
            }
        });
    }, []);

    if (!meetingId) return <div>Wrong Route</div>;
    if (loading) return <div>Loading</div>;
    if (!meeting) return <div>Meeting does not exist</div>;
    if (expired) return <div>Meeting has expired</div>;

    return (
        <Join
            meeting={meeting}
        />
    );
};

Home.propTypes = {
    meetings: PropTypes.array,
    loading: PropTypes.bool
};