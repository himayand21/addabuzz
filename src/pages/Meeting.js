import React, {useEffect, useRef, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import Peer from 'peerjs';

import {USER_LEFT, USER_JOINED} from '../../socket';

import {SocketContext} from '../context';
import {You} from '../components/You';

export const Meeting = (props) => {
    const ref = useRef(null);
    const [streams, setStreams] = useState({});

    const socket = useContext(SocketContext);

    const {users, id} = props;

    useEffect(() => {
        const peer = new Peer(id);
        const streamConstraints = {
            video: {
                facingMode: 'user'
            },
            audio: true
        };
        const localVideo = ref.current;

        socket.on(USER_LEFT, (userId) => {
            // eslint-disable-next-line no-unused-vars
            const {[userId]: userStream, ...rest} = streams;
            setStreams(rest);
        });

        navigator
            .mediaDevices
            .getUserMedia(streamConstraints)
            .then((stream) => {
                localVideo.srcObject = stream;
                peer.on('call', (call) => {
                    call.answer(stream);
                    call.on('stream', (userVideoStream) => {
                        setStreams((oldStreams) => ({
                            ...oldStreams,
                            [call.peer]: userVideoStream
                        }));
                    });
                });
                socket.on(USER_JOINED, (userId) => {
                    const call = peer.call(userId, stream);
                    call.on('stream', (userVideoStream) => {
                        setStreams((oldStreams) => ({
                            ...oldStreams,
                            [userId]: userVideoStream
                        }));
                    });
                    call.on('close', () => {
                        setStreams((oldStreams) => {
                            // eslint-disable-next-line no-unused-vars
                            const {[userId]: userStream, ...rest} = oldStreams;
                            return rest;
                        });
                    });
                });
            })
            .catch((error) => {
                console.log('navigator.getUserMedia error: ', error);
            });
    }, []);

    return (
        <>
            <video
                autoPlay
                muted
                ref={ref}
            />
            {Object.entries(streams).map(([userId, stream]) => (
                <You
                    key={userId}
                    stream={stream}
                    users={users}
                />
            ))}
        </>
    );
};

Meeting.propTypes = {
    users: PropTypes.array,
    id: PropTypes.string
};