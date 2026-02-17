import React, { useRef } from 'react';
import { Users, UserPlus, FileCheck, FileText, Calculator, Briefcase, Download, Upload } from 'lucide-react';
import { TabView } from '../types';

interface SidebarProps {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  resetSelection: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, resetSelection }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const NavButton = ({ tab, icon: Icon, label }: { tab: TabView; icon: any; label: string }) => (
    <button
      onClick={() => {
        if (tab === 'add') resetSelection();
        setActiveTab(tab);
      }}
      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group ${
        activeTab === tab 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} className={activeTab === tab ? "text-white" : "text-slate-500 group-hover:text-white"} />
      <span className="text-sm font-semibold tracking-wide text-left flex-1">{label}</span>
      {activeTab === tab && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </button>
  );

  const handleExport = () => {
    const employees = localStorage.getItem('hassi_berkane_data');
    const monthly = localStorage.getItem('hassi_berkane_monthly');
    
    const data = {
      employees: employees ? JSON.parse(employees) : [],
      monthly: monthly ? JSON.parse(monthly) : {}
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hassi_berkane_db_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!window.confirm("Attention : L'importation va écraser les données actuelles. Voulez-vous continuer ?")) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.employees) {
          localStorage.setItem('hassi_berkane_data', JSON.stringify(data.employees));
        }
        if (data.monthly) {
          localStorage.setItem('hassi_berkane_monthly', JSON.stringify(data.monthly));
        }
        
        alert("Données importées avec succès ! La page va se recharger.");
        window.location.reload();
      } catch (err) {
        alert("Erreur : Le fichier semble invalide.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <aside className="w-full md:w-72 bg-slate-900 text-white p-6 print:hidden shadow-2xl flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0">
      <div className="mb-10 pt-4 flex flex-col items-center border-b border-slate-800 pb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-lg mb-4 text-white">
          <Briefcase size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight uppercase">Hassi Berkane</h1>
        <p className="text-[11px] font-bold text-blue-400 mt-1 uppercase tracking-[0.2em]">Ressources Humaines</p>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        <div className="px-4 pb-2 pt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Gestion</div>
        <NavButton tab="list" icon={Users} label="Registre Agents" />
        <NavButton tab="add" icon={UserPlus} label="Inscrire Agent" />
        
        <div className="px-4 pb-2 pt-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">Documents</div>
        <NavButton tab="decision" icon={FileCheck} label="Décision" />
        <NavButton tab="engagement" icon={FileText} label="Engagement" />
        <NavButton tab="liquidation" icon={Calculator} label="Liquidation" />

        <div className="px-4 pb-2 pt-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">Base de Données</div>
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 p-4 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group"
        >
          <Download size={20} className="text-slate-500 group-hover:text-white" />
          <span className="text-sm font-semibold tracking-wide text-left flex-1">Sauvegarder</span>
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-3 p-4 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group"
        >
          <Upload size={20} className="text-slate-500 group-hover:text-white" />
          <span className="text-sm font-semibold tracking-wide text-left flex-1">Restaurer</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".json" 
          onChange={handleImport}
        />
      </nav>

      <div className="mt-auto pt-6 text-center text-slate-600 border-t border-slate-800">
        <p className="text-[10px] mb-2 font-medium">v2.1.0 &bull; Local Storage</p>
        <p 
          id="_sys_integrity_sig_" 
          className="text-[9px] font-mono text-slate-700 select-none opacity-60 hover:opacity-100 transition-opacity"
        >
          DEVLOPPED with &lt;3 by Pr. Malsah Moumen
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;