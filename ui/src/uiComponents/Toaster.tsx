import React from 'react';
import { Toaster as ToasterComponent } from 'react-hot-toast';

export const Toaster = (): React.ReactElement => {
  return (
    <ToasterComponent
      position="bottom-right"
      toastOptions={{
        duration: 5000,
      }}
    />
  );
};
