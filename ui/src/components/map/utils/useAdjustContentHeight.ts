import { useEffect } from 'react';

const adjustContentHeight = () => {
  const header = document.getElementById('mapheader');
  const content = document.getElementById('modal');

  if (header && content) {
    const headerHeight = header.offsetHeight;
    const viewportHeight = window.innerHeight;
    const otherComponentsHeight = 210; // map footer, modal header and modal footer

    const maxContentHeight =
      viewportHeight - headerHeight - otherComponentsHeight;
    const contentScrollHeight = content.scrollHeight;

    const finalContentHeight = Math.min(maxContentHeight, contentScrollHeight);

    content.style.height = `${finalContentHeight}px`;
  }
};

export const useAdjustContentHeight = () => {
  useEffect(() => {
    adjustContentHeight();

    const handleResize = () => adjustContentHeight();

    window.addEventListener('resize', handleResize);

    const headerObserver = new ResizeObserver(handleResize);
    const header = document.getElementById('mapheader');
    if (header) {
      headerObserver.observe(header);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      headerObserver.disconnect();
    };
  }, []);
};
