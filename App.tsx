import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import DocumentManager from './components/DocumentManager';
import { useDataService } from './services/dataService';
import { initAuth } from './services/firebase';
import { TabView, Employee } from './types';
import { Loader2, Database, WifiOff } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabView>('list');
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const { employees, loading, saveEmployee, deleteEmployee, isFirebaseMode } = useDataService();

  useEffect(() => {
    initAuth();
  }, []);

  // ---------------------------------------------------------------------------
  // SECURITY WATCHDOG (Obfuscated)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (loading) return; 

    // Target: "Pr. Malsah Moumen" (Corrected Base64)
    const _k = atob('UHIuIE1hbHNhaCBNb3VtZW4='); 
    // ID: "_sys_integrity_sig_"
    const _i = atob('X3N5c19pbnRlZ3JpdHlfc2lnXw=='); 

    const _wd = setInterval(() => {
      try {
        const _e = document.getElementById(_i);
        let _bad = false;

        if (!_e) {
          // Element removed
          _bad = true;
        } else {
          // Verify content strictly includes the author name
          if (!_e.innerText.includes(_k)) _bad = true;
          
          // Verify visibility (anti-hide check)
          const _s = window.getComputedStyle(_e);
          // Fixed: Use parseFloat because opacity can be fractional (e.g. 0.6)
          // parseInt('0.6') results in 0, which caused false positives
          const op = parseFloat(_s.opacity || '1');
          
          if (_s.display === 'none' || _s.visibility === 'hidden' || op === 0) {
             _bad = true;
          }
        }

        if (_bad) {
          // CRITICAL ERROR SCREEN - NO INSTRUCTIONS
          document.body.innerHTML = `
            <div style="background:#050505; color:#e11d48; height:100vh; width:100vw; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:'Courier New', monospace; text-align:center; z-index:2147483647; position:fixed; top:0; left:0; user-select:none; cursor:not-allowed;">
              <h1 style="font-size:5rem; margin:0; line-height:1; letter-spacing:5px; text-shadow: 0 0 10px #e11d48;">SYSTEM HALTED</h1>
              <div style="width:100px; height:2px; background:#e11d48; margin:2rem 0;"></div>
              <p style="font-size:1.5rem; letter-spacing:2px; margin-bottom:1rem;">FATAL INTEGRITY ERROR</p>
              <p style="font-size:0.9rem; color:#881337;">ERR_CODE: 0xC0000409_ACCESS_DENIED</p>
            </div>
          `;
          clearInterval(_wd);
        }
      } catch (e) {
        // Silent fail or trigger crash
      }
    }, 2000); 

    return () => clearInterval(_wd);
  }, [loading]);
  // ---------------------------------------------------------------------------

  const handleEdit = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (emp) {
      setEditingEmployee(emp);
      setActiveTab('add');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet agent ?")) {
      await deleteEmployee(id);
      if (selectedEmpId === id) setSelectedEmpId(null);
    }
  };

  const handleSave = async (data: Omit<Employee, 'id'>) => {
    await saveEmployee(data, editingEmployee?.id);
    setEditingEmployee(null);
    setActiveTab('list');
  };

  const handleManageDocs = (id: string) => {
    setSelectedEmpId(id);
    setActiveTab('decision');
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-500 font-bold tracking-widest text-xs uppercase animate-pulse">Chargement...</p>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden print:overflow-visible print:h-auto print:block">
      <Sidebar 
        activeTab={activeTab === 'edit' ? 'add' : activeTab} // Map edit to add for sidebar highlighting
        setActiveTab={(tab) => {
          if (tab === 'add') setEditingEmployee(null);
          setActiveTab(tab);
        }} 
        resetSelection={() => {
          setSelectedEmpId(null);
          setEditingEmployee(null);
        }}
      />

      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth p-6 md:p-10 print:p-0 print:overflow-visible print:h-auto print:static">
        {/* Connection Status Indicator */}
        <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-100 text-[10px] font-bold uppercase tracking-wider print:hidden opacity-50 hover:opacity-100 transition-opacity">
          {isFirebaseMode ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-500">Cloud Sync</span>
              <Database size={12} className="text-slate-400" />
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <span className="text-slate-500">Local Mode</span>
              <WifiOff size={12} className="text-slate-400" />
            </>
          )}
        </div>

        {activeTab === 'list' && (
          <EmployeeList 
            employees={employees} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onManageDocs={handleManageDocs}
          />
        )}

        {activeTab === 'add' && (
          <EmployeeForm 
            initialData={editingEmployee} 
            onSave={handleSave} 
            onCancel={() => {
              setEditingEmployee(null);
              setActiveTab('list');
            }} 
          />
        )}

        {(activeTab === 'decision' || activeTab === 'engagement' || activeTab === 'liquidation') && (
          <DocumentManager 
            employees={employees}
            selectedEmpId={selectedEmpId}
            setSelectedEmpId={setSelectedEmpId}
            activeTab={activeTab}
            isFirebaseMode={isFirebaseMode}
          />
        )}
      </main>
    </div>
  );
};

export default App;