import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {yellow, fadedYellow} from '../constants/colors';

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