import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {ReadOnlyButtons, ReadOnlyWrapper, MuteReadOnly, BlindReadOnly} from '../wrappers/ReadOnlyButtons';
import {MeetingVideoWrapper, MeetingVideo, NameWrapper, Name} from '../wrappers/MeetingVideo';
import {Pin} from '../components/IconButtons';

import {Progress} from './Progress';

export const You = (props) => {
    const [remoteStream, setRemoteStream] = useState();
    const [volume, setVolume] = useState(0);

    const ref = useRef(null);
    const {stream, muted, blinded, isPinned, pinVideo, userName} = props;

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

    const isSmall = !isPinned;

    const handleClick = () => {
        if (!isSmall) return;
        pinVideo();
    };

    return (
        <MeetingVideoWrapper isBig={!isSmall}>
            {isSmall && (
                <Pin onClick={handleClick} />
            )}
            <NameWrapper isBig={!isSmall}>
                <Name isBig={!isSmall}>
                    {userName}
                </Name>
            </NameWrapper>
            <ReadOnlyWrapper
                isSmall={isSmall}
                isBig={!isSmall}
            >
                {!muted && <Progress volume={volume} />}
                <ReadOnlyButtons
                    isSmall={isSmall}
                    isBig={!isSmall}
                >
                    {muted && <MuteReadOnly />}
                    {blinded && <BlindReadOnly />}
                </ReadOnlyButtons>
            </ReadOnlyWrapper>
            <MeetingVideo
                onClick={handleClick}
                isBig={!isSmall}
                autoPlay
                muted={muted}
                ref={ref}
            />
        </MeetingVideoWrapper>
    );
};

You.propTypes = {
    stream: PropTypes.object,
    muted: PropTypes.bool,
    blinded: PropTypes.bool,
    isPinned: PropTypes.bool,
    pinVideo: PropTypes.func,
    userName: PropTypes.string
};
