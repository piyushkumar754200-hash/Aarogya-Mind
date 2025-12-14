import React, { useState } from 'react';
import { ViewState, Patient, Ambulance } from './types';
import { MOCK_PATIENTS, MOCK_AMBULANCES, USER_LOCATION } from './constants';
import { findNearestAmbulance } from './services/emergencyLogic';
import { RecordCard } from './components/RecordCard';
import { GridMap } from './components/GridMap';
import { 
  HeartPulse, 
  LayoutDashboard,
  Siren, 
  Phone, 
  ShieldCheck, 
  Map, 
  ChevronLeft,
  Menu,
  X,
  Loader2,
  QrCode,
  FileText,
  Activity,
  User,
  LogOut,
  Bell,
  Search
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [abhaInput, setAbhaInput] = useState('');
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);
  
  // Ambulance Logic State
  const [isSearching, setIsSearching] = useState(false);
  const [nearestAmbulance, setNearestAmbulance] = useState<Ambulance | null>(null);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(MOCK_AMBULANCES);

  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // -- Actions --

  const handleSearchPatient = () => {
    if (!abhaInput) return;
    
    setIsSearchingPatient(true);
    setError('');

    // Simulate API network delay
    setTimeout(() => {
        const formattedId = abhaInput.toUpperCase().trim();
        if (MOCK_PATIENTS[formattedId]) {
          setPatientData(MOCK_PATIENTS[formattedId]);
          setError('');
          setView('DASHBOARD'); // Go to dashboard on success
        } else {
          setPatientData(null);
          setError('Invalid ABHA ID. Please check records.');
        }
        setIsSearchingPatient(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearchPatient();
  };

  const fillDemoId = (id: string) => {
      setAbhaInput(id);
      setError('');
  };

  const handleEmergencyRequest = () => {
    setIsSearching(true);
    setNearestAmbulance(null);
    
    setTimeout(() => {
      const found = findNearestAmbulance(USER_LOCATION, ambulances);
      setNearestAmbulance(found);
      setIsSearching(false);
      
      if (found) {
        setAmbulances(prev => prev.map(a => 
          a.id === found.id ? { ...a, status: 'Dispatched' } : a
        ));
      }
    }, 2000);
  };

  const resetEmergency = () => {
    setNearestAmbulance(null);
    setAmbulances(MOCK_AMBULANCES);
    setIsSearching(false);
  };

  const handleLogout = () => {
    setPatientData(null);
    setAbhaInput('');
    setView('DASHBOARD');
  };

  // -- UI Components --

  const NavItem = ({ id, label, icon: Icon, active }: { id: ViewState, label: string, icon: any, active: boolean }) => (
    <button 
      onClick={() => setView(id)}
      className={`
        flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${active 
          ? 'bg-teal-50 text-teal-700' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
        }
      `}
    >
      <Icon className={`w-4 h-4 mr-2.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
      {label}
    </button>
  );

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('DASHBOARD')}>
            <div className="bg-gradient-to-tr from-teal-500 to-teal-700 text-white p-2 rounded-xl shadow-lg shadow-teal-500/20">
              <HeartPulse size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Aarogya<span className="text-teal-600">Mind</span></h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Universal Health</p>
            </div>
          </div>
          
          {/* Desktop Nav */}
          {patientData && (
            <div className="hidden md:flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
              <NavItem id="DASHBOARD" label="Dashboard" icon={LayoutDashboard} active={view === 'DASHBOARD'} />
              <NavItem id="RECORDS" label="Medical Records" icon={FileText} active={view === 'RECORDS'} />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             {patientData ? (
               <>
                 <button 
                  onClick={() => setView('EMERGENCY')}
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-lg
                    ${view === 'EMERGENCY' ? 'bg-rose-700 shadow-rose-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 hover:scale-105'}
                  `}
                 >
                   <Siren size={16} className="animate-pulse" />
                   <span>SOS Emergency</span>
                 </button>
                 
                 <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                 
                 <div className="flex items-center gap-3">
                    <button className="relative p-2 text-slate-400 hover:text-teal-600 transition-colors">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                    </button>
                    <div className="hidden md:flex items-center gap-3 pl-2 cursor-pointer group" onClick={handleLogout}>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-teal-700">{patientData.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {patientData.abhaId}</p>
                      </div>
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-teal-200 group-hover:bg-teal-50 transition-colors">
                        <User size={16} className="text-slate-500 group-hover:text-teal-600" />
                      </div>
                    </div>
                 </div>
               </>
             ) : (
               <a href="#" className="text-sm font-medium text-slate-500 hover:text-teal-600">Provider Login</a>
             )}
             
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-xl absolute w-full z-50 animate-fade-in">
           {patientData ? (
             <>
               <button onClick={() => { setView('DASHBOARD'); setIsMenuOpen(false); }} className="flex items-center w-full p-3 rounded-lg bg-slate-50 text-slate-700 font-medium"><LayoutDashboard size={18} className="mr-3"/> Dashboard</button>
               <button onClick={() => { setView('RECORDS'); setIsMenuOpen(false); }} className="flex items-center w-full p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"><FileText size={18} className="mr-3"/> Records</button>
               <button onClick={() => { setView('EMERGENCY'); setIsMenuOpen(false); }} className="flex items-center w-full p-3 rounded-lg bg-rose-50 text-rose-600 font-medium"><Siren size={18} className="mr-3"/> SOS Emergency</button>
               <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg hover:bg-slate-50 text-slate-500 font-medium border-t border-slate-100 mt-2"><LogOut size={18} className="mr-3"/> Sign Out</button>
             </>
           ) : (
             <p className="text-center text-slate-400 py-4">Please login via Desktop to configure mobile access.</p>
           )}
        </div>
      )}
    </header>
  );

  const renderLogin = () => (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center bg-slate-50 p-4">
       <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 text-center animate-slide-up">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <QrCode className="text-teal-600 w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient Portal Access</h2>
          <p className="text-slate-500 text-sm mb-8">Securely access your universal health records using your government ABHA ID.</p>
          
          <div className="relative group mb-6">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
             </div>
             <input
               type="text"
               value={abhaInput}
               onChange={(e) => { setAbhaInput(e.target.value); setError(''); }}
               onKeyDown={handleKeyDown}
               placeholder="Enter ABHA ID (e.g., ABHA1234)"
               className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
             />
          </div>

          <button 
            onClick={handleSearchPatient}
            disabled={isSearchingPatient}
            className="w-full bg-slate-900 hover:bg-teal-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-slate-200 hover:shadow-teal-500/25"
          >
            {isSearchingPatient ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg border border-rose-100 flex items-center justify-center gap-2 animate-pulse">
               <ShieldCheck size={14} /> {error}
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <button
                onClick={() => setView('EMERGENCY')}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-rose-100 mb-6"
             >
                <Siren className="animate-pulse" size={20} />
                Emergency SOS Mode
             </button>

            <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider">Demo Access</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => fillDemoId('ABHA1234')} className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:border-teal-500 hover:text-teal-600 transition-colors">Piyush Kumar</button>
              <button onClick={() => fillDemoId('ABHA5678')} className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:border-teal-500 hover:text-teal-600 transition-colors">Abhishek Gupta</button>
            </div>
          </div>
       </div>
    </div>
  );

  const renderDashboard = () => {
    if (!patientData) return renderLogin();
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
           <h2 className="text-2xl font-bold text-slate-900">Good Morning, {patientData.name.split(' ')[0]}</h2>
           <p className="text-slate-500 text-sm">Here is your daily health summary.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Quick Actions */}
           <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Activity size={120} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-4">
                       <ShieldCheck size={12} /> ABHA Verified
                    </div>
                    <h3 className="text-3xl font-bold mb-2">Health Status: Stable</h3>
                    <p className="text-teal-100 max-w-sm">Your recent checkup indicates normal vitals. Keep up the good work with your medication schedule.</p>
                 </div>
                 <div className="mt-6 flex gap-3">
                    <button onClick={() => setView('RECORDS')} className="bg-white text-teal-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors shadow-lg shadow-black/5">
                       View Reports
                    </button>
                    <button onClick={() => setView('EMERGENCY')} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-900/20 flex items-center gap-2">
                       <Siren size={16} /> Emergency
                    </button>
                 </div>
              </div>
           </div>

           {/* Vitals Card */}
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Vitals</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><HeartPulse size={18} /></div>
                       <span className="text-sm font-medium text-slate-600">Heart Rate</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{patientData.vitals?.heartRate || '--'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Activity size={18} /></div>
                       <span className="text-sm font-medium text-slate-600">Blood Pressure</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{patientData.vitals?.bloodPressure || '--'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><User size={18} /></div>
                       <span className="text-sm font-medium text-slate-600">Weight</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{patientData.vitals?.weight || '--'}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Emergency Support Section */}
        <div className="mb-8">
           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Siren className="text-rose-500" size={20} /> Emergency Support
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ambulance */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                 <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Siren size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ambulance</p>
                    <p className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">102</p>
                 </div>
                 <button className="ml-auto bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                    <Phone size={20} />
                 </button>
              </div>

              {/* Police */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Police</p>
                    <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">100</p>
                 </div>
                 <button className="ml-auto bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Phone size={20} />
                 </button>
              </div>

              {/* Family */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                 <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <User size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Family</p>
                    <p className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{patientData.emergencyContact}</p>
                 </div>
                 <button className="ml-auto bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <Phone size={20} />
                 </button>
              </div>
           </div>
        </div>

        {/* Recent Records Snippet */}
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
           <button onClick={() => setView('RECORDS')} className="text-teal-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {patientData.records.slice(0, 2).map(r => (
               <RecordCard key={r.id} record={r} />
            ))}
        </div>
      </div>
    );
  };

  const renderRecords = () => {
    if (!patientData) return renderLogin();
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
         <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
            <span className="cursor-pointer hover:text-teal-600" onClick={() => setView('DASHBOARD')}>Dashboard</span>
            <ChevronLeft size={14} className="rotate-180" />
            <span className="font-semibold text-slate-900">Medical Records</span>
         </div>
         
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold text-slate-900">Medical History</h2>
                  <p className="text-sm text-slate-500 mt-1">Total {patientData.records.length} records found linked to {patientData.abhaId}</p>
               </div>
               <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:border-teal-500 hover:text-teal-600 transition-colors">
                  Filter / Sort
               </button>
            </div>
            <div className="p-6 space-y-4 bg-slate-50/30 min-h-[500px]">
               {patientData.records.map(record => (
                 <RecordCard key={record.id} record={record} />
               ))}
            </div>
         </div>
      </div>
    );
  };

  const renderEmergency = () => (
    <div className="h-[calc(100vh-64px)] bg-slate-900 flex flex-col relative animate-fade-in overflow-hidden">
      {/* Background Map Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }}>
      </div>

      <div className="relative z-10 flex-grow flex flex-col md:flex-row h-full">
         {/* Map Area */}
         <div className="flex-grow relative border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="absolute top-4 left-4 z-20 bg-slate-800/90 backdrop-blur text-white px-4 py-2 rounded-lg border border-slate-700 shadow-lg">
               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Your Location</p>
               <div className="flex items-center gap-2 text-sm font-mono">
                  <Map size={14} className="text-teal-400" />
                  26.9124° N, 75.7873° E
               </div>
            </div>
            <div className="h-full w-full flex items-center justify-center">
               <GridMap userLocation={USER_LOCATION} ambulances={ambulances} nearestAmbulance={nearestAmbulance} />
            </div>
         </div>

         {/* Command Panel */}
         <div className="w-full md:w-96 bg-slate-900 p-6 flex flex-col border-l border-slate-800 shadow-2xl z-20">
            {!patientData && (
              <button 
                onClick={() => setView('DASHBOARD')}
                className="mb-4 flex items-center text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium group"
              >
                <div className="p-1 rounded-full bg-slate-800 border border-slate-700 group-hover:border-teal-500/50 mr-2 transition-colors">
                    <ChevronLeft size={14} />
                </div>
                Back to Login
              </button>
            )}

            <div className="mb-auto">
               <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                 <Siren className="text-rose-500" /> Emergency Command
               </h2>
               <p className="text-slate-400 text-sm">Direct link to nearest ALS/BLS units.</p>
            </div>

            <div className="py-8">
               {!nearestAmbulance ? (
                 <div className="flex flex-col items-center">
                    <button 
                      onClick={handleEmergencyRequest}
                      disabled={isSearching}
                      className={`
                        relative group w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300
                        ${isSearching ? 'bg-slate-800' : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_60px_rgba(225,29,72,0.6)]'}
                      `}
                    >
                       {isSearching && <div className="absolute inset-0 border-4 border-rose-500/30 rounded-full animate-ping"></div>}
                       {isSearching ? <Loader2 size={48} className="text-white animate-spin" /> : <Siren size={48} className="text-white group-hover:scale-110 transition-transform" />}
                    </button>
                    <p className="mt-6 text-slate-300 font-medium tracking-wide">
                       {isSearching ? 'CONNECTING...' : 'TAP TO REQUEST'}
                    </p>
                 </div>
               ) : (
                 <div className="bg-slate-800 rounded-2xl p-5 border border-teal-500/30 shadow-lg shadow-teal-900/20 animate-slide-up">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center">
                          <ShieldCheck size={20} className="text-teal-400" />
                       </div>
                       <div>
                          <h3 className="text-white font-bold">Unit Dispatched</h3>
                          <p className="text-xs text-teal-400 font-mono">ID: {nearestAmbulance.id}</p>
                       </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">ETA</span>
                          <span className="text-teal-400 font-bold text-lg">{nearestAmbulance.eta} min</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Driver</span>
                          <span className="text-white">{nearestAmbulance.driverName}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Vehicle</span>
                          <span className="text-slate-300 font-mono">{nearestAmbulance.plateNumber}</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <button className="bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                          <Phone size={16} /> Call
                       </button>
                       <button onClick={resetEmergency} className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                          Cancel
                       </button>
                    </div>
                 </div>
               )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800">
               <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>System Status</span>
                  <span className="flex items-center gap-1.5 text-teal-500">
                     <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                     Online
                  </span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {renderHeader()}
      <main className="flex-grow flex flex-col">
        {view === 'DASHBOARD' && renderDashboard()}
        {view === 'RECORDS' && renderRecords()}
        {view === 'EMERGENCY' && renderEmergency()}
      </main>
    </div>
  );
};

export default App;