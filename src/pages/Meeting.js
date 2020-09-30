import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';

import {USER_LEFT, GET_BLINDED_USERS, GET_MUTED_USERS, GOT_BLINDED_USERS, GOT_MUTED_USERS} from '../../socket';

import {SocketContext} from '../context';
import {You} from '../components/You';
import {Me} from '../components/Me';

export const Meeting = (props) => {
    const [streams, setStreams] = useState({});
    const [mutedUsers, setMutedUsers] = useState({});
    const [blindedUsers, setBlindedUsers] = useState({});

    const socket = useContext(SocketContext);

    const {users, id, meetingId, ...otherProps} = props;

    useEffect(() => {
        socket.emit(GET_MUTED_USERS, meetingId);
        socket.emit(GET_BLINDED_USERS, meetingId);
        socket.on(USER_LEFT, (userId) => {
            // eslint-disable-next-line no-unused-vars
            const {[userId]: userStream, ...rest} = streams;
            setStreams(rest);
        });
        socket.on(GOT_MUTED_USERS, (tempUsers) => {
            setMutedUsers(tempUsers);
        });
        socket.on(GOT_BLINDED_USERS, (tempUsers) => {
            setBlindedUsers(tempUsers);
        });
    }, []);

    return (
        <>
            <Me
                {...otherProps}
                peerProps={{
                    id,
                    setStreams,
                    meetingId
                }}
            />
            {Object.entries(streams).map(([userId, stream]) => {
                const muted = mutedUsers[userId];
                const blinded = blindedUsers[userId];
                return (
                    <You
                        key={userId}
                        stream={stream}
                        users={users}
                        muted={muted}
                        blinded={blinded}
                    />
                );
            })}
        </>
    );
};

Meeting.propTypes = {
    users: PropTypes.array,
    id: PropTypes.string,
    meetingId: PropTypes.string
};