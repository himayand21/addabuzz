import React from 'react';
import styled from 'styled-components';

import {tablet, desktop} from '../constants/media';
import {backgroundBlack} from '../constants/colors';

import love from '../assets/love.svg';
import copyright from '../assets/copyright.svg';
import linkedin from '../assets/linkedin.svg';
import github from '../assets/github.svg';
import twitter from '../assets/twitter.svg';

import {madeWith, byHimayan} from '../constants/strings';

import {LINKEDIN, GITHUB, TWITTER} from '../constants/links';

export const Footer = () => {
    return (
        <FooterContainer>
            <Caption>
                <span>{madeWith}</span>
                <Icon src={love} />
                <span>{byHimayan}</span>
                <Icon src={copyright} />
                <span>{new Date().getFullYear()}</span>
            </Caption>
            <IconLinks>
                <Link
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Icon src={linkedin} />
                </Link>
                <Link
                    href={GITHUB}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Icon src={github} />
                </Link>
                <Link
                    href={TWITTER}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Icon src={twitter} />
                </Link>
            </IconLinks>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    width: 100%;
    display: flex;
    padding: 15px 15px 5px;
    background-color: ${backgroundBlack};
    height: 60px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    letter-spacing: -0.02em;
    @media only screen and (min-width: ${tablet}) {
        height: 70px;
        font-size: 12px;
    }
    @media only screen and (min-width: ${desktop}) {
        height: 75px;
        font-size: 14px;
        padding: 15px 20px 5px;
    }
`;

const Caption = styled.div`
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
`;

const Icon = styled.img`
    width: 15px;
    margin: 0px 5px;
`;

const IconLinks = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;    
`;

const Link = styled.a`
    cursor: pointer;
    margin-left: 3px;
    &:hover {
        img {
            transform: scale(1.2);
        }
    }
    @media only screen and (min-width: ${tablet}) {
        margin-left: 5px;
    }
    @media only screen and (min-width: ${desktop}) {
        margin-left: 7px;
    }
    img {
        width: 15px;
        transition: transform 0.3s ease-out;
        @media only screen and (min-width: ${tablet}) {
            width: 17px;
        }
        @media only screen and (min-width: ${desktop}) {
            width: 20px;
        }
    }
`;