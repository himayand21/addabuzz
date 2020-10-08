import styled from 'styled-components';
import {tablet, desktop} from '../constants/media';
import {red, fadedWhite} from '../constants/colors';

export const MeetingVideoWrapper = styled.div`
    ${(props) => props.isBig ? `
        position: fixed;
        top: 0;
        left: 0;
        height: 0px;
    ` : `
        position: relative;
        z-index: 4;
        margin-right: 5px;
        display: flex;
        @media only screen and (min-width: ${desktop}) {
            margin-bottom: 5px;
            margin-right: unset;
        }
    `}
`;

export const NameWrapper = styled.div`
    ${(props) => props.isBig ? `
        position: fixed;
        top: 10px;
        width: 100%;
        left: 0;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 4;
    ` : `
        position: absolute;
        z-index: 4;
        top: 0;
        left: 0;
    `}
`;

export const Name = styled.div`
    background-color: ${fadedWhite};
    color: ${red};
    font-weight: 500;
    ${(props) => props.isBig ? `
        padding: 5px 10px;
        font-size: 16px;
        border-radius: 5px;
    ` : `
        padding: 2px 5px;
        color: #e15759;
        font-size: 13px;
        border-top-left-radius: 10px;
        border-bottom-right-radius: 10px;
    `}
`;

export const MeetingVideo = styled.video`
    ${(props) => props.isBig ? `
        transform: rotateY(180deg);
        background-color: black;
        min-width: 100vw;
        max-width: 100vw;
        max-height: calc(100vh - 80px);
        min-height: calc(100vh - 80px);
        @media only screen and (min-width: ${tablet}) {
            max-height: calc(100vh - 100px);
            min-height: calc(100vh - 100px);
        }
    ` : `
        transform: rotateY(180deg);
        background-color: black;
        border-radius: 10px;
        max-height: 200px;
        min-height: 200px;
        box-sizing: border-box;
        @media only screen and (min-width: ${tablet}) {
            max-height: 250px;
            min-height: 250px;
        }
        @media only screen and (min-width: ${desktop}) {
            max-width: 300px;
            min-width: 300px;
            max-height: unset;
            min-height: unset;
        }
    `}
`;
