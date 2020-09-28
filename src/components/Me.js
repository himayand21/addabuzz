import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {failedToLoad} from '../constants/strings';
import {tablet, desktop} from '../constants/media';
import {yellow, fadedYellow, fadedIconYellow} from '../constants/colors';

import micOn from '../assets/mic_on.svg';
import micOff from '../assets/mic_off.svg';
import videoOn from '../assets/video_on.svg';
import videoOff from '../assets/video_off.svg';

const Progress = (props) => {
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

const Mute = (props) => {
    const {muted, ...otherProps} = props;
    return (
        <IconButton on={!muted} {...otherProps}>
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
        <IconButton on={!blinded} {...otherProps}>
            <Icon src={blinded ? videoOff : videoOn} />
        </IconButton>
    );
};

Blind.propTypes = {
    blinded: PropTypes.bool
};

export const Me = () => {
    const [error, setError] = useState(false);
    const [volume, setVolume] = useState(0);
    const [muted, setMuted] = useState(false);
    const [blinded, setBlinded] = useState(false);
    const [localStream, setLocalStream] = useState();

    const ref = useRef(null);

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
            }
        },
        audio: true
    };

    useEffect(() => {
        setStream();
    }, []);

    const setStream = () => {
        navigator
            .mediaDevices
            .getUserMedia(streamConstraints)
            .then((stream) => {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(256);
                processor.onaudioprocess = processAudio;
                processor.connect(audioContext.destination);
                source.connect(processor);
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
    };

    const toggleBlinded = () => {
        if (blinded) {
            setBlinded(false);
            setStream();
        } else {
            setBlinded(true);
            localStream.getVideoTracks().forEach(function(track) {
                track.stop();
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

    return (
        <VideoWrapper>
            {(error || muted) ? null : (
                <Progress volume={volume} />
            )}
            <ActionButtons>
                <Mute onClick={toggleMuted} muted={muted} />
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

const Video = styled.video`
    transform: rotateY(180deg);
    border-radius: 10px;
    width: 100%;
    background-color: black;
    min-width: calc(100vw - 50px);
    min-height: calc(56vw - 28px);
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

const VideoWrapper = styled.div`
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
    background-color: ${(props) => props.on ? 'transparent' : fadedYellow};
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
        background-color: ${(props) => props.on ? fadedYellow : fadedIconYellow};
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
    position: absolute;
    bottom: 20px;
    left: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
`;
