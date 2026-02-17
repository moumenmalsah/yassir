export const SALAIRES: Record<string, number> = {
  "Ouvrier Qualifié": 105.40,
  "Ouvrière Qualifiée": 105.40,
  "Ouvrier Spécialisé": 100.40,
  "Ouvrière Spécialisée": 100.40,
  "Ouvrier Non Spécialisé": 93.00,
  "Ouvrière Non Spécialisée": 93.00
};

export const FONCTIONS = [
  "Secrétariat au bureau d’ordre",
  "Secrétaire au bureau d’état civil",
  "Service de recette",
  "La légalisation de la signature et la certification des documents conforme à l’original",
  "Conducteur d’automobile de service",
  "Conducteur d’automobile de service et des ambulances de la commune et du centre hospitalier de HASSI BERKANE et camion à usage de ramassage des ordures ménagères.",
  "Conducteur d’engin (trax) de la commune",
  "Nettoyage de la maison communale",
  "Gardien de parc automobile de la commune",
  "Ramassage des ordures ménagères du centre communal",
  "Service du parc automobile communal",
  "Agent entretien et réparation du réseau électrique communal"
];

export const MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export const DEFAULT_EMPLOYEE_FORM = {
  nom: '', 
  prenom: '', 
  cin: '', 
  rib: '', 
  codeBudget: '1020201014',
  emploi: 'Ouvrier Spécialisé', 
  fonction: FONCTIONS[5], 
  rcarEnabled: false
};