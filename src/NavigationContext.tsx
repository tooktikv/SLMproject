import { createContext, useContext } from 'react';
import { Supplier } from './data/suppliers';
import { CarTarget, Screen } from './types';

type NavigationContextValue = {
  active: Screen;
  navigate: (screen: Screen) => void;
  openSupplier: (supplier: Supplier) => void;
  carTarget: CarTarget | null;
  openCar: (target: CarTarget) => void;
  clearCarTarget: () => void;
};

const NavigationContext = createContext<NavigationContextValue>({
  active: 'dashboard',
  navigate: () => undefined,
  openSupplier: () => undefined,
  carTarget: null,
  openCar: () => undefined,
  clearCarTarget: () => undefined,
});

export const NavigationProvider = NavigationContext.Provider;
export const useNavigation = () => useContext(NavigationContext);