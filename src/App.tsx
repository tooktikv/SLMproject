import { useState } from 'react';
import Sidebar from './components/Sidebar';
import { MenuIcon } from './components/icons';
import { Screen, CarTarget } from './types';
import Dashboard from './screens/Dashboard';
import SupplierManagement from './screens/SupplierManagement';
import Supplier360 from './screens/Supplier360';
import Onboarding from './screens/Onboarding';
import Qualification from './screens/Qualification';
import RiskManagement from './screens/RiskManagement';
import Performance from './screens/Performance';
import Audit from './screens/Audit';
import CAR from './screens/CAR';
import Compliance from './screens/Compliance';
import Relationship from './screens/Relationship';
import Analytics from './screens/Analytics';
import Administration from './screens/Administration';
import { Supplier, suppliers } from './data/suppliers';
import { NavigationProvider } from './NavigationContext';

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => (new URLSearchParams(window.location.search).get('screen') as Screen) || 'dashboard');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(suppliers[0]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [carTarget, setCarTarget] = useState<CarTarget | null>(null);

  const openCar = (target: CarTarget) => {
    setCarTarget(target);
    setScreen('car');
  };

  const openSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setScreen('supplier360');
  };

  function renderScreen() {
    switch (screen) {
      case 'dashboard': return <Dashboard />;
      case 'suppliers': return <SupplierManagement onOpenSupplier={openSupplier} />;
      case 'supplier360': return <Supplier360 supplier={selectedSupplier} onBack={() => setScreen('suppliers')} />;
      case 'onboarding': return <Onboarding />;
      case 'qualification': return <Qualification onOpenSupplier={openSupplier} />;
      case 'risk': return <RiskManagement />;
      case 'performance': return <Performance />;
      case 'audit': return <Audit />;
      case 'car': return <CAR />;
      case 'compliance': return <Compliance />;
      case 'relationship': return <Relationship />;
      case 'analytics': return <Analytics />;
      case 'administration': return <Administration />;
      default: return <Dashboard />;
    }
  }

  return (
    <NavigationProvider value={{ active: screen, navigate: setScreen, openSupplier, carTarget, openCar, clearCarTarget: () => setCarTarget(null) }}>
      <div className="flex h-full overflow-hidden bg-canvas font-sans text-ink-soft">
        <Sidebar active={screen} onNavigate={setScreen} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(true)}
          className="fixed left-3 top-3 z-30 hidden h-10 w-10 items-center justify-center rounded-control border border-line bg-surface text-ink-soft shadow-card transition-colors hover:bg-sunken max-lg:flex"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {renderScreen()}
        </main>
      </div>
    </NavigationProvider>
  );
}
