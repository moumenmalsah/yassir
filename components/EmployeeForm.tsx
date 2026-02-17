import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { SALAIRES, FONCTIONS, DEFAULT_EMPLOYEE_FORM } from '../constants';
import { Save, X } from 'lucide-react';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSave: (data: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

// DÉPLACEMENT ICI : Le composant Input doit être défini en dehors du composant parent
// pour éviter d'être recréé à chaque frappe, ce qui causait la perte du focus.
const Input = ({ label, value, onChange, placeholder, uppercase = false }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <input 
      required 
      placeholder={placeholder} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      // Utilisation de la classe CSS 'uppercase' pour l'affichage visuel seulement pendant la saisie
      className={`w-full px-5 py-3.5 bg-slate-50 border-transparent border focus:bg-white rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all ${uppercase ? 'uppercase' : ''}`}
    />
  </div>
);

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(DEFAULT_EMPLOYEE_FORM);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(DEFAULT_EMPLOYEE_FORM);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convertir en majuscules au moment de la sauvegarde uniquement
    const finalData = {
      ...formData,
      nom: formData.nom.toUpperCase(),
      cin: formData.cin.toUpperCase(),
      codeBudget: formData.codeBudget,
    };
    onSave(finalData);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight uppercase">
          {initialData ? "Modifier Agent" : "Nouvel Agent"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <Input label="Nom" placeholder="BEN..." value={formData.nom} onChange={(v: string) => setFormData({...formData, nom: v})} uppercase />
            <Input label="Prénom" placeholder="..." value={formData.prenom} onChange={(v: string) => setFormData({...formData, prenom: v})} />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Input label="CIN" placeholder="R..." value={formData.cin} onChange={(v: string) => setFormData({...formData, cin: v})} uppercase />
            <Input label="RIB" placeholder="24..." value={formData.rib} onChange={(v: string) => setFormData({...formData, rib: v})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Grade / Salaire</label>
            <div className="relative">
              <select 
                value={formData.emploi} 
                onChange={e => setFormData({...formData, emploi: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border-transparent border focus:bg-white rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold cursor-pointer appearance-none"
              >
                {Object.keys(SALAIRES).map(s => <option key={s} value={s}>{s} ({SALAIRES[s].toFixed(2)} dh/j)</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fonction</label>
            <div className="relative">
              <select 
                value={formData.fonction} 
                onChange={e => setFormData({...formData, fonction: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border-transparent border focus:bg-white rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-sm appearance-none"
              >
                {FONCTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <Input label="Code Budget" placeholder="10.20..." value={formData.codeBudget} onChange={(v: string) => setFormData({...formData, codeBudget: v})} />

          <label className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 cursor-pointer group hover:bg-blue-100 transition-colors">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={formData.rcarEnabled} 
                onChange={e => setFormData({...formData, rcarEnabled: e.target.checked})} 
                className="peer w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 focus:ring-4 focus:ring-blue-200 transition-all appearance-none cursor-pointer" 
              />
              <svg className="absolute w-4 h-4 text-white left-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-sm font-bold text-slate-700 uppercase group-hover:text-blue-800">Appliquer retenue R.C.A.R (6%)</span>
          </label>

          <div className="flex gap-4 pt-4 border-t border-slate-50">
            {initialData && (
              <button type="button" onClick={onCancel} className="flex-1 bg-white border-2 border-slate-200 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
                <X size={18} /> Annuler
              </button>
            )}
            <button type="submit" className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Save size={18} /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;