import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {USER_LEFT, GET_BLINDED_USERS, GET_MUTED_USERS, GOT_BLINDED_USERS, GOT_MUTED_USERS} from '../../socket';

import {tablet, desktop} from '../constants/media';
import {fadedBackgroundBlack} from '../constants/colors';

import {SocketContext} from '../context';
import {You} from '../components/You';
import {Me} from '../sections/Me';

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
            setStreams((oldStreams) => {
                // eslint-disable-next-line no-unused-vars
                const {[userId]: userStream, ...rest} = oldStreams;
                return rest;
            });
        });
        socket.on(GOT_MUTED_USERS, (tempUsers) => {
            setMutedUsers(tempUsers);
        });
        socket.on(GOT_BLINDED_USERS, (tempUsers) => {
            setBlindedUsers(tempUsers);
        });
    }, []);

    const remoteStreamsExist = Boolean(Object.keys(streams).length);

    return (
        <MeetingWrapper>
            {remoteStreamsExist && (
                <Opacify />
            )}
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
        </MeetingWrapper>
    );
};

Meeting.propTypes = {
    users: PropTypes.array,
    id: PropTypes.string,
    meetingId: PropTypes.number
};

const MeetingWrapper = styled.div`
    display: flex;
    position: fixed;
    left: 0px;
    bottom: 80px;
    padding: 10px;
    align-items: center;
    justify-content: flex-start;
    max-width: 100vw;
    overflow: auto;
    box-sizing: border-box;
    @media only screen and (min-width: ${tablet}) {
        bottom: 100px;
        padding: 15px;
    }
    @media only screen and (min-width: ${desktop}) {
        bottom: unset;
        left: unset;
        right: 0px;
        flex-direction: column;
        max-width: unset;
        min-width: 330px;
        max-height: calc(100vh - 100px);
    }
`;

const Opacify = styled.div`
    position: fixed;
    left: 0px;
    bottom: 80px;
    max-height: 197px;
    min-height: 197px;
    max-width: 100vw;
    min-width: 100vw;
    background-color: ${fadedBackgroundBlack};
    z-index: 3;
    @media only screen and (min-width: ${tablet}) {
        max-height: 237px;
        min-height: 237px;
        bottom: 100px;
    }
    @media only screen and (min-width: ${desktop}) {
        max-width: 330px;
        min-width: 330px;
        max-height: calc(100vh - 100px);
        min-height: calc(100vh - 100px);
        right: 0px;
        top: 0px;
        left: unset;
        bottom: unset;
    }
`;