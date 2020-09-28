import React from 'react';
import styled from 'styled-components';

import logo from '../assets/logo.png';
import {tablet, desktop} from '../constants/media';

export const NavBar = () => {
    return (
        <NavBarContainer>
            <NavBarLogo
                src={logo}
                onClick={() => window.location.reload()}
            />
        </NavBarContainer>
    );
};

const NavBarLogo = styled.img`
    width: 150px;
    cursor: pointer;
    @media only screen and (min-width: ${tablet}) {
        width: 195px;
    }
    @media only screen and (min-width: ${desktop}) {
        width: 220px;
    }
`;

const NavBarContainer = styled.div`
    width: 100%;
    display: flex;
    padding: 15px 15px 5px;
    height: 60px;
    box-sizing: border-box;
    @media only screen and (min-width: ${tablet}) {
        height: 70px;
    }
    @media only screen and (min-width: ${desktop}) {
        height: 75px;
        padding: 15px 20px 5px;
    }
`;