import React, { useEffect, useState } from 'react';
import { useMonthlyData } from '../services/dataService';
import { Employee, TabView, MonthlyData } from '../types';
import { MOIS_FR } from '../constants';
import { calculateSalary } from '../utils/calculations';
import { Calendar, CheckSquare, Square, Printer, Loader2 } from 'lucide-react';
import DecisionPrint from './Print/DecisionPrint';
import EngagementPrint from './Print/EngagementPrint';
import LiquidationPrint from './Print/LiquidationPrint';

interface DocumentManagerProps {
  employees: Employee[];
  selectedEmpId: string | null;
  setSelectedEmpId: (id: string) => void;
  activeTab: TabView;
  isFirebaseMode: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  employees, selectedEmpId, setSelectedEmpId, activeTab, isFirebaseMode 
}) => {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  
  const { data: fetchedMonthlyData, loading, saveMonthlyData } = useMonthlyData(selectedEmpId, selectedYear, selectedMonth, isFirebaseMode);
  
  // Local state to manage input changes without immediate saving
  const [localMonthlyData, setLocalMonthlyData] = useState<MonthlyData | null>(null);

  useEffect(() => {
    setLocalMonthlyData(fetchedMonthlyData);
  }, [fetchedMonthlyData]);

  // Use local data for UI responsiveness, fallback to fetched data
  const monthlyData = localMonthlyData || fetchedMonthlyData;

  // Default selection if none
  useEffect(() => {
    if (!selectedEmpId && employees.length > 0) {
      setSelectedEmpId(employees[0].id);
    }
  }, [employees, selectedEmpId, setSelectedEmpId]);

  const currentEmployee = employees.find(e => e.id === selectedEmpId);
  const daysInMonthNum = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const salaryCalc = calculateSalary(currentEmployee, monthlyData);

  // Handlers for text inputs
  const handleInputChange = (field: keyof MonthlyData, value: string) => {
    if (!localMonthlyData) return;
    setLocalMonthlyData({ ...localMonthlyData, [field]: value });
  };

  const handleBlur = () => {
    if (localMonthlyData) {
      saveMonthlyData(localMonthlyData);
    }
  };

  const handleDayToggle = (day: number) => {
    if (!monthlyData) return;
    const newDays = monthlyData.workedDays.includes(day) 
      ? monthlyData.workedDays.filter(d => d !== day) 
      : [...monthlyData.workedDays, day];
    
    const newData = { ...monthlyData, workedDays: newDays, manualNbJours: "" };
    setLocalMonthlyData(newData);
    saveMonthlyData(newData);
  };

  const setFullMonth = () => {
    if (!monthlyData) return;
    const newData = {...monthlyData, workedDays: Array.from({length: daysInMonthNum}, (_,i)=>i+1), manualNbJours: ""};
    setLocalMonthlyData(newData);
    saveMonthlyData(newData);
  };

  const clearMonth = () => {
    if (!monthlyData) return;
    const newData = {...monthlyData, workedDays: [], manualNbJours: ""};
    setLocalMonthlyData(newData);
    saveMonthlyData(newData);
  };

  if (!currentEmployee) return null;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* --- Control Panel (Hidden when printing) --- */}
      <div className="mb-8 bg-white p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-100 print:hidden relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
             <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-4">Agent concerné</label>
            <div className="relative">
              <select value={selectedEmpId || ''} onChange={e => setSelectedEmpId(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                {employees.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-4">Mois</label>
            <div className="relative">
               <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                {MOIS_FR.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-4">Année / Exercice</label>
            <input type="number" value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-center font-arial"/>
          </div>
        </div>

        {monthlyData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 ml-2 tracking-wide">N° Acte</label>
                <input 
                  type="text" 
                  value={monthlyData.numActe} 
                  onChange={e => handleInputChange('numActe', e.target.value)} 
                  onBlur={handleBlur}
                  className="w-full p-3 bg-white border-none rounded-xl outline-none font-bold text-center font-arial shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 ml-2 tracking-wide">Prise service</label>
                <input 
                  type="date" 
                  value={monthlyData.datePrise} 
                  onChange={e => handleInputChange('datePrise', e.target.value)} 
                  onBlur={handleBlur}
                  className="w-full p-3 bg-white border-none rounded-xl outline-none font-bold font-arial shadow-sm cursor-pointer" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 ml-2 tracking-wide">Fin service</label>
                <input 
                  type="date" 
                  value={monthlyData.dateFin} 
                  onChange={e => handleInputChange('dateFin', e.target.value)} 
                  onBlur={handleBlur}
                  className="w-full p-3 bg-white border-none rounded-xl outline-none font-bold font-arial shadow-sm cursor-pointer" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 ml-2 tracking-wide">Engagement</label>
                <input 
                  type="date" 
                  value={monthlyData.dateEng} 
                  onChange={e => handleInputChange('dateEng', e.target.value)} 
                  onBlur={handleBlur}
                  className="w-full p-3 bg-white border-none rounded-xl outline-none font-bold font-arial shadow-sm cursor-pointer" 
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-sm font-black text-slate-800 uppercase flex items-center gap-3">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={18} /></span> Pointage Journalier
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <input 
                      type="number" 
                      placeholder="Jours" 
                      value={monthlyData.manualNbJours} 
                      onChange={e => handleInputChange('manualNbJours', e.target.value)} 
                      onBlur={handleBlur}
                      className="p-2.5 border rounded-xl w-24 font-bold text-center font-arial text-sm" 
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Override manuel</span>
                  </div>
                  <button onClick={setFullMonth} className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">Tout</button>
                  <button onClick={clearMonth} className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all">Rien</button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: daysInMonthNum }, (_, i) => i + 1).map(day => (
                  <button 
                    key={day} 
                    onClick={() => handleDayToggle(day)} 
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-200
                      ${monthlyData.workedDays.includes(day) 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' 
                        : 'bg-white border-slate-100 text-slate-300 hover:border-blue-300 hover:text-blue-400'}
                    `}
                  >
                    <span className="text-xs font-bold font-arial">{day}</span>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex flex-col lg:flex-row items-center justify-between p-8 bg-slate-900 rounded-[2rem] text-white gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 md:divide-x divide-slate-700 z-10">
                  <div className="text-center px-4">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Jours Travaillés</p>
                    <p className="font-arial font-black text-4xl text-blue-400">{salaryCalc.nbJours}</p>
                  </div>
                  <div className="text-center md:text-left md:px-8">
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Brut</p>
                     <p className="font-arial font-bold text-2xl">{salaryCalc.totalBrut} <span className="text-sm font-medium opacity-50">DH</span></p>
                  </div>
                  {currentEmployee.rcarEnabled && (
                    <div className="text-center md:text-left md:px-8">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Retenue RCAR</p>
                      <p className="font-arial font-bold text-2xl text-red-400">-{salaryCalc.rcarAmount}</p>
                    </div>
                  )}
                   <div className="text-center md:text-left md:px-8">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Net à Payer</p>
                      <p className="font-arial font-black text-4xl text-green-400">{salaryCalc.totalNet} <span className="text-lg font-bold opacity-70">DH</span></p>
                    </div>
                </div>

                <button onClick={() => window.print()} className="bg-white text-slate-900 px-8 py-4 rounded-xl flex items-center gap-3 font-black text-xs uppercase shadow-xl hover:bg-blue-50 transition-all z-10 hover:scale-105 active:scale-95">
                  <Printer size={18} className="text-blue-600"/> Imprimer
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- Printable Area --- */}
      {monthlyData && (
        <div className="bg-white mx-auto shadow-2xl print:shadow-none font-serif text-black leading-tight print-page transition-all duration-500 origin-top">
           {activeTab === 'decision' && (
             <DecisionPrint employee={currentEmployee} monthlyData={monthlyData} salary={salaryCalc} />
           )}
           {activeTab === 'engagement' && (
             <EngagementPrint employee={currentEmployee} monthlyData={monthlyData} salary={salaryCalc} />
           )}
           {activeTab === 'liquidation' && (
             <LiquidationPrint employee={currentEmployee} monthlyData={monthlyData} salary={salaryCalc} />
           )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;