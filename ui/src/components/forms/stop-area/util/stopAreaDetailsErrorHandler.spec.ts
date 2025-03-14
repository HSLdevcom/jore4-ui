import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { showDangerToast } from '../../../../utils';
import { renderHook } from '../../../../utils/test-utils';
import { StopAreaFormState } from '../stopAreaFormSchema';
import { useStopAreaDetailsApolloErrorHandler } from './stopAreaDetailsErrorHandler';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('i18next', () => ({
  use: jest.fn(() => ({
    init: jest.fn(),
  })),
}));

jest.mock('../../../../utils', () => ({
  showDangerToast: jest.fn(),
}));

type TestError = Partial<ApolloError> & {
  cause: {
    message: string;
    extensions: { errorCode: string } | undefined;
  };
};
const mockStateDefaults = {
  indefinite: false,
  latitude: 0,
  longitude: 0,
  quays: [],
  validityStart: '',
};

describe('useStopAreaDetailsApolloErrorHandler', () => {
  const tMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslation as jest.Mock).mockReturnValue({ t: tMock });
  });

  test('should handle known error with details', () => {
    const knownErrorCode = 'STOP_PLACE_UNIQUE_NAME';
    const extensions = { errorCode: knownErrorCode };
    const errorWithKnownCode: TestError = {
      graphQLErrors: [],
      networkError: null,
      message: 'Known Error',
      cause: { extensions, message: knownErrorCode },
    };

    tMock.mockImplementation(
      (key, details) => `${key} ${JSON.stringify(details)}`,
    );

    const tryHandle = renderHook(() => useStopAreaDetailsApolloErrorHandler())
      .result.current;

    const details: StopAreaFormState = {
      ...mockStateDefaults,
      privateCode: 'Testlabel1',
      name: 'Testname1',
      nameSwe: 'TestnameSwe1',
    }; // Mock details data
    const handled = tryHandle(errorWithKnownCode as ApolloError, details);

    expect(handled).toBe(true);
    expect(tMock).toHaveBeenCalledWith(
      'stopAreaDetails.errors.stopPlacesUniqueName',
      details,
    );
    expect(showDangerToast).toHaveBeenCalledWith(
      'stopAreaDetails.errors.stopPlacesUniqueName {"indefinite":false,"latitude":0,"longitude":0,"quays":[],"validityStart":"","privateCode":"Testlabel1","name":"Testname1","nameSwe":"TestnameSwe1"}',
    );
  });

  test('should handle known error without details', () => {
    const knownErrorCode = 'STOP_PLACE_UNIQUE_PRIVATE_CODE';
    const extensions = { errorCode: knownErrorCode };
    const errorWithKnownCode: TestError = {
      graphQLErrors: [],
      networkError: null,
      message: 'Known Error',
      cause: { extensions, message: knownErrorCode },
    };

    tMock.mockImplementation((key) => key);

    const tryHandle = renderHook(() => useStopAreaDetailsApolloErrorHandler())
      .result.current;

    const handled = tryHandle(errorWithKnownCode as ApolloError);

    expect(handled).toBe(true);
    expect(tMock).toHaveBeenCalledWith(
      'stopAreaDetails.errors.stopPlacesUniquePrivateCode',
      undefined,
    );
    expect(showDangerToast).toHaveBeenCalledWith(
      'stopAreaDetails.errors.stopPlacesUniquePrivateCode',
    );
  });

  test('should not handle unknown error', () => {
    const unknownErrorCode = 'UNKNOWN_ERROR_CODE';
    const extensions = { errorCode: unknownErrorCode };
    const unknownError: TestError = {
      graphQLErrors: [],
      networkError: null,
      message: 'Unknown Error',
      cause: { extensions, message: unknownErrorCode },
    };

    tMock.mockImplementation((key) => key);

    const tryHandle = renderHook(() => useStopAreaDetailsApolloErrorHandler())
      .result.current;

    const handled = tryHandle(unknownError as ApolloError);

    expect(handled).toBe(false);
    expect(tMock).not.toHaveBeenCalled();
  });

  test('should not handle errors with no extensions', () => {
    const errorWithNoExtensions: TestError = {
      ...mockStateDefaults,
      graphQLErrors: [],
      networkError: null,
      message: 'Error with no extensions',
      cause: { message: '', extensions: undefined }, // No extensions in this case
    };

    tMock.mockImplementation((key) => key);

    const tryHandle = renderHook(() => useStopAreaDetailsApolloErrorHandler())
      .result.current;

    const handled = tryHandle(errorWithNoExtensions as ApolloError);

    expect(handled).toBe(false);
    expect(tMock).not.toHaveBeenCalled();
  });
});
