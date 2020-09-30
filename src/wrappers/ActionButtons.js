import styled from 'styled-components';

import {backgroundBlack} from '../constants/colors';
import {tablet, desktop} from '../constants/media';

const ActionButtons = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const FixedActionButtons = styled(ActionButtons)`
    position: fixed;
    bottom: 0px;
    left: 0px;
    padding: 20px 0px;
    background-color: ${backgroundBlack};
    box-sizing: border-box;
    z-index: 5;
    @media only screen and (min-width: ${tablet}) {
        height: 100px;
    }
    @media only screen and (min-width: ${desktop}) {
        button {
            width: 60px;
            height: 60px;
            img {
                max-width: 30px;
                max-height: 30px;
            }
        }
    }
`;

export const IntroActionButtons = styled(ActionButtons)`
    position: absolute;
    bottom: 20px;
    z-index: 2;
`;
