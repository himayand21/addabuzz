import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {fadedGrey, yellow, yellowActive, secondaryBlack, backgroundYellow, placeholderGrey} from '../constants/colors';

export const Input = (props) => {
    const {placeholder, value, inModal, ...otherProps} = props;

    return (
        <InputContainer focused={value}>
            <Placeholder focused={value} inModal={inModal}>
                {placeholder}
            </Placeholder>
            <StyledInput
                value={value}
                spellCheck={false}
                {...otherProps}
            />
        </InputContainer>
    );
};

const InputContainer = styled.div`
    width: 100%;
    border-width: 2px;
    border-style: solid;
    border-color: ${fadedGrey};
    border-radius: 5px;
    position: relative;
    box-sizing: border-box;
    ${(props) => props.focused && `
        border-color: ${yellow};
    `}
    &:focus-within {
        border-color: ${yellow};
        span {
            transform: translateY(-25px) scale(0.9) translateX(-3px);
            color: ${yellowActive};
        }
    }
`;

const Placeholder = styled.span`
    user-select: none;
    pointer-events: none;
    position: absolute;
    color: ${placeholderGrey};
    font-weight: 500;
    bottom: 14px;
    left: 10px;
    will-change: transform;
    font-size: 15px;
    letter-spacing: -0.03em;
    transition: transform 0.1s ease-out;
    transform-origin: left;
    background-color: ${(props) => props.inModal ? 'white' : backgroundYellow};
    padding: 0px 3px;
    ${(props) => props.focused && `
        transform: translateY(-25px) scale(0.9) translateX(-3px);
        color: ${yellowActive};
    `}
`;

const StyledInput = styled.input`
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 18px;
    height: 48px;
    padding-left: 10px;
    box-sizing: border-box;
    color: ${secondaryBlack};
`;

Input.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    inModal: PropTypes.bool
};