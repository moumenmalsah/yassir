import React from 'react';
import { Employee, MonthlyData, SalaryCalculation } from '../../types';

interface PrintProps {
  employee: Employee;
  monthlyData: MonthlyData;
  salary: SalaryCalculation;
}

const LiquidationPrint: React.FC<PrintProps> = ({ employee, monthlyData, salary }) => {
  // Format helpers
  const formatDate = (dateStr: string) => {
     if (!dateStr) return "XX/XX/XXXX";
     const d = new Date(dateStr);
     return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const periodHeader = `Du:${formatDate(monthlyData.datePrise)}\nau:${formatDate(monthlyData.dateFin)}`;

  return (
    <div className="w-[21cm] mx-auto pt-[0.5cm] px-[1cm] pb-[0.5cm] bg-white flex flex-col text-left font-arial text-black text-[11pt] print:h-[29.6cm] min-h-[29.6cm]">
      
      {/* Header Info */}
      <div className="font-bold uppercase leading-snug mb-2 text-[10pt] w-full border-b-0">
        <p>ROUYAUME DU MAROC</p>
        <p>MINISTERE DE L'INTERIEURE</p>
        <p>PROVINCE DE NADOR</p>
        <p>CERCLE DE LOUTA</p>
        <p>CAIDAT HASSI BERKANE</p>
        <p>C/T DE HASSI BERKANE</p>
      </div>

      {/* Title Box */}
      <div className="text-center py-2 mb-4">
        <h2 className="font-bold font-times text-[18pt] text-black">Etat de Liquidation</h2>
      </div>
      
      {/* Exercise */}
      <div className="text-center mb-4">
        <h3 className="font-bold text-[14pt]">Exercice {monthlyData.year}</h3>
      </div>

      {/* Employee Table */}
      <table className="w-full border-collapse border-[2px] border-black mb-1 text-black">
        <thead>
          <tr className="bg-[#bfbfbf] text-center h-10 align-middle">
             <th className="border-[2px] border-black py-1 w-[20%]">Prénom</th>
             <th className="border-[2px] border-black py-1 w-[20%]">Nom</th>
             <th className="border-[2px] border-black py-1 w-[15%]">C.I.N.N°</th>
             <th className="border-[2px] border-black py-1 w-[15%] leading-tight">Code<br/>Budgétaire</th>
             <th className="border-[2px] border-black py-1 w-[30%]">Emploi</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center font-bold h-14 align-middle">
            <td className="border-[2px] border-black uppercase">{employee.prenom}</td>
            <td className="border-[2px] border-black uppercase">{employee.nom}</td>
            <td className="border-[2px] border-black uppercase">{employee.cin}</td>
            <td className="border-[2px] border-black">{employee.codeBudget}</td>
            <td className="border-[2px] border-black">{employee.emploi}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="mb-1"></div>

      {/* Details Table */}
      <table className="w-full border-collapse border-[2px] border-black text-center font-bold text-black">
        <thead>
          <tr className="bg-[#bfbfbf] h-12 align-middle">
            <th className="border-[2px] border-black py-1 w-[25%] text-left pl-2">Nature des éléments</th>
            <th className="border-[2px] border-black py-1 w-[15%] leading-tight">prix de la<br/>journée</th>
            <th className="border-[2px] border-black py-1 w-[15%] leading-tight">Nombre des<br/>joures</th>
            <th className="border-[2px] border-black py-1 w-[15%]">Total</th>
            <th className="border-[2px] border-black py-1 w-[30%] whitespace-pre-line text-[10pt] leading-tight">
              {periodHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Salary Row */}
          <tr className="h-10 align-middle bg-[#bfbfbf] bg-opacity-30">
            <td className="border-[2px] border-black text-left pl-2">{employee.emploi}</td>
            <td className="border-[2px] border-black bg-white">{salary.dailyRate.toFixed(2).replace('.', ',')}</td>
            <td className="border-[2px] border-black bg-white">{salary.nbJours}</td>
            <td className="border-[2px] border-black bg-white">{salary.totalBrut.replace('.', ',')}</td>
            <td className="border-[2px] border-black bg-white">0</td>
          </tr>
          {/* Family Charge Row */}
          <tr className="h-10 align-middle bg-[#bfbfbf] bg-opacity-30">
            <td className="border-[2px] border-black text-left pl-2">Charge de famille</td>
            <td className="border-[2px] border-black bg-white">0</td>
            <td className="border-[2px] border-black bg-white">0</td>
            <td className="border-[2px] border-black bg-white">0,00</td>
            <td className="border-[2px] border-black bg-white">0</td>
          </tr>
          {/* Total Brut Row */}
          <tr className="h-10 align-middle bg-[#bfbfbf] bg-opacity-30">
            <td className="border-[2px] border-black text-left pl-2">Total Brute</td>
            <td className="border-[2px] border-black bg-white"></td>
            <td className="border-[2px] border-black bg-white">0</td>
            <td className="border-[2px] border-black bg-white">{salary.totalBrut.replace('.', ',')}</td>
            <td className="border-[2px] border-black bg-white">0,00</td>
          </tr>
          {/* RCAR Row */}
          <tr className="h-10 align-middle bg-[#bfbfbf] bg-opacity-30">
            <td className="border-[2px] border-black text-left pl-2">R.C.A.R</td>
            <td className="border-[2px] border-black bg-white"></td>
            <td className="border-[2px] border-black bg-white">{employee.rcarEnabled ? '6%' : '0%'}</td>
            <td className="border-[2px] border-black bg-white">{salary.rcarAmount.replace('.', ',')}</td>
            <td className="border-[2px] border-black bg-white">0,00</td>
          </tr>
          {/* Net Row */}
          <tr className="h-12 align-middle">
             <td className="border-[2px] border-black bg-[#bfbfbf]"></td>
             <td colSpan={2} className="border-[2px] border-black text-right pr-4">Net à Ordonnancer</td>
             <td className="border-[2px] border-black">{salary.totalNet.replace('.', ',')}</td>
             <td className="border-[2px] border-black">0,00</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-6 text-right font-bold text-[12pt]">
        <p className="mb-8 underline decoration-1 underline-offset-2">HASSI BERKANE Le:{formatDate(monthlyData.dateFin)}</p>
        <p className="mr-8 underline decoration-1 underline-offset-2">Leprésident</p>
      </div>

    </div>
  );
};

export default LiquidationPrint;