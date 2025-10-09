import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';

export default function PlinkoRace() {
    return (
        <>
            <GambaUi.Portal target="screen">
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <h1>Mobile Plinko Race Game</h1>
                    <p>This is the mobile version of the Plinko Race game.</p>
                </div>
            </GambaUi.Portal>
        </>
    );
}