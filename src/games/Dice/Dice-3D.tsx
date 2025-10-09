import React, { Suspense, lazy } from 'react';

// 3D placeholder: lazily render the 2D implementation as a safe fallback.
const Dice2D = lazy(() => import('./Dice-2D'));

export default function Dice3D(): JSX.Element {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, right: 10, color: '#d4a574', opacity: 0.9 }}>
                3D mode not implemented — falling back to 2D
            </div>
            <Suspense fallback={<div>Loading 2D fallback...</div>}>
                <Dice2D />
            </Suspense>
        </div>
    );
}