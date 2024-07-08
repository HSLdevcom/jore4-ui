import qs, { ParsedQs } from 'qs';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const InitialUrParamsContext = createContext<ParsedQs>({});

export const InitialUrParamsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [params, setParams] = useState<ParsedQs>({});

  useEffect(() => {
    setParams(qs.parse(window.location.search, { ignoreQueryPrefix: true }));
  }, []);

  return (
    <InitialUrParamsContext.Provider value={params}>
      {children}
    </InitialUrParamsContext.Provider>
  );
};

export function useInitialUrlParams() {
  return useContext(InitialUrParamsContext);
}

export function useUiForE2e() {
  return useInitialUrlParams().e2e === 'true';
}
