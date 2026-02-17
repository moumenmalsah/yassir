import React from 'react';
import { Employee, MonthlyData } from '../../types';

interface PrintProps {
  employee: Employee;
  monthlyData: MonthlyData;
}

const EngagementPrint: React.FC<PrintProps> = ({ employee, monthlyData }) => {
  const isFemale = employee.emploi.toLowerCase().includes('ouvrière');
  const prefix = isFemale ? 'Mme' : 'M.';
  const gradeText = employee.emploi || 'Ouvrier Spécialisé';

  // Format date dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "XX/XX/XXXX";
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="w-[21cm] min-h-[29.6cm] mx-auto pt-[1cm] px-[2cm] pb-[1cm] bg-white flex flex-col text-left font-times text-black">
      {/* Header */}
      <div className="flex flex-col mb-4 font-bold uppercase text-[12pt] leading-tight w-full">
        <p className="underline decoration-1 underline-offset-2">ROYAUME DU MAROC</p>
        <p>MINISTERE DE L’INTERIEUR</p>
        <p>PROVINCE DE NADOR</p>
        <p>CERCLE DE LOUTA</p>
        <p>CAIDAT HASSI BERKANE</p>
        <p className="underline decoration-1 underline-offset-2">C .DE HASSI BERKANE</p>
        <p className="mt-2">N° :{monthlyData.numActe}/{monthlyData.year}/S.P</p>
      </div>

      {/* Title */}
      <div className="flex justify-center mb-4">
        <h2 className="text-[22pt] font-bold underline decoration-1 underline-offset-4 tracking-wide">Lettre D’engagement</h2>
      </div>
      
      {/* Recipient */}
      <div className="text-center mb-6 space-y-1 font-bold text-[14pt]">
        <p>Le président de la commune de Hassi Berkane</p>
        <p className="uppercase">A</p>
        <p className="uppercase tracking-wide">
          ({prefix} :{employee.nom} {employee.prenom})
        </p>
      </div>

      {/* Body */}
      <div className="space-y-4 text-justify leading-relaxed text-[13pt] font-medium">
        <p className="indent-16">
          J’ai l’honneur de vous faire connaitre que vous êtes employé à la commune de HASSI BERKANE, en qualité <span className="font-bold">d’{gradeText.toLowerCase()}</span>.
        </p>
        <p className="indent-16">
          En conséquence vous êtes à compter du : <span className="font-bold">{formatDate(monthlyData.datePrise)}</span>, occupé un emploi de la main d’œuvre rétribué sur les crédits du rubrique budgétaire :{employee.codeBudget},vous percevez à ce titre un salaire mensuel. Vous aurez droit en outre le cas échéant aux allocations familiales servies aux agents de votre catégorie.
        </p>
        <p className="indent-16">
          Veuillez agréer, monsieur, l’assurance de ma considération Distinguée.
        </p>
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-0">
          <div className="flex justify-end mb-4 text-[13pt] font-bold">
               <div className="text-center min-w-[300px]">
                  <p className="underline decoration-1 underline-offset-4 mb-2 uppercase">HASSI BERKANE Le : {formatDate(monthlyData.dateEng)}</p>
                  <p className="underline decoration-1 underline-offset-4 uppercase">Le Président</p>
              </div>
          </div>

          <div className="flex flex-col items-start font-bold text-[13pt]">
              <p>Date de Prise de service : {formatDate(monthlyData.datePrise)}</p>
              <p className="mt-2 ml-16 underline decoration-1 underline-offset-2">Lu et Accepté</p>
          </div>
      </div>
    </div>
  );
};

export default EngagementPrint;