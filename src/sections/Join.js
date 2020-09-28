import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Input} from '../components/Input';
import {Button} from '../components/Button';

import {join, joinGang, joinPlaceholder} from '../constants/strings';

import {ModalFormContainer, Header, ActionButtons} from './Create';

export const Join = (props) => {
    const [code, setCode] = useState('');
    const {closeModal} = props;

    const handleChange = (event) => {
        const {value} = event.target;
        setCode(value);
    };

    const joinMeeting = () => {
        const meetingURL = `${window.location.href}meet/${code}`;
        window.open(meetingURL);
        closeModal();
    };

    return (
        <ModalFormContainer>
            <Header>{joinGang}</Header>
            <Input
                placeholder={joinPlaceholder}
                value={code}
                onChange={handleChange}
                inModal
            />
            <ActionButtons>
                <Button
                    onClick={joinMeeting}
                    disabled={!code}
                >
                    {join}
                </Button>
            </ActionButtons>
        </ModalFormContainer>
    );
};

Join.propTypes = {
    closeModal: PropTypes.func
};