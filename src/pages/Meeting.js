import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
    USER_LEFT,
    GET_BLINDED_USERS,
    GET_MUTED_USERS,
    GOT_BLINDED_USERS,
    GOT_MUTED_USERS,
    LEAVE_MEETING,
    GOT_USERS,
    GET_USERS
} from '../../socket';

import {tablet, desktop} from '../constants/media';
import {fadedBackgroundBlack} from '../constants/colors';

import {SocketContext} from '../context';
import {You} from '../components/You';
import {Me} from '../sections/Me';

export const Meeting = (props) => {
    const [streams, setStreams] = useState({});
    const [mutedUsers, setMutedUsers] = useState({});
    const [blindedUsers, setBlindedUsers] = useState({});
    const [pinned, setPinned] = useState();
    const [users, setUsers] = useState([]);

    const socket = useContext(SocketContext);

    const {id, meetingId, name, ...otherProps} = props;

    useEffect(() => {
        setPinned(id);
        socket.emit(GET_USERS, meetingId);
        socket.emit(GET_MUTED_USERS, meetingId);
        socket.emit(GET_BLINDED_USERS, meetingId);
        socket.on(USER_LEFT, (userId) => {
            setStreams((oldStreams) => {
                // eslint-disable-next-line no-unused-vars
                const {[userId]: userStream, ...rest} = oldStreams;
                return rest;
            });
        });
        socket.on(GOT_USERS, (tempUsers) => {
            setUsers(tempUsers);
        });
        socket.on(GOT_MUTED_USERS, (tempUsers) => {
            setMutedUsers(tempUsers);
        });
        socket.on(GOT_BLINDED_USERS, (tempUsers) => {
            setBlindedUsers(tempUsers);
        });
    }, []);

    const leaveMeeting = () => {
        socket.emit(LEAVE_MEETING);
        setStreams({});
    };

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
                    meetingId,
                    leaveMeeting,
                    isPinned: pinned === id,
                    name,
                    pinVideo: () => setPinned(id)
                }}
            />
            {Object.entries(streams).map(([userId, stream]) => {
                const muted = mutedUsers[userId];
                const blinded = blindedUsers[userId];
                return (
                    <You
                        key={userId}
                        stream={stream}
                        userName={users.find((each) => each.id === userId)?.name}
                        muted={muted}
                        blinded={blinded}
                        isPinned={pinned === userId}
                        pinVideo={() => setPinned(userId)}
                    />
                );
            })}
        </MeetingWrapper>
    );
};

Meeting.propTypes = {
    users: PropTypes.array,
    id: PropTypes.string,
    meetingId: PropTypes.number,
    name: PropTypes.string
};

const MeetingWrapper = styled.div`
    &::-webkit-scrollbar {
        display: none
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
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
    max-height: 227px;
    min-height: 227px;
    max-width: 100vw;
    min-width: 100vw;
    background-color: ${fadedBackgroundBlack};
    z-index: 3;
    @media only screen and (min-width: ${tablet}) {
        max-height: 287px;
        min-height: 287px;
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