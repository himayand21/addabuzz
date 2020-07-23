import React, {useState, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';

import {SocketContext} from '../context';
import {Me} from './Me';

const CONFIRM = 'CONFIRM';
const CHATTING = 'CHATTING';
const BYE = 'BYE';

export const Meeting = (props) => {
    const [name, setName] = useState('');
    const [step, setStep] = useState(CONFIRM);
    const [users, setUsers] = useState([]);

    const socket = useContext(SocketContext);

    const {meeting} = props;
    const {name: meetingName, id: meetingId} = meeting;

    useEffect(() => {
        socket.emit('get-participants', meetingId);
        socket.on('update-participants', (participants) => {
            setUsers(participants);
        });
    }, []);

    const handleChange = (event) => {
        const inputValue = event.target.value;
        setName(inputValue);
    };

    const joinRoom = () => {
        socket.emit('join-meeting', ({
            meetingId,
            name
        }));
        setStep(CHATTING);
    };

    console.log(users);

    return (
        <div>
            <span>{meetingName}</span>
            <Me />
            <input
                value={name}
                onChange={handleChange}
            />
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
};

Meeting.propTypes = {
    meeting: PropTypes.object
};