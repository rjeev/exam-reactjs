import React from 'react';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';


const Timer = ({timeFinished, startTime}) =>{
    return (
        <Countdown date={startTime*1 + 3000000}
        daysInHours
        intervalDelay={1000}
        precision={3}
        onComplete={timeFinished}
        />
    )

}

export default Timer;
