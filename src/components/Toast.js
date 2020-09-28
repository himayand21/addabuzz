/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

import {yellow, secondaryBlack} from '../constants/colors';
import {tablet, desktop} from '../constants/media';

import close from '../assets/timesCircle.svg';

const Toast = (props) => {
    const {toast, show, removeToast} = props;

    useEffect(() => {
        const duration = 3000;
        const timer = setTimeout(() => removeToast(), duration);
        return () => clearTimeout(timer);
    }, [removeToast]);

    return ReactDOM.createPortal(
        <ToastContainer show={show}>
            <ToastWrapper>
                <ToastMessage>
                    {toast}
                </ToastMessage>
                <CloseIcon src={close} onClick={removeToast} />
            </ToastWrapper>
        </ToastContainer>,
        document.getElementById('toast-root')
    );
};

export const withToast = (WrappedComponent) => {
    return ((props) => {
        const [toast, setToast] = useState(null);
        const [show, setShow] = useState(false);

        const removeToast = () => {
            setShow(false);
        };

        const addToast = (content) => {
            setToast(content);
            setShow(true);
        };

        return (
            <>
                <Toast
                    toast={toast}
                    show={show}
                    removeToast={removeToast}
                />
                <WrappedComponent
                    {...props}
                    addToast={addToast}
                    removeToast={removeToast}
                />
            </>
        );
    });
};

const ToastContainer = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    ${(props) => props.show ? (
        `
            transform: translateX(0px);
            opacity: 1;
        `
    ) : (
        `
            transform: translateX(300px);
            opacity: 0;
        `
    )}
`;

const ToastWrapper = styled.div`
    display: flex;
    position: relative;
    max-width: 250px;
    justify-content: center;
    align-items: flex-start;
    padding: 15px 10px 15px 15px;
    background: ${secondaryBlack};
    border-left: 2px solid ${yellow};
    @media only screen and (min-width: ${desktop}) {
        padding: 15px 10px 15px 20px;
    }
`;

const ToastMessage = styled.div`
    font-size: 12px;
    color: white;
    flex: 1;
    @media only screen and (min-width: ${tablet}) {
        font-size: 14px;
    }
    @media only screen and (min-width: ${desktop}) {
        font-size: 16px;
    }
`;

const CloseIcon = styled.img`
    width: 18px;
    margin-left: 8px;
    cursor: pointer;
    @media only screen and (min-width: ${tablet}) {
        width: 21px;
        margin-left: 12px;
    }
    @media only screen and (min-width: ${desktop}) {
        width: 25px;
        margin-left: 15px;
    }
`;