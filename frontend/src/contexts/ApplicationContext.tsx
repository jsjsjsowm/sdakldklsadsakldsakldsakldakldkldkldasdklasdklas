import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Application, Config, ExchangeRate, UserData } from '../types';
import { apiService } from '../services/apiService';
import toast from 'react-hot-toast';

interface ApplicationState {
  userData: UserData | null;
  config: Config | null;
  exchangeRate: ExchangeRate | null;
  currentApplication: Application | null;
  loading: {
    userData: boolean;
    config: boolean;
    exchangeRate: boolean;
    application: boolean;
  };
  error: string | null;
}

type ApplicationAction =
  | { type: 'SET_LOADING'; payload: { key: keyof ApplicationState['loading']; value: boolean } }
  | { type: 'SET_USER_DATA'; payload: UserData }
  | { type: 'SET_CONFIG'; payload: Config }
  | { type: 'SET_EXCHANGE_RATE'; payload: ExchangeRate }
  | { type: 'SET_CURRENT_APPLICATION'; payload: Application }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: ApplicationState = {
  userData: null,
  config: null,
  exchangeRate: null,
  currentApplication: null,
  loading: {
    userData: false,
    config: false,
    exchangeRate: false,
    application: false,
  },
  error: null,
};

function applicationReducer(state: ApplicationState, action: ApplicationAction): ApplicationState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
        currentApplication: action.payload.data,
      };
    case 'SET_CONFIG':
      return {
        ...state,
        config: action.payload,
      };
    case 'SET_EXCHANGE_RATE':
      return {
        ...state,
        exchangeRate: action.payload,
      };
    case 'SET_CURRENT_APPLICATION':
      return {
        ...state,
        currentApplication: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface ApplicationContextType {
  state: ApplicationState;
  loadUserData: () => Promise<void>;
  loadConfig: () => Promise<void>;
  loadExchangeRate: () => Promise<void>;
  updateUserActivity: () => Promise<void>;
  createApplication: (formData: FormData) => Promise<{ success: boolean; applicationId?: number; message?: string }>;
  confirmPayment: (applicationId: number, paymentType: 'full' | 'partial') => Promise<boolean>;
  clearError: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(applicationReducer, initialState);

  const setLoading = (key: keyof ApplicationState['loading'], value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    toast.error(error);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const loadUserData = async () => {
    try {
      setLoading('userData', true);
      const userData = await apiService.getUserData();
      dispatch({ type: 'SET_USER_DATA', payload: userData });
    } catch (error) {
      console.warn('API недоступен, используем демо режим');
      // Fallback для работы без backend
      const fallbackUserData = {
        hasApplication: false,
        data: null
      };
      dispatch({ type: 'SET_USER_DATA', payload: fallbackUserData });
    } finally {
      setLoading('userData', false);
    }
  };

  const loadConfig = async () => {
    try {
      setLoading('config', true);
      const config = await apiService.getConfig();
      dispatch({ type: 'SET_CONFIG', payload: config });
    } catch (error) {
      console.warn('API недоступен, используем резервную конфигурацию');
      // Fallback конфигурация для работы без backend
      const fallbackConfig = {
        prices: {
          categories: { A: 15000, B: 12000, C: 18000, D: 20000 },
          medical: { yes: 0, no: 3000, order: 5000 },
          school: { yes: 0, no: 2000 }
        },
        payment: {
          btc_address: "demo_btc_address",
          usdt_address: "demo_usdt_address", 
          ton_address: "demo_ton_address"
        },
        telegram: {
          bot_username: "demo_bot",
          admin_chat_id: "demo_chat"
        }
      };
      dispatch({ type: 'SET_CONFIG', payload: fallbackConfig });
    } finally {
      setLoading('config', false);
    }
  };

  const loadExchangeRate = async () => {
    try {
      setLoading('exchangeRate', true);
      const rate = await apiService.getExchangeRate();
      dispatch({ type: 'SET_EXCHANGE_RATE', payload: rate });
    } catch (error) {
      console.warn('Ошибка загрузки курса валют, используется резервное значение');
      dispatch({
        type: 'SET_EXCHANGE_RATE',
        payload: {
          success: true,
          rate: 90,
          source: 'Резервное значение',
          timestamp: Math.floor(Date.now() / 1000),
        },
      });
    } finally {
      setLoading('exchangeRate', false);
    }
  };

  const updateUserActivity = async () => {
    try {
      await apiService.updateUserActivity();
    } catch (error) {
      // Silently fail for activity updates
    }
  };

  const createApplication = async (formData: FormData) => {
    try {
      setLoading('application', true);
      const result = await apiService.createApplication(formData);
      
      if (result.success) {
        // Reload user data to get updated application
        await loadUserData();
        toast.success(result.message || 'Заявка создана успешно');
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка создания заявки';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading('application', false);
    }
  };

  const confirmPayment = async (applicationId: number, paymentType: 'full' | 'partial') => {
    try {
      setLoading('application', true);
      const result = await apiService.confirmPayment(applicationId, paymentType);
      
      if (result.success) {
        dispatch({ type: 'SET_CURRENT_APPLICATION', payload: result.data });
        toast.success(result.message || 'Оплата подтверждена');
        return true;
      }
      
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка подтверждения оплаты';
      setError(message);
      return false;
    } finally {
      setLoading('application', false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    loadUserData();
    loadConfig();
    loadExchangeRate();
  }, []);

  // Update user activity periodically
  useEffect(() => {
    const interval = setInterval(updateUserActivity, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const contextValue: ApplicationContextType = {
    state,
    loadUserData,
    loadConfig,
    loadExchangeRate,
    updateUserActivity,
    createApplication,
    confirmPayment,
    clearError,
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}
