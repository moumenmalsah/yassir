import React from 'react';
import { Employee, MonthlyData, SalaryCalculation } from '../../types';
import { MOIS_FR } from '../../constants';

interface PrintProps {
  employee: Employee;
  monthlyData: MonthlyData;
  salary: SalaryCalculation;
}

const DecisionPrint: React.FC<PrintProps> = ({ employee, monthlyData, salary }) => {
  const gradeText = employee.emploi || 'Ouvrier Spécialisé';

  // Format date dd-mm-yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "XX-XX-XXXX";
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  return (
    <div className="w-[21cm] min-h-[29.6cm] mx-auto pt-[0.5cm] px-[1.5cm] pb-[0.5cm] bg-white flex flex-col text-left font-times text-black">
      {/* Header */}
      <div className="flex flex-col mb-4 font-times text-[11pt] leading-tight w-96">
        <p className="font-bold">ROYAUME DU MAROC</p>
        <p>MINISTERE DE L’INTERIEUR</p>
        <p>PROVINCE DE NADOR</p>
        <p>CERCLE DE LOUTA</p>
        <p>CAIDAT HASSI BERKANE</p>
        <p className="font-bold underline decoration-1 underline-offset-2">Commune de Hassi Berkane</p>
      </div>

      {/* Title */}
      <div className="flex justify-center mb-4">
        <h2 className="text-[20pt] font-bold uppercase tracking-wide px-6 py-1 bg-gray-300 print:bg-gray-300">DECISION</h2>
      </div>
      
      {/* Preamble Authority */}
      <p className="font-times font-bold text-[14pt] mb-4">Le président de la commune de HASSI BERKANE .</p>
      
      {/* Les Vus */}
      <div className="space-y-1 mb-4 text-justify pl-4 font-times font-bold text-[12pt] leading-snug">
        <p className="relative pl-5">
          <span className="absolute left-0 top-0">-</span> Vu le dahir N°1.58.008 du 4 Chaoual 1377 ( 24 Février 1958) portant statut Général de la fonction publique.
        </p>
        <p className="relative pl-5">
          <span className="absolute left-0 top-0">-</span> Vu le dahir N°1.15.85 du Ramadan 1436 (07-07-2015) Portant l’Exécution de La loi n° 14.113 Relative à l’organisation des collectivités territoriales.
        </p>
        <p className="relative pl-5">
          <span className="absolute left-0 top-0">-</span> Vu le décret N° 451-17-2 du 4 Rabia 1er 1439 (23 Novembre 2017) relatif à la Comptabilité publique des communes et des établissements de coopération entre les communes.
        </p>
        <p className="relative pl-5">
          <span className="absolute left-0 top-0">-</span> Vu la lettre d’engagement portant l’emploi d’un {gradeText.toLowerCase()} occasionnel N° :{monthlyData.numActe} .
        </p>
        <p className="relative pl-5">
          <span className="absolute left-0 top-0">-</span> Vu les crédits ouverts à l’article {employee.codeBudget} au titre de l’exercice {monthlyData.year}.
        </p>
      </div>

      {/* DECIDE */}
      <div className="flex justify-center mb-4">
        <h3 className="text-[14pt] font-bold uppercase tracking-wide px-8 py-1 bg-gray-300 print:bg-gray-300">DECIDE</h3>
      </div>
      
      {/* Articles */}
      <div className="space-y-4 text-justify leading-tight">
        {/* Article 1 */}
        <div>
          <div className="mb-2">
             <span className="font-times font-bold text-[12pt] underline decoration-1 underline-offset-2 bg-gray-300 print:bg-gray-300 px-2 py-0.5">Article Premier :</span>
          </div>
          
          <div className="font-times text-[12pt] pl-4 leading-relaxed">
            A compter du : <span className="text-[14pt] font-bold">01 {MOIS_FR[monthlyData.month]} {monthlyData.year}</span>: <span className="text-[14pt] font-bold uppercase">{employee.nom} {employee.prenom} (CIN: {employee.cin})</span>; <span className="text-[14pt] font-bold">{gradeText}</span> ; affecté à la commune de HASSI BERKANE ayant comme fonction {employee.fonction.toLowerCase()}.
          </div>
        </div>
        
        {/* Article 2 */}
        <div>
          <div className="mb-2">
             <span className="font-times font-bold text-[12pt] underline decoration-1 underline-offset-2 bg-gray-300 print:bg-gray-300 px-2 py-0.5">Article Deuxième :</span>
             <span className="font-times text-[12pt] ml-2">Le salaire journalier de l’intéressé s’élève à :</span>
          </div>
          
          <div className="pl-4">
            <div className="my-1 font-arial font-bold text-[15pt] text-center">
              {salary.nbJours}j X {salary.dailyRate.toFixed(2)} DHS = {salary.totalBrut} DHS
              {employee.rcarEnabled && (
                <> - {salary.rcarAmount} DHS = {salary.totalNet} DHS</>
              )}
            </div>
            
            <p className="font-times font-bold text-[12pt]">
              , est versé à son compte Albarid Bank N°: <span className="font-times font-bold text-[15pt] ml-2">{employee.rib}</span> .
            </p>
          </div>
        </div>

        {/* Article 3 */}
        <div>
           <div className="mb-1">
             <span className="font-times font-bold text-[12pt] underline decoration-1 underline-offset-2 bg-gray-300 print:bg-gray-300 px-2 py-0.5">Article Troisième :</span> 
           </div>
           <p className="font-times font-bold text-[12pt] pl-4">
            Le percepteur de Zaio est chargé de ce qui concerne l’application de la présente décision.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-right font-bold font-times text-[12pt]">
        <p className="mb-6 underline decoration-1 underline-offset-4">Hassi Berkane Le: {formatDate(monthlyData.dateFin)}</p>
        <div className="text-center inline-block min-w-[250px] mr-4">
          <p className="font-bold underline decoration-1 underline-offset-4 uppercase">Le président</p>
        </div>
      </div>
    </div>
  );
};

export default DecisionPrint;