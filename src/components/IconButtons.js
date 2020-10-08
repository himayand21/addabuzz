import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {yellow, fadedYellow, fadedIconYellow, yellowHover, fadedWhite} from '../constants/colors';
import {tablet, desktop} from '../constants/media';

import micOn from '../assets/mic_on.svg';
import micOff from '../assets/mic_off.svg';
import videoOn from '../assets/video_on.svg';
import videoOff from '../assets/video_off.svg';
import hangUp from '../assets/hang_up.svg';
import pin from '../assets/pin.svg';

export const Hangup = (props) => {
    return (
        <HangupButton {...props}>
            <Icon src={hangUp} />
        </HangupButton>
    );
};

export const Mute = (props) => {
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

export const Blind = (props) => {
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

export const Pin = (props) => {
    return (
        <PinButton {...props}>
            <PinIcon src={pin} />
        </PinButton>
    );
};

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

const PinButton = styled.button`
    position: absolute;
    top: 0px;
    right: 0px;
    width: 40px;
    height: 40px;
    border: none;
    outline: none;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: ${fadedWhite};
    padding: 5px;
    z-index: 4;
    &:hover {
        background-color: white;
    }
`;

const PinIcon = styled.img`
    max-width: 20px;
    max-height: 20px;
    transform: rotate(45deg);
`;
