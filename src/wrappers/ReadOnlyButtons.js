import React from 'react';
import styled from 'styled-components';

import {desktop} from '../constants/media';

import micOff from '../assets/mic_off_readonly.svg';
import videoOff from '../assets/video_off_readonly.svg';

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
                height: calc(100vh - 100px);
                left: 0px;
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
        padding-left: 10px;
        padding-right: 0px;
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
            max-height: 30px;
            max-width: 30px;
            min-height: 30px;
            min-width: 30px;
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
    max-width: 40px;
    max-height: 40px;
    min-height: 40px;
    min-width: 40px;
    margin: 0 5px;
    background-color: white;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 50%;
`;