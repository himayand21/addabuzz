import React from 'react';
import styled from 'styled-components';

import {desktop} from '../constants/media';

import micOff from '../assets/mic_off.svg';
import videoOff from '../assets/video_off.svg';

export const ReadOnlyWrapper = styled.div`
    position: absolute;
    left: 0px;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
    z-index: 2;
    ${(props) => props.isBig ? (
        `
            width: 100%;
            flex-direction: row;
            top: 10px;
            height: 50px;
            align-items: center;
            @media only screen and (min-width: ${desktop}) {
                flex-direction: column-reverse;
                width: 200px;
                height: 100%;
                top: 0px;
                padding: 20px;
                align-items: flex-start;
            }
        `
    ) : (
        `
            width: 100%;
            flex-direction: row;
            bottom: 10px;
            height: 50px;
            align-items: center;
        `
    )}
    ${(props) => props.isSmall && (`
        padding: 0 10px;
        height: 40px;
        bottom: 0px;
    `)}
`;

export const ReadOnlyButtons = styled.div`
    flex: 1;
    display: flex;
    ${(props) => props.isBig ? (
        `
            justify-content: flex-end;
            align-items: center;
            height: 100%;
            @media only screen and (min-width: ${desktop}) {
                width: 100%;
                align-items: flex-start;
                justify-content: flex-start;
            }
        `
    ) : (
        `
            justify-content: flex-end;
            align-items: center;
            height: 100%;
        `
    )}
    ${(props) => props.isSmall && (`
        img {
            max-height: 20px;
            max-width: 20px;
        }
    `)}
`;

export const MuteReadOnly = () => {
    return <Icon src={micOff} />;
};

export const BlindReadOnly = () => {
    return <Icon src={videoOff} />;
};

const Icon = styled.img`
    max-width: 30px;
    max-height: 30px;
    margin: 0 5px;
`;