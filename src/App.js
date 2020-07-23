import React, {useEffect, useState, useContext} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Home} from './components/Home';
import {SocketContext} from './context';

import './App.scss';

const App = () => {
    const [name, setName] = useState('');
    const [createdMeeting, setCreatedMeeting] = useState({});
    const [meetings, setMeetings] = useState(null);
    const [loading, setLoading] = useState(true);

    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on('update-meetings', (newMeetings) => {
            setMeetings(newMeetings);
        });
        socket.on('create-meeting-success', (meeting) => {
            setCreatedMeeting(meeting);
        });
    }, []);

    useEffect(() => {
        if (meetings) setLoading(false);
    }, [meetings]);

    const createMeeting = () => {
        socket.emit('create-meeting', name);
    };

    const handleChange = (event) => {
        const {value} = event.target;
        setName(value);
    };

    return (
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                >
                    <div className="container">
                        <input
                            value={name}
                            onChange={handleChange}
                        />
                        <button
                            onClick={createMeeting}
                        >
				            Create Meeting
                        </button>
                        {(createdMeeting.id) && (
                            <div>{`Meeting URL: ${window.location.href}meet/${createdMeeting.id}`}</div>
                        )}
                    </div>
                </Route>
                <Route
                    path="/meet/:meetingId"
                >
                    <Home
                        meetings={meetings}
                        loading={loading}
                    />
                </Route>
                <Route>
                    Nothing here
                </Route>
            </Switch>
        </Router>
    );
};
export default App;