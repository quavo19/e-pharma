export const GHANA_REGIONS = [
  { id: 'Ahafo', name: 'Ahafo' },
  { id: 'Ashanti', name: 'Ashanti' },
  { id: 'Bono', name: 'Bono' },
  { id: 'Bono East', name: 'Bono East' },
  { id: 'Central', name: 'Central' },
  { id: 'Eastern', name: 'Eastern' },
  { id: 'Greater Accra', name: 'Greater Accra' },
  { id: 'North East', name: 'North East' },
  { id: 'Northern', name: 'Northern' },
  { id: 'Oti', name: 'Oti' },
  { id: 'Savannah', name: 'Savannah' },
  { id: 'Upper East', name: 'Upper East' },
  { id: 'Upper West', name: 'Upper West' },
  { id: 'Volta', name: 'Volta' },
  { id: 'Western', name: 'Western' },
  { id: 'Western North', name: 'Western North' },
] as const;

export type GhanaRegion = (typeof GHANA_REGIONS)[number]['id'];
