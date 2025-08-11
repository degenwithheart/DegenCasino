import React from 'react';

export type GameBundle = {
  id: string;
  live: 'up' | 'down' | 'new';
  meta: {
    name: string;
    image: string;
    background: string;
    description: string;
    effect?: string;
    [key: string]: any;
  };
  app: React.LazyExoticComponent<React.ComponentType<any>>;
  maintenance?: boolean;
  creating?: boolean;
  [key: string]: any;
};
