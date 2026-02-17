import React, { useMemo, useState } from 'react';
import { Search, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { Employee, TabView } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onManageDocs: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete, onManageDocs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => 
    employees.filter(e => 
      `${e.nom} ${e.prenom} ${e.cin}`.toLowerCase().includes(searchTerm.toLowerCase())
    ), [employees, searchTerm]
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase mb-1">Registre</h2>
           <p className="text-slate-500 font-medium">Gestion du personnel communal</p>
        </div>
       
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20}/>
          <input 
            type="text" 
            placeholder="Rechercher nom, CIN..." 
            className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none w-full shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </header>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Aucun agent trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((e) => (
            <div key={e.id} className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-extrabold tracking-widest font-arial uppercase">
                  {e.cin}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(e.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Pencil size={16}/></button>
                  <button onClick={() => onDelete(e.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
              
              <div className="flex-1 mb-6">
                <h4 className="text-xl font-black text-slate-800 leading-tight mb-1 uppercase truncate" title={`${e.nom} ${e.prenom}`}>
                  {e.nom} <span className="text-slate-500 font-bold">{e.prenom}</span>
                </h4>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wide truncate">{e.emploi}</p>
              </div>

              <button 
                onClick={() => onManageDocs(e.id)} 
                className="w-full bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <span>Dossier</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;