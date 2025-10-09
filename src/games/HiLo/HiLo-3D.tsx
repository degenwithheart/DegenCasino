import React from 'react';
import HiLo2D from './HiLo-2D';

export interface HiLoConfig {
    logo: string;
}

export default function HiLo3D(props: HiLoConfig) {
    // 3D implementation placeholder - falls back to 2D for now
    return <HiLo2D {...props} />;
}