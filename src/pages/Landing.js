import React, {useState} from 'react';
import styled from 'styled-components';

import {tablet, desktop, laptop} from '../constants/media';
import {boldGrey, lightGrey} from '../constants/colors';
import {header1, header2, subheader1, subheader2, word, pronunciation, meaning, createRoom, joinGang} from '../constants/strings';

import poster from '../assets/video_call.svg';

import {Button} from '../components/Button';
import {Modal} from '../components/Modal';
import {NavBar} from '../components/NavBar';
import {Footer} from '../components/Footer';

import {Create} from '../sections/Create';
import {Join} from '../sections/Join';

const CREATE_MEETING = 'CREATE_MEETING';
const JOIN_MEETING = 'JOIN_MEETING';

export const Landing = () => {
    const [show, setShow] = useState(null);

    const openModal = (type) => setShow(type);
    const closeModal = () => setShow(null);

    const isCreateRoomOpen = show === CREATE_MEETING;
    const isJoinRoomOpen = show === JOIN_MEETING;

    return (
        <>
            <NavBar />
            <LandingPage>
                <LeftWrapper>
                    <Container>
                        <Header>
                            <Line>{header1}</Line>
                            <Line>{header2}</Line>
                        </Header>
                        <SubHeader>
                            <b>{word}</b>
                            <i>{pronunciation}</i>
                            <span>{meaning}</span>
                        </SubHeader>
                        <SubHeader>
                            <Line>{subheader1}</Line>
                            <Line>{subheader2}</Line>
                        </SubHeader>
                        <ActionButtons>
                            <Button
                                onClick={() => openModal(CREATE_MEETING)}
                            >
                                {createRoom}
                            </Button>
                            <RightButton
                                isSecondary
                                onClick={() => openModal(JOIN_MEETING)}
                            >
                                {joinGang}
                            </RightButton>
                        </ActionButtons>
                        {isCreateRoomOpen && (
                            <Modal
                                closeModal={closeModal}
                                show={show}
                            >
                                <Create closeModal={closeModal}/>
                            </Modal>
                        )}
                        {isJoinRoomOpen && (
                            <Modal
                                closeModal={closeModal}
                                show={show}
                            >
                                <Join closeModal={closeModal}/>
                            </Modal>
                        )}
                    </Container>
                </LeftWrapper>
                <RightWrapper>
                    <Poster src={poster} />
                </RightWrapper>
            </LandingPage>
            <Footer />
        </>
    );
};

export const LandingPage = styled.div`
    width: 100%;
    padding: 20px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 120px);
    flex-direction: column-reverse;
    @media only screen and (min-width: ${tablet}) {
        min-height: calc(100vh - 140px);
        padding: 20px 15px;
        flex-direction: column-reverse;
    }
    @media only screen and (min-width: ${desktop}) {
        min-height: calc(100vh - 150px);
        padding: 20px 20px;
        flex-direction: row;
    }
`;

export const LeftWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    @media only screen and (min-width: ${tablet}) {
        text-align: center;
    }
    @media only screen and (min-width: ${desktop}) {
        align-items: center;
        text-align: left;
    }
`;

export const Container = styled.div`
    width: 90%;
    max-width: 95vw;
`;

export const Header = styled.header`
    width: 100%;
    color: ${boldGrey};
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.02em;
    @media only screen and (min-width: ${tablet}) {
        font-size: 36px;
    }
    @media only screen and (min-width: ${laptop}) {
        font-size: 40px;
    }
`;

export const SubHeader = styled.div`
    width: 100%;
    color: ${lightGrey};
    font-size: 14px;
    margin-bottom: 1em;
    letter-spacing: -0.02em;
    @media only screen and (min-width: ${tablet}) {
        font-size: 18px;
    }
    @media only screen and (min-width: ${laptop}) {
        font-size: 20px;
    }
    b {
        padding-right: 3px;
        font-weight: 500;
        &::after {
            content: '•';
        }
    }
    i {
        margin-right: 3px;
        &::after {
            content: '•';
            font-style: normal;
        }
    }
    span {
        margin-left: 3px;
    }
`;

export const Line = styled.div`
    margin-bottom: 0.3rem;
`;

export const RightWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0 30px;
    @media only screen and (min-width: ${tablet}) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0 60px;
    }
    @media only screen and (min-width: ${desktop}) {
        flex: 1;
        margin: 0px;
    }
`;

const Poster = styled.img`
    width: 80%;
    @media only screen and (min-width: ${tablet}) {
        width: 70%;
    }
`;

export const ActionButtons = styled.div`
    margin-top: 40px;
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    @media only screen and (min-width: ${tablet}) {
        justify-content: center;
    }
    @media only screen and (min-width: ${desktop}) {
        justify-content: flex-start;
    }
`;

const RightButton = styled(Button)`
    margin-left: 10px;
`;