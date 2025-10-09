import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';

export default function Roulette() {
    return (
        <>
            <GambaUi.Portal target="screen">
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <h1>Mobile Roulette Game</h1>
                    <p>This is the mobile version of the Roulette game.</p>
                </div>
            </GambaUi.Portal>
        </>
    );
}