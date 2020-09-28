import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {CREATED_MEETING, CREATE_MEETING} from '../../socket';

import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {CopyText} from '../components/CopyText';

import {boldGrey, lightGrey, yellowHover, secondaryBlack} from '../constants/colors';
import {createRoom, ok, create, roomCreated, roomLinkShare, roomCodeShare1, roomCodeShare2, roomCreatedLimit, createPlaceholder} from '../constants/strings';
import {tablet, desktop} from '../constants/media';

import {SocketContext} from '../context';

export const Create = (props) => {
    const [name, setName] = useState('');
    const [createdMeeting, setCreatedMeeting] = useState(null);

    const socket = useContext(SocketContext);
    const {closeModal} = props;

    useEffect(() => {
        socket.on(CREATED_MEETING, (meeting) => {
            setCreatedMeeting(meeting);
        });
    }, []);

    const handleChange = (event) => {
        const {value} = event.target;
        setName(value);
    };

    const createMeeting = () => {
        socket.emit(CREATE_MEETING, name);
    };

    if (createdMeeting) {
        const meetingURL = `${window.location.host}/meet/${createdMeeting.id}`;
        return (
            <ModalFormContainer>
                <Header>{roomCreated}</Header>
                <SubHeader>{roomLinkShare}</SubHeader>
                <CopyText text={meetingURL} />
                <SubHeader>
                    <span>{roomCodeShare1}</span>
                    <Code>{createdMeeting.id}</Code>
                    <span>{roomCodeShare2}</span>
                </SubHeader>
                <WarningFooter>{roomCreatedLimit}</WarningFooter>
                <ActionButtons>
                    <Button
                        onClick={closeModal}
                    >
                        {ok}
                    </Button>
                </ActionButtons>
            </ModalFormContainer>
        );
    }

    return (
        <ModalFormContainer>
            <Header>{createRoom}</Header>
            <Input
                placeholder={createPlaceholder}
                value={name}
                onChange={handleChange}
                inModal
            />
            <ActionButtons>
                <Button
                    onClick={createMeeting}
                    disabled={!name}
                >
                    {create}
                </Button>
            </ActionButtons>
        </ModalFormContainer>
    );
};

export const ModalFormContainer = styled.div`
    padding: 10px;
`;

export const Header = styled.header`
    font-size: 20px;
    margin-bottom: 20px;
    font-weight: 500;
    color: ${boldGrey};
    letter-spacing: -0.02em;
    @media only screen and (min-width: ${tablet}) {
        font-size: 22px;
    }
    @media only screen and (min-width: ${desktop}) {
        font-size: 24px;
    }
`;

export const ActionButtons = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const SubHeader = styled.div`
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: ${lightGrey};
    @media only screen and (min-width: ${tablet}) {
        font-size: 14px;
    }
`;

const Code = styled.span`
    font-size: 14px;
    margin: 0 5px;
    padding: 1px 8px;
    background-color: ${yellowHover};
    color: ${secondaryBlack};
    font-weight: 500;
    @media only screen and (min-width: ${tablet}) {
        font-size: 16px;
    }
`;

const WarningFooter = styled.footer`
    font-size: 10px;
    color: ${lightGrey};
    margin-top: 15px;
`;

Create.propTypes = {
    closeModal: PropTypes.func
};
