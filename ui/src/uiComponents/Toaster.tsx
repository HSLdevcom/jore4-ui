import { Toaster as ToasterComponent } from 'react-hot-toast';

export const Toaster = () => {
  return (
    <ToasterComponent
      position="bottom-right"
      toastOptions={{
        duration: 5000,
      }}
    />
  );
};
