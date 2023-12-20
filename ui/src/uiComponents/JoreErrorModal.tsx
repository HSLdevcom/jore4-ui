import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { closeErrorModalAction, selectErrorModal } from '../redux';
import { ErrorModal } from './ErrorModal';
import { ErrorModalItem } from './ErrorModalItem';

export const JoreErrorModal = () => {
  const dispatch = useDispatch();

  const { isOpen, errorModalTitle, singleErrorDetails, errorList } =
    useAppSelector(selectErrorModal);

  const onClose = () => {
    dispatch(closeErrorModalAction());
  };

  return (
    <ErrorModal
      isOpen={isOpen}
      onClose={onClose}
      heading={errorModalTitle}
      className="w-max max-w-[50%] rounded-md"
      bodyClassName="max-h-[50vh] space-y-2 overflow-y-auto"
    >
      {singleErrorDetails && (
        <ErrorModalItem
          details={singleErrorDetails.details}
          additionalDetails={singleErrorDetails.additionalDetails}
        />
      )}
      {errorList.map((error) => (
        <ErrorModalItem
          className="bg-slate-100"
          message={error.message}
          details={error.details}
          additionalDetails={error.additionalDetails}
          key={error.key}
        />
      ))}
    </ErrorModal>
  );
};
