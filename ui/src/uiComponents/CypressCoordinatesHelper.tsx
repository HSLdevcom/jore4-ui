/* eslint-disable no-param-reassign */

import React, { FC, useEffect } from 'react';

type Elements = {
  readonly x: HTMLElement;
  readonly y: HTMLElement;
  readonly text: HTMLElement;
};

function getElements(): Elements | null {
  const x = document.getElementById('cypressCoordinatesHelperX');
  const y = document.getElementById('cypressCoordinatesHelperY');
  const text = document.getElementById('cypressCoordinatesHelperText');

  if (!x || !y || !text) {
    return null;
  }

  return { x, y, text };
}

const setLocation = ({ x, y, text }: Elements, e: MouseEvent) => {
  x.style.left = `${e.x}px`;
  y.style.top = `${e.y}px`;
  text.style.left = `${e.x}px`;
  text.style.top = `${e.y}px`;
  text.innerText = `x: ${e.x} | y: ${e.y}`;
};

const setColor = ({ x, y, text }: Elements, color: string) => {
  x.style.background = color;
  y.style.background = color;
  text.style.color = color;
};

export const CypressCoordinatesHelper: FC = () => {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const elements = getElements();
      if (elements) {
        setLocation(elements, e);
        setTimeout(() => setColor(elements, 'red'), 100);
      }
    };

    const onDown = (e: MouseEvent) => {
      const elements = getElements();
      if (elements) {
        setLocation(elements, e);
        setColor(elements, 'green');
      }
    };

    const onUp = (e: MouseEvent) => {
      const elements = getElements();
      if (elements) {
        setLocation(elements, e);
        setColor(elements, 'blue');
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div>
      <div
        id="cypressCoordinatesHelperX"
        style={{
          position: 'fixed',
          height: '100vh',
          width: '1px',
          top: 0,
          background: 'red',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />
      <div
        id="cypressCoordinatesHelperY"
        style={{
          position: 'fixed',
          height: '1px',
          width: '100vw',
          left: 0,
          background: 'red',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />
      <div
        id="cypressCoordinatesHelperText"
        style={{
          position: 'fixed',
          color: 'red',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />
    </div>
  );
};
