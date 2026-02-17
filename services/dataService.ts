import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, deleteDoc, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firebaseServices, APP_ID } from './firebase';
import { Employee, MonthlyData } from '../types';

// Helper pour lire le localStorage de manière synchrone (Instantané)
const getLocalEmployees = (): Employee[] => {
  try {
    const saved = localStorage.getItem('hassi_berkane_data');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Erreur lecture locale", e);
    return [];
  }
};

const getLocalMonthlyData = (key: string): MonthlyData | null => {
  try {
    const local = localStorage.getItem('hassi_berkane_monthly');
    const store = local ? JSON.parse(local) : {};
    return store[key] || null;
  } catch (e) {
    return null;
  }
};

export const useDataService = () => {
  // Initialisation "Lazy": On charge les données locales DIRECTEMENT à l'initialisation
  // Cela garantit que les données sont là avant même le premier affichage
  const [employees, setEmployees] = useState<Employee[]>(getLocalEmployees);
  const [loading, setLoading] = useState(employees.length === 0); // Si on a des données locales, on ne montre pas le chargement
  const [isFirebaseMode, setIsFirebaseMode] = useState(firebaseServices.isAvailable);

  // Synchronisation Firebase (si disponible)
  useEffect(() => {
    if (isFirebaseMode && firebaseServices.db) {
      setLoading(true);
      const colRef = collection(firebaseServices.db, 'artifacts', APP_ID, 'public', 'data', 'employees');
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Employee));
        const sortedData = data.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
        
        setEmployees(sortedData);
        // On met à jour le cache local avec les données fraîches du serveur
        localStorage.setItem('hassi_berkane_data', JSON.stringify(sortedData));
        setLoading(false);
      }, (err) => {
        console.warn("Erreur Firebase, bascule en mode local", err);
        setIsFirebaseMode(false);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // En mode local pur, on a déjà chargé les données via useState(getLocalEmployees)
      // On s'assure juste que le loading est désactivé
      setLoading(false);
    }
  }, [isFirebaseMode]);

  // CRUD Operations
  const saveEmployee = async (employee: Omit<Employee, 'id'>, id?: string) => {
    if (id) {
      // Update
      if (isFirebaseMode && firebaseServices.db) {
        await updateDoc(doc(firebaseServices.db, 'artifacts', APP_ID, 'public', 'data', 'employees', id), { ...employee });
      } else {
        const updated = employees.map(emp => emp.id === id ? { ...employee, id } : emp);
        setEmployees(updated);
        localStorage.setItem('hassi_berkane_data', JSON.stringify(updated));
      }
    } else {
      // Create
      if (isFirebaseMode && firebaseServices.db) {
        await addDoc(collection(firebaseServices.db, 'artifacts', APP_ID, 'public', 'data', 'employees'), employee);
      } else {
        const newId = Date.now().toString();
        const newEmployee = { ...employee, id: newId };
        const updated = [...employees, newEmployee];
        
        // Mise à jour immédiate
        setEmployees(updated);
        localStorage.setItem('hassi_berkane_data', JSON.stringify(updated));
      }
    }
  };

  const deleteEmployee = async (id: string) => {
    if (isFirebaseMode && firebaseServices.db) {
      await deleteDoc(doc(firebaseServices.db, 'artifacts', APP_ID, 'public', 'data', 'employees', id));
    } else {
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem('hassi_berkane_data', JSON.stringify(updated));
    }
  };

  return { employees, loading, saveEmployee, deleteEmployee, isFirebaseMode };
};

export const useMonthlyData = (employeeId: string | null, year: number, month: number, isFirebaseMode: boolean) => {
  const getKey = () => `monthly_${employeeId}_${year}_${month}`;

  // Initialisation instantanée pour les données mensuelles aussi
  const [data, setData] = useState<MonthlyData | null>(() => {
    if (!employeeId) return null;
    return getLocalMonthlyData(getKey());
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId) {
      setData(null);
      return;
    }

    const key = getKey();
    const mplus = month + 1;
    
    // Structure par défaut
    const defaultData: MonthlyData = {
      employeeId,
      month,
      year,
      workedDays: [], 
      manualNbJours: "", 
      numActe: "33",
      datePrise: `${year}-${mplus.toString().padStart(2, '0')}-01`,
      dateFin: `${year}-${mplus.toString().padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`,
      dateEng: `${year}-${mplus.toString().padStart(2, '0')}-02`
    };

    // Si on a déjà chargé les données locales via le useState, on ne refait pas le travail sauf si on est en mode Firebase
    if (!data || isFirebaseMode) {
        setLoading(true);
        if (isFirebaseMode && firebaseServices.db) {
        const docRef = doc(firebaseServices.db, 'artifacts', APP_ID, 'public', 'data', 'monthly_records', key);
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const fetchedData = snap.data() as MonthlyData;
                setData(fetchedData);
                // Mise à jour du cache local
                const local = localStorage.getItem('hassi_berkane_monthly');
                const store = local ? JSON.parse(local) : {};
                store[key] = fetchedData;
                localStorage.setItem('hassi_berkane_monthly', JSON.stringify(store));
            } else {
                setData(defaultData);
            }
            setLoading(false);
        });
        return () => unsubscribe();
        } else {
        // Mode local : si le useState n'a rien trouvé (null), on met les données par défaut
        const cached = getLocalMonthlyData(key);
        setData(cached || defaultData);
        setLoading(false);
        }
    }
  }, [employeeId, year, month, isFirebaseMode]);

  const saveMonthlyData = async (newData: MonthlyData) => {
    if (!employeeId) return;
    const key = getKey();
    const finalData = { ...newData, employeeId, month, year, updatedAt: new Date().toISOString() };
    
    setData(finalData); // Mise à jour optimiste (immédiate sur l'interface)

    // Sauvegarde Locale Toujours (comme backup)
    const local = localStorage.getItem('hassi_berkane_monthly');
    const store = local ? JSON.parse(local) : {};
    store[key] = finalData;
    localStorage.setItem('hassi_berkane_monthly', JSON.stringify(store));

    // Sauvegarde Cloud si dispo
    if (isFirebaseMode && firebaseServices.db) {
      try {
        await setDoc(doc(firebaseServices.db, 'artifacts', APP_ID, 'public', 'data', 'monthly_records', key), finalData, { merge: true });
      } catch (e) { console.error("Erreur sauvegarde mensuelle", e); }
    }
  };

  return { data, loading, saveMonthlyData };
};