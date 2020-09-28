import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import times from '../assets/times.svg';
import {boldGrey, fadedBlack, yellow} from '../constants/colors';
import {tablet, desktop} from '../constants/media';

export const Modal = (props) => {
    const {show, closeModal, children} = props;
    if (!show) return null;

    const outsideClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    return ReactDOM.createPortal(
        <ModalWrapper onClick={outsideClick}>
            <ModalSection>
                <CloseButton onClick={closeModal} className="close-button">
                    <CloseIcon src={times} />
                </CloseButton>
                {children}
            </ModalSection>
        </ModalWrapper>,
        document.getElementById('modal-root')
    );
};

Modal.propTypes = {
    show: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    closeModal: PropTypes.func,
    children: PropTypes.node,
};

const ModalWrapper = styled.main`
    width: 100vw;
    height: 100vh;
    min-height: 100%;
    background-color: ${fadedBlack};
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalSection = styled.section`
    width: 600px;
    max-width: 95vw;
    margin: auto;
    background-color: white;
    border-radius: 10px;
    box-sizing: border-box;
    z-index: 100;
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    @media only screen and (min-width: ${tablet}) {
        padding: 15px;
    }
    @media only screen and (min-width: ${desktop}) {
        padding: 20px;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 25px;
    background: none;
    border: none;
    cursor: pointer;
    color: ${boldGrey};
    outline-color: ${yellow};
    @media only screen and (min-width: ${desktop}) {
        top: 15px;
        right: 15px;
    }
`;

const CloseIcon = styled.img``;
