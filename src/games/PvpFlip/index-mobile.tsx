import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';

export default function PvpFlip() {
    return (
        <>
            <GambaUi.Portal target="screen">
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <h1>Mobile PvP Flip Game</h1>
                    <p>This is the mobile version of the PvP Flip game.</p>
                </div>
            </GambaUi.Portal>
        </>
    );
}