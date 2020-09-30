import styled from 'styled-components';
import {tablet} from '../constants/media';

export const BigVideoWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 0px;
`;

export const BigVideo = styled.video`
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
`;
