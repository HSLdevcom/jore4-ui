import ReactDOMServer from 'react-dom/server';

export const renderComponentString = (component: React.ReactNode) => {
  return ReactDOMServer.renderToString(component);
};

export const getSvgComponentDataUrl = (svgComponent: React.ReactNode) => {
  const componentStr = renderComponentString(svgComponent);
  const dataUrl = `data:image/svg+xml;utf8,${componentStr}`;
  return dataUrl;
};
