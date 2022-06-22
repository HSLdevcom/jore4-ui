import React from 'react';
import { Toaster as ToasterComponent } from 'react-hot-toast';

export const Toaster = (): JSX.Element => {
  return (
    <ToasterComponent
      position="bottom-right"
      toastOptions={{
        duration: 5000,
      }}
    />
  );
};
