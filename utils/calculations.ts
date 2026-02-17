import { Employee, MonthlyData, SalaryCalculation } from '../types';
import { SALAIRES } from '../constants';

export const calculateSalary = (employee: Employee | undefined, monthlyData: MonthlyData | null): SalaryCalculation => {
  if (!employee || !monthlyData) {
    return { nbJours: 0, dailyRate: 0, totalBrut: "0.00", rcarAmount: "0.00", totalNet: "0.00" };
  }

  const nbJours = monthlyData.manualNbJours !== "" 
    ? parseFloat(monthlyData.manualNbJours) 
    : monthlyData.workedDays.length;
    
  const dailyRate = SALAIRES[employee.emploi] || 0;
  const totalBrutVal = nbJours * dailyRate;
  const rcarAmountVal = employee.rcarEnabled ? totalBrutVal * 0.06 : 0;
  const totalNetVal = totalBrutVal - rcarAmountVal;

  return {
    nbJours,
    dailyRate,
    totalBrut: totalBrutVal.toFixed(2),
    rcarAmount: rcarAmountVal.toFixed(2),
    totalNet: totalNetVal.toFixed(2)
  };
};