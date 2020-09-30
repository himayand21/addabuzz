import styled from 'styled-components';
import {tablet, desktop} from '../constants/media';

export const SmallVideoWrapper = styled.div`
    position: relative;
    z-index: 4;
`;

export const SmallVideo = styled.video`
    transform: rotateY(180deg);
    background-color: black;
    border-radius: 10px;
    max-height: 170px;
    min-height: 170px;
    box-sizing: border-box;
    @media only screen and (min-width: ${tablet}) {
        max-height: 200px;
        min-height: 200px;
    }
    @media only screen and (min-width: ${desktop}) {
        max-width: 300px;
        min-width: 300px;
        max-height: unset;
        min-height: unset;
    }
`;