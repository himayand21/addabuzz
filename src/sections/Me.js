import React, {useRef, useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Peer from 'peerjs';

import {USER_JOINED, MUTE_USER, BLIND_USER} from '../../socket';

import {failedToLoad} from '../constants/strings';
import {tablet, desktop} from '../constants/media';

import {SocketContext} from '../context';

import {Progress} from '../components/Progress';
import {Mute, Blind, Hangup} from '../components/IconButtons';

import {BigVideoWrapper, BigVideo} from '../wrappers/BigVideo';
import {IntroVideoWrapper, IntroVideo} from '../wrappers/IntroVideo';
import {FixedActionButtons, IntroActionButtons} from '../wrappers/ActionButtons';
import {ReadOnlyWrapper, ReadOnlyButtons, MuteReadOnly, BlindReadOnly} from '../wrappers/ReadOnlyButtons';

export const Me = (props) => {
    const [error, setError] = useState(false);
    const [volume, setVolume] = useState(0);
    const [localStream, setLocalStream] = useState();

    const {muted, setMuted, blinded, setBlinded, peerProps, setCameraError} = props;

    const ref = useRef(null);

    const socket = useContext(SocketContext);

    const streamConstraints = {
        video: {
            facingMode: 'user',
            aspectRatio: {
                ideal: 1.7777777778
            },
            width: {
                min: 640,
                ideal: 1920
            },
            height: {
                min: 400,
                ideal: 1080
            },
            frameRate: {
                max: 30
            }
        },
        audio: true
    };

    useEffect(() => {
        startStream();
        if (peerProps) {
            return (() => {
                socket.off(USER_JOINED);
            });
        }
    }, []);

    useEffect(() => {
        if (localStream) {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(localStream);
            const processor = audioContext.createScriptProcessor(256);
            processor.onaudioprocess = processAudio;
            processor.connect(audioContext.destination);
            source.connect(processor);
        }
    }, [localStream]);

    const startStream = () => {
        navigator
            .mediaDevices
            .getUserMedia(streamConstraints)
            .then((stream) => {
                stream.getVideoTracks()[0].enabled = !blinded;
                stream.getAudioTracks()[0].enabled = !muted;
                setLocalStream(stream);
                if (peerProps) {
                    const {id, setStreams} = peerProps;
                    const isProd = process.env.NODE_ENV === 'production';
                    const prodPort = location.port || (location.protocol === 'https:' ? 443 : 80);
                    const devPort = 5000;
                    const port = isProd ? prodPort : devPort;
                    const options = {
                        host: location.hostname,
                        port,
                        path: '/peer'
                    };
                    const peer = new Peer(id, options);
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
                } else {
                    setCameraError(false);
                }
            })
            .catch((err) => {
                console.log('navigator.getUserMedia error: ', err);
                setError(true);
                if (!peerProps) {
                    setCameraError(true);
                }
            });
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = localStream;
        }
    }, [localStream]);

    const toggleMuted = () => {
        if (muted) {
            setMuted(false);
            localStream.getAudioTracks()[0].enabled = true;
        } else {
            setMuted(true);
            localStream.getAudioTracks()[0].enabled = false;
        }
        if (peerProps) {
            const {meetingId} = peerProps;
            socket.emit(MUTE_USER, {
                meetingId,
                muted: !muted
            });
        }
    };

    const toggleBlinded = () => {
        if (blinded) {
            setBlinded(false);
            localStream.getVideoTracks()[0].enabled = true;
        } else {
            setBlinded(true);
            localStream.getVideoTracks()[0].enabled = false;
        }
        if (peerProps) {
            const {meetingId} = peerProps;
            socket.emit(BLIND_USER, {
                meetingId,
                blinded: !blinded
            });
        }
    };

    const processAudio = (event) => {
        const buffer = event.inputBuffer.getChannelData(0);
        const sum = buffer.reduce((acc, curr) => acc + (curr * curr));
        const rms = Math.sqrt(sum / buffer.length);
        if (!isNaN(rms)) {
            const newVolume = Math.floor(Math.ceil(rms * 1000) / 20);
            if (volume !== newVolume && newVolume <= 25) {
                setVolume(newVolume);
            }
        }
    };

    const isBig = Boolean(peerProps);

    const VideoWrapper = isBig ? BigVideoWrapper : IntroVideoWrapper;
    const Video = isBig ? BigVideo : IntroVideo;
    const ActionButtons = peerProps ? FixedActionButtons : IntroActionButtons;

    return (
        <VideoWrapper>
            <ReadOnlyWrapper isBig={isBig}>
                {(error || muted) ? null : (
                    <Progress volume={volume} />
                )}
                {peerProps && (
                    <ReadOnlyButtons isBig={isBig}>
                        {muted && <MuteReadOnly />}
                        {blinded && <BlindReadOnly />}
                    </ReadOnlyButtons>
                )}
            </ReadOnlyWrapper>
            <ActionButtons inMeeting={isBig}>
                <Mute onClick={toggleMuted} muted={muted} />
                {peerProps && <Hangup onClick={peerProps.leaveMeeting} />}
                <Blind onClick={toggleBlinded} blinded={blinded} />
            </ActionButtons>
            <Video
                autoPlay
                muted
                ref={ref}
            />
            {error && (
                <Message>{failedToLoad}</Message>
            )}
        </VideoWrapper>
    );
};

Me.propTypes = {
    muted: PropTypes.bool,
    blinded: PropTypes.bool,
    setMuted: PropTypes.func,
    setBlinded: PropTypes.func,
    peerProps: PropTypes.object,
    setCameraError: PropTypes.func
};

const Message = styled.div`
    position: absolute;
    top: 15px;
    left: 0px;
    width: 100%;
    color: white;
    font-weight: 500;
    text-align: center;
    font-size: 14px;
    @media only screen and (min-width: ${tablet}) {
        top: 20px;
        font-size: 16px;
    }
    @media only screen and (min-width: ${desktop}) {
        top: 25px;
        font-size: 18px;
    }
`;
