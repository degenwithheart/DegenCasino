import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';

export default function Mines() {
    return (
        <>
            <GambaUi.Portal target="screen">
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <h1>Mobile Mines Game</h1>
                    <p>This is the mobile version of the Mines game.</p>
                </div>
            </GambaUi.Portal>
        </>
    );
}