import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { closeErrorModalAction, selectErrorModal } from '../redux';
import { ErrorModal } from './ErrorModal';
import { ErrorModalItem } from './ErrorModalItem';

export const JoreErrorModal = () => {
  const dispatch = useDispatch();

  const { isOpen, errorList, errorModalTitle } =
    useAppSelector(selectErrorModal);

  const onClose = () => {
    dispatch(closeErrorModalAction());
  };

  return (
    <ErrorModal
      isOpen={isOpen}
      onClose={onClose}
      heading={errorModalTitle}
      className="w-max rounded-md"
      bodyClassName="max-h-[50vh] space-y-2 overflow-y-auto"
    >
      {errorList.map((error) => (
        <ErrorModalItem
          message={error.message}
          details={error.details}
          additionalDetails={error.additionalDetails}
          key={error.message}
        />
      ))}
    </ErrorModal>
  );
};
