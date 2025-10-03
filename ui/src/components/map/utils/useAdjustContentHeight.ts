import { useEffect } from 'react';

export const mapTestIds = {
  mapHeader: 'MapHeader',
  mapFooter: 'MapFooter',
};

const getByTestId = (testId: string): HTMLElement | null => {
  return document.querySelector(`[data-testid="${testId}"]`);
};

const adjustContentHeight = (
  modalTestId: string = 'Modal',
  modalBodyTestId: string = 'ModalBody',
) => {
  const header = getByTestId('MapHeader');
  const footer = getByTestId('MapFooter');
  const modal = getByTestId(modalTestId);
  const content = getByTestId(modalBodyTestId);

  if (header && modal && footer && content) {
    const headerHeight = header.offsetHeight;
    const footerHeight = footer.offsetHeight;

    const modalHeight = modal.offsetHeight;
    const contentHeight = content.offsetHeight;
    const modalExtraHeight = modalHeight - contentHeight;

    const viewportHeight = window.innerHeight;

    const otherComponentsHeight = footerHeight + modalExtraHeight + 10; // leave a little space between modal and footer

    const maxContentHeight =
      viewportHeight - headerHeight - otherComponentsHeight;
    const contentScrollHeight = content.scrollHeight;

    const finalContentHeight = Math.min(maxContentHeight, contentScrollHeight);

    content.style.height = `${finalContentHeight}px`;
  }
};

export const useAdjustContentHeight = (
  modalTestId?: string,
  modalBodyTestId?: string,
) => {
  useEffect(() => {
    const contentTestId = modalTestId ?? 'Modal';
    const bodyTestId = modalBodyTestId ?? 'ModalBody';

    const handleResize = () => {
      adjustContentHeight(contentTestId, bodyTestId);
    };

    window.addEventListener('resize', handleResize);

    const headerObserver = new ResizeObserver(handleResize);
    const header = getByTestId('MapHeader');
    if (header) {
      headerObserver.observe(header);
    }

    requestAnimationFrame(function onResize() {
      handleResize();
      requestAnimationFrame(onResize);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      headerObserver.disconnect();
    };
  }, [modalTestId, modalBodyTestId]);
};
