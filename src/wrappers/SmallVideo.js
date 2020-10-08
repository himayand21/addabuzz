import styled from 'styled-components';
import {tablet, desktop} from '../constants/media';

export const SmallVideoWrapper = styled.div`
    position: relative;
    z-index: 4;
    margin-right: 5px;
    display: flex;
    @media only screen and (min-width: ${desktop}) {
        margin-bottom: 5px;
        margin-right: unset;
    }
`;

export const SmallVideo = styled.video`
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
`;