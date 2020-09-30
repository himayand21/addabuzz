import React, {useRef, useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Peer from 'peerjs';

import {USER_JOINED, MUTE_USER, BLIND_USER} from '../../socket';

import {failedToLoad} from '../constants/strings';
import {tablet, desktop} from '../constants/media';
import {yellow, fadedYellow, fadedIconYellow, backgroundBlack, yellowHover} from '../constants/colors';

import micOn from '../assets/mic_on.svg';
import micOff from '../assets/mic_off.svg';
import videoOn from '../assets/video_on.svg';
import videoOff from '../assets/video_off.svg';
import hangUp from '../assets/hang_up.svg';

import {SocketContext} from '../context';
import {YourVideoWrapper, YourVideo} from './You';

export const Progress = (props) => {
    const {volume} = props;
    return (
        <ProgressContainer>
            <ProgressBar
                style={{transform: `scaleX(${(volume / 25)})`}}
            />
        </ProgressContainer>
    );
};

Progress.propTypes = {
    volume: PropTypes.number
};

const Hangup = (props) => {
    return (
        <HangupButton {...props}>
            <Icon src={hangUp} />
        </HangupButton>
    );
};

const Mute = (props) => {
    const {muted, ...otherProps} = props;
    return (
        <IconButton active={!muted} {...otherProps}>
            <Icon src={muted ? micOff : micOn} />
        </IconButton>
    );
};

Mute.propTypes = {
    muted: PropTypes.bool
};

const Blind = (props) => {
    const {blinded, ...otherProps} = props;
    return (
        <IconButton active={!blinded} {...otherProps}>
            <Icon src={blinded ? videoOff : videoOn} />
        </IconButton>
    );
};

Blind.propTypes = {
    blinded: PropTypes.bool
};

export const Me = (props) => {
    const [error, setError] = useState(false);
    const [volume, setVolume] = useState(0);
    const [localStream, setLocalStream] = useState();
    const [peer, setPeer] = useState();

    const {muted, setMuted, blinded, setBlinded, peerProps} = props;

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
        if (peerProps) {
            const {id} = peerProps;
            const createdPeer = new Peer(id);
            setPeer(createdPeer);
        } else {
            setStream();
        }
    }, []);

    useEffect(() => {
        if (peer) {
            setStream();
        }
    }, [peer]);

    useEffect(() => {
        if (peer && localStream) {
            const {setStreams} = peerProps;
            peer.on('call', (call) => {
                call.answer(localStream);
                call.on('stream', (userVideoStream) => {
                    setStreams((oldStreams) => ({
                        ...oldStreams,
                        [call.peer]: userVideoStream
                    }));
                });
            });
            socket.on(USER_JOINED, (userId) => {
                const call = peer.call(userId, localStream);
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
        }
    }, [peer, localStream]);

    useEffect(() => {
        if (localStream && !muted) {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(localStream);
            const processor = audioContext.createScriptProcessor(256);
            processor.onaudioprocess = processAudio;
            processor.connect(audioContext.destination);
            source.connect(processor);
        }
    }, [localStream]);

    const setStream = () => {
        navigator
            .mediaDevices
            .getUserMedia(streamConstraints)
            .then((stream) => {
                stream.getVideoTracks()[0].enabled = !blinded;
                stream.getAudioTracks()[0].enabled = !muted;
                setLocalStream(stream);
            })
            .catch((err) => {
                console.log('navigator.getUserMedia error: ', err);
                setError(true);
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

    const VideoWrapper = peerProps ? YourVideoWrapper : MyVideoWrapper;
    const Video = peerProps ? YourVideo : MyVideo;

    return (
        <VideoWrapper>
            {(error || muted) ? null : (
                <Progress volume={volume} />
            )}
            <ActionButtons inMeeting={Boolean(peerProps)}>
                <Mute onClick={toggleMuted} muted={muted} />
                {peerProps && <Hangup />}
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
    peerProps: PropTypes.object
};

const MyVideo = styled.video`
    transform: rotateY(180deg);
    border-radius: 10px;
    width: 100%;
    background-color: black;
    min-width: calc(100vw - 40px);
    min-height: calc(56vw - 22px);
    max-height: 60vh;
    @media only screen and (min-width: ${desktop}) {
        min-width: 640px;
        min-height: 360px;
    }
`;

const ProgressContainer = styled.div`
    height: 10px;
    width: 50px;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: ${fadedYellow};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    position: absolute;
    bottom: 20px;
    left: 15px;
    z-index: 2;
`;

const ProgressBar = styled.div`
    height: 10px;
    background-color: ${yellow};
    transition: transform 0.3s ease-out;
    width: 100%;
    transform-origin: left;
`;

const MyVideoWrapper = styled.div`
    position: relative;
    width: 100%;
    margin: 0 10px;
    @media only screen and (min-width: ${desktop}) {
        max-width: 640px;
    }
`;

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

const IconButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${(props) => props.active ? 'transparent' : fadedYellow};
    border: 2px solid ${yellow};
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    box-sizing: border-box;
    margin: 0 3px;
    cursor: pointer;
    transition: background-color 0.3s ease-out;
    &:hover {
        background-color: ${(props) => props.active ? fadedYellow : fadedIconYellow};
    }
    @media only screen and (min-width: ${tablet}) {
        width: 60px;
        height: 60px;
        margin: 0 5px;
    }
    @media only screen and (min-width: ${desktop}) {
        width: 50px;
        height: 50px;
        margin: 0 5px;
    }
`;

const HangupButton = styled(IconButton)`
    background-color: ${yellow};
    &:hover {
        background-color: ${yellowHover};
    }
`;

const Icon = styled.img`
    max-width: 20px;
    max-height: 20px;
    @media only screen and (min-width: ${tablet}) {
        max-width: 30px;
        max-height: 30px;
    }
    @media only screen and (min-width: ${desktop}) {
        max-width: 25px;
        max-height: 25px;
    }
`;

const ActionButtons = styled.div`
    ${(props) => props.inMeeting ? (`
        position: fixed;
        bottom: 0px;
        padding: 15px 0px;
        background-color: ${backgroundBlack};
        height: 80x;
        box-sizing: border-box;
        @media only screen and (min-width: ${tablet}) {
            height: 100px;
        }
        @media only screen and (min-width: ${desktop}) {
            button {
                width: 60px;
                height: 60px;
                img {
                    max-width: 30px;
                    max-height: 30px;
                }
            }
        }
    `) : (`
        position: absolute;
        bottom: 20px;
        z-index: 2;
    `)}
    left: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
