import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {withToast} from '../components/Toast';
import {tablet} from '../constants/media';
import {secondaryBlack, yellow, yellowHover} from '../constants/colors';
import {copied} from '../constants/strings';
import copy from '../assets/copy.svg';

const CopyTextComponent = (props) => {
    const {text, addToast} = props;

    const copyToClipboard = () => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        addToast(copied);
    };

    return (
        <CopyTextContainer>
            <TextContainer>
                {text}
            </TextContainer>
            <CopyContainer onClick={copyToClipboard}>
                <img src={copy} />
            </CopyContainer>
        </CopyTextContainer>
    );
};

export const CopyText = withToast(CopyTextComponent);

const CopyTextContainer = styled.div`
    width: 100%;
    background-color: ${yellowHover};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    border: 2px solid ${yellow};
`;

const TextContainer = styled.span`
    color: ${secondaryBlack};
    flex: 1;
    font-weight: 500;
    font-size: 15px;
    letter-spacing: -0.03em;
`;

const CopyContainer = styled.span`
    padding: 2px;
    width: 20px;
    height: 23px;
    cursor: pointer;
    @media only screen and (min-width: ${tablet}) {
        padding: 5px;
    }
`;

CopyTextComponent.propTypes = {
    text: PropTypes.string,
    addToast: PropTypes.func
};