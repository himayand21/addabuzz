import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {tablet, desktop} from '../constants/media';

import micOff from '../assets/mic_off.svg';
import videoOff from '../assets/video_off.svg';

import {Progress} from './Progress';

const Mute = () => {
    return <Icon src={micOff} />;
};

const Blind = () => {
    return <Icon src={videoOff} />;
};

export const You = (props) => {
    const [remoteStream, setRemoteStream] = useState();
    const [volume, setVolume] = useState(0);

    const ref = useRef(null);
    const {stream, muted, blinded} = props;

    useEffect(() => {
        if (stream) {
            setRemoteStream(stream);
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(256);
            processor.onaudioprocess = processAudio;
            processor.connect(audioContext.destination);
            source.connect(processor);
        }
    }, [stream]);

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

    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <YourVideoWrapper>
            {!muted && (
                <Progress volume={volume} />
            )}
            <ActionButtons>
                {muted && <Mute />}
                {blinded && <Blind />}
            </ActionButtons>
            <YourVideo
                autoPlay
                muted={muted}
                ref={ref}
            />
        </YourVideoWrapper>
    );
};

You.propTypes = {
    stream: PropTypes.object,
    muted: PropTypes.bool,
    blinded: PropTypes.bool
};

export const YourVideoWrapper = styled.div`
    position: relative;
    max-width: 100vw;
    max-height: 56vw;
    @media only screen and (min-width: ${tablet}) {
        max-width: 50vw;
        max-height: 28vw;
    }
    @media only screen and (min-width: ${desktop}) {
        max-width: 33vw;
        max-height: 19vw;
    }
`;

export const YourVideo = styled.video`
    transform: rotateY(180deg);
    width: 100%;
    height: 100%;
    background-color: black;
`;

const Icon = styled.img`
    max-width: 30px;
    max-height: 30px;
    margin: 0 5px;
`;

const ActionButtons = styled.div`
    position: absolute;
    bottom: 20px;
    left: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    z-index: 2;
    box-sizing: border-box;
`;