import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {yellow, secondaryBlack, yellowHover, yellowActive} from '../constants/colors';
import {tablet, desktop} from '../constants/media';

export const Button = (props) => {
    const {children, ...otherProps} = props;
    return (
        <StyledButton {...otherProps}>
            {children}
        </StyledButton>
    );
};

Button.propTypes = {
    children: PropTypes.node
};

const StyledButton = styled.button`
    border: none;
    font-family: 'Poppins', sans-serif;
    padding: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-sizing: border-box;
    ${(props) => props.isSecondary ? (
        `
            color: ${secondaryBlack};
            background-color: transparent;
            outline-color: ${secondaryBlack};
            border: 2px solid ${secondaryBlack};
            transition: color 0.3s ease-in;
            position: relative;
            z-index: 2;
            &:hover {
                color: white;
            }
            &:active {
                color: white;
            }
            &:disabled {
                opacity: 0.8;
            }
            &:before {
                content: "";
                position: absolute;
                z-index: -1;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: ${secondaryBlack};
                transform: scaleX(0);
                transform-origin: 0 50%;
                transition: transform 0.3s ease-out;
            }
            &:hover:before {
                transform: scaleX(1);
            }
        `
    ) : (
        `
            color: ${secondaryBlack};
            background-color: ${yellow};
            outline-color: ${yellow};
            border: 2px solid ${yellow};
            transition: background-color 0.3s ease-out;
            &:hover {
                background-color: ${yellowHover};
            }
            &:active {
                background-color: ${yellowActive};
            }
            &:disabled {
                background-color: ${yellow};
            }
        `
    )}
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    ${(props) => props.alwaysMedium ? (
        `
            padding: 8px 12px;
            font-size: 16px
        `
    ) : (
        `
            @media only screen and (min-width: ${tablet}) {
                padding: 8px 12px;
                font-size: 16px;
            }
            @media only screen and (min-width: ${desktop}) {
                padding: 10px 15px;
                font-size: 18px;
            }
        `
    )}
`;