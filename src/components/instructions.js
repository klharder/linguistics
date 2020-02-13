import React from 'react';
import { Button } from 'react-bootstrap';

const Instructions = (props) => {
    return (
        <div>
            <p style={ {'margin': '5% 25% 3% 25%', 'textAlign': 'left'} } >
                THE EXPERIMENT MUST BE COMPLETED ON A DESKTOP OR LAPTOP COMPUTER
                <br />
                <br />
                Before starting the experiment, we advise that you put the experiment in full screen mode and close all other programs that may be running on your device. We also suggest that you use headphones to listen to the experiment. 
                <br />
                <br />
                You will listen to a series of audio clips of various speakers. The clips vary in length (1-3 seconds) and some are quite short. You will first hear a tone followed by 1 second of silence and then the audio clip. Each audio clip will be played one at a time. After listening to each audio clip, you will be presented with four questions about the speaker’s personal attributes. Use the slider to answer all four questions. Please respond as quickly as possible based on your initial reaction. You will not be able to replay the audio, so it is necessary you listen the entire time. 
                <br />
                <br />
                You must respond to each slider in order to continue. Once you have finished answering all four questions press <b>proceed</b> and the next audio clip will play. At the end of the experiment you will be asked to answer a short demographic survey. Please complete the survey and then hit the submit button. <b>You must hit the submit button at the end of the experiment for your responses to be recorded.</b> If you wish to stop participating in the experiment hit the <b>Exit Experiment</b> button and your responses will not be saved.
                <br />
                <br />
                You will first hear two test stimuli that will help ensure the experiment is running correctly on your device. Once you have listened to the two test stimuli the experiment will begin. 
                <br />
                <br />
                Thank you for your participation
            </p>
            <Button
                onClick={ props.onStartClick }
            >
                Start
            </Button>
        </div>
    )
};

export default Instructions;
