export interface ClinicalStatusItem {
  checked: boolean;
  date: string;
  details: string;
}

export interface VLHistoryItem {
  sampleDate: string;
  result: string;
  reason: string;
}

export interface ARTHistoryItem {
  regimen: string;
  startDate: string;
  stopDate: string;
  reason: string;
}

export interface TBHistoryItem {
  tbRegimen: string;
  startDate: string;
  stopDate: string;
  artRegimen: string;
}

export interface DrugItem {
  drug: string;
  startDate: string;
  stopDate: string;
}

export interface ARTInterruptionItem {
  date: string;
  duration: string;
  reason: string;
}

export interface AdherenceTrackingItem {
  scheduledDate: string;
  actualDate: string;
  dosesMissed: string;
  challenges: string;
}

export interface Application {
  patientFirstName: string;
  patientLastName: string;
  birthDate: string;
  age: string;
  sex: string;
  pregnancyDueDate: string;
  nationalId: string;
  artRegNo: string;
  facilityName: string;
  clinicianFirstName: string;
  clinicianLastName: string;
  clinicianEmail: string;
  clinicianPhone: string;
  clinicalStatus: { [key: string]: ClinicalStatusItem };
  weight: string;
  height: string;
  bmi: string;
  muac: string;
  hb: string;
  hbDate: string;
  cd4: string;
  cd4Date: string;
  creatinine: string;
  creatinineDate: string;
  alt: string;
  altDate: string;
  bilirubin: string;
  bilirubinDate: string;
  hepB: string;
  hepBDate: string;
  lam: string;
  lamDate: string;
  crag: string;
  cragDate: string;
  vlHistory: VLHistoryItem[];
  artHistory: ARTHistoryItem[];
  tbHistory: TBHistoryItem[];
  otherDrugs: DrugItem[];
  artInterruptions: ARTInterruptionItem[];
  adherenceTracking: AdherenceTrackingItem[];
  adherenceQuestions: {
    daysMissedMonth: string;
    daysMissedWeek: string;
    totalSupportSessions: string;
    lastSupportOutcome: string;
  };
  pediatricInfo: {
    disclosure: string;
    canSwallowTablets: string;
  };
  otherConditions: string;
}
