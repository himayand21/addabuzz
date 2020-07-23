import React, {useRef, useEffect} from 'react';

export const Me = () => {
    const ref = useRef(null);

    useEffect(() => {
        const streamConstraints = {
            video: {
                facingMode: 'user'
            },
            audio: true
        };
        const localVideo = ref.current;

        navigator
            .mediaDevices
            .getUserMedia(streamConstraints)
            .then((stream) => {
                localVideo.srcObject = stream;
            })
            .catch((error) => {
                console.log('navigator.getUserMedia error: ', error);
            });
    }, []);

    return (
        <video
            autoPlay
            muted
            ref={ref}
        />
    );
};