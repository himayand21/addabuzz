import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {ReadOnlyButtons, ReadOnlyWrapper, MuteReadOnly, BlindReadOnly} from '../wrappers/ReadOnlyButtons';
import {SmallVideoWrapper, SmallVideo} from '../wrappers/SmallVideo';

import {Progress} from './Progress';

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
        <SmallVideoWrapper>
            <ReadOnlyWrapper isSmall>
                {!muted && <Progress volume={volume} />}
                <ReadOnlyButtons isSmall>
                    {muted && <MuteReadOnly />}
                    {blinded && <BlindReadOnly />}
                </ReadOnlyButtons>
            </ReadOnlyWrapper>
            <SmallVideo
                autoPlay
                muted={muted}
                ref={ref}
            />
        </SmallVideoWrapper>
    );
};

You.propTypes = {
    stream: PropTypes.object,
    muted: PropTypes.bool,
    blinded: PropTypes.bool
};
