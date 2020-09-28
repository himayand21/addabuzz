import React, {useState, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {GET_USERS, GOT_USERS, JOINED_MEETING, JOIN_MEETING} from '../../socket';

import {SocketContext} from '../context';

import {Me} from '../components/Me';
import {NavBar} from '../components/NavBar';
import {Footer} from '../components/Footer';
import {Button} from '../components/Button';
import {Input} from '../components/Input';

import {tablet, desktop} from '../constants/media';
import {ready, joinRoom, nobody, has, have, joinedRoom, and, other, others, namePlaceholder} from '../constants/strings';
import {LandingPage, LeftWrapper, RightWrapper, Header, SubHeader, Line, Container} from './Landing';
import {Meeting} from './Meeting';

const joinNames = (names) => {
    if (!names.length) return nobody;
    if (names.length === 1) return names[0];
    if (names.length < 4) {
        const [firstName, ...otherNames] = names;
        return `${otherNames.join(',')} ${and} ${firstName}`;
    }
    const [firstName, secondName, ...otherNames] = names;
    const otherString = otherNames.length > 1 ? others : other;
    return `${firstName}, ${secondName} ${and} ${otherNames.length} ${otherString}`;
};

export const Join = (props) => {
    const [name, setName] = useState('');
    const [id, setId] = useState(null);
    const [users, setUsers] = useState([]);

    const socket = useContext(SocketContext);

    const {meeting} = props;
    const {name: meetingName, id: meetingId} = meeting;

    const verb = users.length > 1 ? have : has;
    const userNames = users.map((each) => each.name);
    const subject = joinNames(userNames);

    const participantStatus = `${subject} ${verb} ${joinedRoom}`;

    useEffect(() => {
        socket.emit(GET_USERS, meetingId);
        socket.on(GOT_USERS, (participants) => {
            setUsers(participants);
        });
        socket.on(JOINED_MEETING, (myId) => {
            setId(myId);
        });
    }, []);

    const handleChange = (event) => {
        const inputValue = event.target.value;
        setName(inputValue);
    };

    const joinMeeting = () => {
        socket.emit(JOIN_MEETING, ({
            meetingId,
            name
        }));
    };

    if (id) {
        return (
            <Meeting
                users={users}
                id={id}
            />
        );
    }

    return (
        <>
            <NavBar />
            <JoiningPage>
                <JoinLeftWrapper>
                    <Me />
                </JoinLeftWrapper>
                <JoinRightWrapper>
                    <Container>
                        <JoinHeader>
                            <Line>{ready}</Line>
                        </JoinHeader>
                        <SubHeader>
                            <Line>
                                <span>{participantStatus}</span>
                                <MeetingName>{meetingName}</MeetingName>
                            </Line>
                        </SubHeader>
                        <NameInput>
                            <Input
                                value={name}
                                placeholder={namePlaceholder}
                                onChange={handleChange}
                            />
                        </NameInput>
                        <JoinButton>
                            <Button
                                disabled={!name}
                                onClick={joinMeeting}
                            >
                                {joinRoom}
                            </Button>
                        </JoinButton>
                    </Container>
                </JoinRightWrapper>
            </JoiningPage>
            <Footer />
        </>
    );
};

Join.propTypes = {
    meeting: PropTypes.object
};

const JoinLeftWrapper = styled(LeftWrapper)`
    flex: unset;
    min-width: 40vw;
`;

const JoinRightWrapper = styled(RightWrapper)`
    flex: 1;
`;

const MeetingName = styled.span`
    font-weight: 500;
    padding-left: 2px;
`;

const JoiningPage = styled(LandingPage)`
    flex-direction: column;
    @media only screen and (min-width: ${tablet}) {
        flex-direction: column;
    }
    @media only screen and (min-width: ${desktop}) {
        flex-direction: row;
    }
`;

const JoinHeader = styled(Header)`
    margin-bottom: 15px;
`;

const JoinButton = styled.div`
    margin: 20px 0;
`;

const NameInput = styled.div`
    margin: 20px 0;
    max-width: 450px;
    @media only screen and (min-width: ${tablet}) {
        margin-top: 25px;
    }
`;