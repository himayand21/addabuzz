import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

export const You = (props) => {
    const ref = useRef(null);
    const {stream} = props;

    useEffect(() => {
        ref.current.srcObject = stream;
    }, []);

    return (
        <video
            autoPlay
            muted
            ref={ref}
        />
    );
};

You.propTypes = {
    stream: PropTypes.object
};