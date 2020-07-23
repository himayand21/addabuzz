import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';

import {Meeting} from './Meeting';

export const Home = (props) => {
    const {meetings} = props;

    const {meetingId} = useParams();
    const [loading, setLoading] = useState(true);

    const meeting = meetings.find((each) => each.id === meetingId);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    if (loading) return <div>Loading</div>;

    if (!meeting) return <div>Meeting does not exist</div>;

    return (
        <Meeting
            meeting={meeting}
        />
    );
};

Home.propTypes = {
    meetings: PropTypes.array
};