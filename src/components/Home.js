import React from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';

import {Meeting} from './Meeting';

export const Home = (props) => {
    const {meetings, loading} = props;
    const {meetingId} = useParams();

    if (loading) return <div>Loading</div>;

    const meeting = meetings.find((each) => each.id === meetingId);
    if (!meeting) return <div>Meeting does not exist</div>;

    return (
        <Meeting
            meeting={meeting}
        />
    );
};

Home.propTypes = {
    meetings: PropTypes.array,
    loading: PropTypes.bool
};