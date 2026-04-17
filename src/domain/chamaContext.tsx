import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { createLesomSeedState } from '../seed/lesomDynamics';
import type { ChamaAppState } from '../types';
import { type ChamaAction, chamaReducer, getInitialPersistedState } from './chamaReducer';

const DEMO_KEY = 'chama-connect-demo';
const STATE_KEY = 'chama-connect-state';

type ChamaContextValue = {
  state: ChamaAppState;
  dispatch: React.Dispatch<ChamaAction>;
  demoMode: boolean;
  setDemoMode: (on: boolean) => void;
};

const ChamaContext = createContext<ChamaContextValue | null>(null);

export function ChamaProvider({ children }: { children: React.ReactNode }) {
  const [demoMode, setDemoModeState] = React.useState(() => {
    try {
      return localStorage.getItem(DEMO_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const [state, dispatch] = useReducer(
    chamaReducer,
    undefined,
    () => getInitialPersistedState(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(DEMO_KEY, demoMode ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  }, [demoMode]);

  useEffect(() => {
    if (demoMode) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, demoMode]);

  const setDemoMode = useCallback((on: boolean) => {
    setDemoModeState(on);
    if (on) {
      dispatch({ type: 'REPLACE_STATE', payload: createLesomSeedState() });
      try {
        localStorage.removeItem(STATE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      demoMode,
      setDemoMode,
    }),
    [state, demoMode, setDemoMode],
  );

  return <ChamaContext.Provider value={value}>{children}</ChamaContext.Provider>;
}

export function useChama() {
  const ctx = useContext(ChamaContext);
  if (!ctx) throw new Error('useChama must be used within ChamaProvider');
  return ctx;
}
