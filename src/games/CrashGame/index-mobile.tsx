import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';

export default function CrashGame() {
    return (
        <>
            <GambaUi.Portal target="screen">
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <h1>Mobile Crash Game</h1>
                    <p>This is the mobile version of the Crash game.</p>
                </div>
            </GambaUi.Portal>
        </>
    );
}