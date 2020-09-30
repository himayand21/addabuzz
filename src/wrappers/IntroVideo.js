import styled from 'styled-components';
import {desktop} from '../constants/media';

export const IntroVideoWrapper = styled.div`
    position: relative;
    width: 100%;
    margin: 0 10px;
    @media only screen and (min-width: ${desktop}) {
        max-width: 640px;
    }
`;

export const IntroVideo = styled.video`
    transform: rotateY(180deg);
    border-radius: 10px;
    width: 100%;
    background-color: black;
    min-width: calc(100vw - 40px);
    min-height: calc(56vw - 22px);
    max-height: 60vh;
    @media only screen and (min-width: ${desktop}) {
        min-width: 640px;
        min-height: 360px;
    }
`;
