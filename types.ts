export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  cin: string;
  rib: string;
  codeBudget: string;
  emploi: string;
  fonction: string;
  rcarEnabled: boolean;
}

export interface MonthlyData {
  employeeId: string;
  month: number;
  year: number;
  workedDays: number[];
  manualNbJours: string;
  numActe: string;
  datePrise: string;
  dateFin: string;
  dateEng: string;
  updatedAt?: string;
}

export type TabView = 'list' | 'add' | 'edit' | 'decision' | 'engagement' | 'liquidation';

export interface SalaryCalculation {
  nbJours: number;
  dailyRate: number;
  totalBrut: string;
  rcarAmount: string;
  totalNet: string;
}

// Global window extensions for the provided legacy Firebase config
declare global {
  interface Window {
    __firebase_config?: any;
    __app_id?: string;
    __initial_auth_token?: string;
  }
}