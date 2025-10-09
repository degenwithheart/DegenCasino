import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';

export default function Magic8Ball() {
    return (
        <>
            <GambaUi.Portal target="screen">
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <h1>Mobile Magic 8 Ball Game</h1>
                    <p>This is the mobile version of the Magic 8 Ball game.</p>
                </div>
            </GambaUi.Portal>
        </>
    );
}