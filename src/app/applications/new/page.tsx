'use client';

import { Checkbox, Label, Select, TextInput } from 'flowbite-react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import Layout from '@/app/components/Layout';

type TestMonitoring = {
  patientId: number;
  testTypeId: number;
  testDate: string;
  result: string;
};

type TbHistory = {
  patientId: number;
  tbRegimen: number;
  startDate: string | '';
  endDate: string | '';
  artRegimen: number;
  additionalDrug: number;
};

type TreatmentHistory = {
  patientId: number;
  drug1Id: number;
  drug2Id: number;
  drug3Id: number;
  startDate: string | '';
  endDate: string | '';
  reasonForStopping: string | '';
};

type ArtInterruption = {
  patientId: number;
  dateStopped: string;
  duration: number;
  durationNumber: number;
  reasonForStopping: string;
};

type Adherence = {
  patientId: number;
  scheduledVisitDate: string;
  actualVisitDate: string;
  doseMissed: number;
  adherenceChallenges: string;
};

type AdherenceQuestions = {
  patientId: number;
  lastMonthMissedDose: number;
  lastWeekMissedDose: number;
  adherenceLastSession: number;
  lastDateOfSession: string;
  outcome: number;
  hivDisclosure: number;
  swallowTabs: number;
};

type Patient = {
  nationalId: string;
  firstname: string;
  lastname: string;
  ARTNumber: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  dateOfBirthEstimated: number;
  dateStartedART: string;
  patientPregnant: number;
  pregnantDueDate: string;
  testMonitoring: TestMonitoring[];
  tbHistory: TbHistory[];
  treatmentHistory: TreatmentHistory[];
  art_interruption: ArtInterruption[];
  adherence: Adherence[];
  adherenceQuestions: AdherenceQuestions;
};

type ApplicationData = {
  id: number;
  applicationDate: string;
  patientId: number;
  facilityId: number;
  patient: Patient;
};

const initialData: ApplicationData = {
  id: 0,
  applicationDate: new Date().toISOString(),
  patientId: 0,
  facilityId: 0,
  patient: {
    nationalId: '',
    firstname: '',
    lastname: '',
    ARTNumber: '',
    gender: '',
    dateOfBirth: '',
    age: 0,
    dateOfBirthEstimated: 1,
    dateStartedART: '',
    patientPregnant: 0,
    pregnantDueDate: '',
    testMonitoring: [],
    tbHistory: [],
    treatmentHistory: [],
    art_interruption: [],
    adherence: [],
    adherenceQuestions: {
      patientId: 0,
      lastMonthMissedDose: 0,
      lastWeekMissedDose: 0,
      adherenceLastSession: 0,
      lastDateOfSession: '',
      outcome: 0,
      hivDisclosure: 0,
      swallowTabs: 0,
    },
  },
};

const testType = [
  { id: 1, name: 'HIV Viral Load' },
  { id: 2, name: 'CD4' },
  { id: 3, name: 'CrAg' },
  { id: 4, name: 'LAM' },
  { id: 5, name: 'Hepatitis' },
  { id: 6, name: 'Creatinine' },
  { id: 7, name: 'Hepatitis B' },
  { id: 8, name: 'ALT' },
  { id: 9, name: 'Bilirubin' },
];

const tb_regimen = [
  { id: 1, name: 'Rifampin (RIF)' },
  { id: 2, name: 'Isoniazid (INH)' },
  { id: 3, name: 'Pyrazinamide (PZA)' },
  { id: 4, name: 'Ethambutol (EMB)' },
];

const period = [
  { id: 1, name: 'Days' },
  { id: 2, name: 'Weeks' },
  { id: 3, name: 'Months' },
  { id: 4, name: 'Years' },
];

const art_regimens = [
  {
    id: 1,
    regimen_code: '13A',
    formulation: 'Adult',
    drugs: 'TDF / 3TC / DTG (300/300/50 mg)',
    line: '1st line',
    applicable_to: 'Men and women weighing ≥30 kg',
    notes: 'Standard 1st line regimen for adults. “A” = adult formulation.',
  },
  {
    id: 2,
    regimen_code: '15PP',
    formulation: 'Paediatric + Paediatric',
    drugs: 'ABC/3TC (paed strength) + DTG 10 mg (paed)',
    line: '1st line',
    applicable_to: 'Children 3–19.9 kg',
    notes: 'Both tablets paediatric formulations.',
  },
  {
    id: 3,
    regimen_code: '15PA',
    formulation: 'Paediatric + Adult',
    drugs: 'ABC/3TC (paed strength) + DTG 50 mg (adult)',
    line: '1st line',
    applicable_to: 'Children 20.0–24.9 kg',
    notes: 'One tablet is paediatric, the other adult formulation.',
  },
  {
    id: 4,
    regimen_code: '15A',
    formulation: 'Adult',
    drugs: 'ABC / 3TC + DTG (adult doses)',
    line: '1st line',
    applicable_to: '25.0–29.9 kg',
    notes: 'Adult formulation used; transitioning weight band',
  },
  {
    id: 5,
    regimen_code: '4A',
    formulation: 'Adult',
    drugs: 'AZT / 3TC + EFV',
    line: 'Alternative 1st line',
    applicable_to: 'Adults (if standard regimen contraindicated)',
    notes: 'NNRTI-based alternative line',
  },
  {
    id: 6,
    regimen_code: '5A',
    formulation: 'Adult',
    drugs: 'TDF / 3TC + EFV',
    line: 'Alternative 1st line',
    applicable_to: 'Women who may get pregnant, reliably using contraception',
    notes: 'EFV based; specific population',
  },
  {
    id: 7,
    regimen_code: '17A',
    formulation: 'Adult',
    drugs: 'Other NNRTI-based alternative 1st line regimen',
    line: 'Alternative 1st line',
    applicable_to: 'Special cases / contraindications',
    notes: 'One of the remaining NNRTI-based alternative regimens',
  },
  {
    id: 8,
    regimen_code: '12A',
    formulation: 'Adult',
    drugs: '3rd line regimen (protease/integrase-based)',
    line: '3rd line',
    applicable_to: 'Patients who have failed 2nd line regimens',
    notes: 'Used under oversight (3rd line review committee)',
  },
];

const steps = [
  'Application Info',
  'Patient Info',
  'Test Monitoring',
  'Treatment History',
  'TB History',
  'ART Interruptions',
  'Adherence',
  'Review',
];

interface Facility {
  id: number;
  name: string;
}

interface NewTest extends Omit<TestMonitoring, 'id'> {
  patientId: number;
  testTypeId: number;
  testDate: string;
  result: string;
}

interface newARTTreatment extends Omit<TreatmentHistory, 'id'> {
  patientId: number;
  drug1Id: number;
  drug2Id: number;
  drug3Id: number;
  startDate: string | '';
  endDate: string | '';
  reasonForStopping: string | '';
}

interface newTBHistory extends TbHistory {
  patientId: number;
  tbRegimen: number;
  startDate: string | '';
  endDate: string | '';
  artRegimen: number;
  additionalDrug: number;
}

export default function Application() {
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [step, setStep] = useState(0);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [newTest, setNewTest] = useState<NewTest>({
    patientId: 0,
    testTypeId: 0,
    testDate: '',
    result: '',
  });
  const [newARTTreatment, setNewARTTreatment] = useState<newARTTreatment>({
    patientId: 0,
    drug1Id: 0,
    drug2Id: 0,
    drug3Id: 0,
    startDate: '',
    endDate: '',
    reasonForStopping: '',
  });

  const [newTBHistory, setNewTBHistory] = useState<newTBHistory>({
    patientId: 0,
    tbRegimen: 0,
    startDate: '',
    endDate: '',
    artRegimen: 0,
    additionalDrug: 0,
  });

  const [newARTInterruption, setNewARTInterruption] = useState<ArtInterruption>(
    {
      patientId: 0,
      dateStopped: '',
      duration: 0,
      durationNumber: 0,
      reasonForStopping: '',
    }
  );

  const [newAdherence, setNewAdherence] = useState<Adherence>({
    patientId: 0,
    scheduledVisitDate: '',
    actualVisitDate: '',
    doseMissed: 0,
    adherenceChallenges: '',
  });

  // Load institutions/facilities on mount
  useEffect(() => {
    const loadLookups = async () => {
      const [facRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/institutions`),
      ]);
      if (facRes.ok) setFacilities(await facRes.json());
    };
    loadLookups();
  }, []);

  const removeTestRow = (index: number) => {
    setFormData((prev) => {
      const tests = prev.patient.testMonitoring.filter((_, i) => i !== index);
      return { ...prev, patient: { ...prev.patient, testMonitoring: tests } };
    });
  };

  const removeTreatmentHistoryRow = (index: number) => {
    setFormData((prev) => {
      const tests = prev.patient.treatmentHistory.filter((_, i) => i !== index);
      return { ...prev, patient: { ...prev.patient, treatmentHistory: tests } };
    });
  };

  const removeTBHistory = (index: number) => {
    setFormData((prev) => {
      const tbHist = prev.patient.tbHistory.filter((_, i) => i !== index);
      return { ...prev, patient: { ...prev.patient, tbHistory: tbHist } };
    });
  };

  const removeARTInterruption = (index: number) => {
    setFormData((prev) => {
      const rows = prev.patient.art_interruption.filter((_, i) => i !== index);
      return { ...prev, patient: { ...prev.patient, art_interruption: rows } };
    });
  };

  const removeAdherence = (index: number) => {
    setFormData((prev) => {
      const rows = prev.patient.adherence.filter((_, i) => i !== index);
      return { ...prev, patient: { ...prev.patient, adherence: rows } };
    });
  };

  const isArtInterruptionValid = () => {
    return formData.patient.art_interruption.every(
      (row) =>
        row.dateStopped.trim() !== '' && row.reasonForStopping.trim() !== ''
    );
  };

  const handleChange = (field: string, value: any, nested?: string) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        patient: {
          ...prev.patient,
          [nested]: { ...(prev.patient as any)[nested], [field]: value },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        patient: { ...prev.patient, [field]: value },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit');
      alert('Application submitted!');
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  return (
    <Layout>
      <div className='p-6'>
        {/* Navigation bar */}
        <div className='border-b border-gray-300 mb-6'>
          <nav className='flex space-x-4 -mb-px'>
            {steps.map((label, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`whitespace-nowrap px-4 py-2 font-medium border-b-2 transition-colors duration-200 ${
                  step === i
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form sections */}
        {step === 0 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Application Info</h2>
            <Label htmlFor='facilityId'>Facility</Label>
            <Select
              id='facilityId'
              name='facilityId'
              value={formData.facilityId}
              onChange={(e) =>
                setFormData({ ...formData, facilityId: Number(e.target.value) })
              }
              required
            >
              <option value=''>Select facility</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {step === 1 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Patient Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label
                  htmlFor='firstname'
                  className='text-white dark:text-gray-900'
                >
                  Patient First Name
                </Label>
                <TextInput
                  id='firstname'
                  type='text'
                  placeholder='First Name'
                  value={formData.patient.firstname}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='lastname'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Patient Last Name
                </Label>
                <TextInput
                  id='lastname'
                  type='text'
                  name='patientLastName'
                  placeholder='Last Name'
                  value={formData.patient.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor='sex'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Sex
                </Label>
                <Select
                  id='sex'
                  name='gender'
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value=''>Select Sex</option>
                  <option value='M'>Male</option>
                  <option value='FNP'>Female Non Pregnant</option>
                  <option value='FP'>Female Pregnant</option>
                  <option value='FBf'>Female Breastfeeding</option>
                </Select>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='accept'
                    name='birthdateEstimated'
                    onChange={(e) =>
                      handleChange(
                        'dateOfBirthEstimated',
                        e.target.checked ? 1 : 0
                      )
                    }
                    defaultChecked
                  />
                  <Label
                    htmlFor='accept'
                    className='flex text-gray-900 dark:text-gray-900'
                  >
                    Patient date of birth available
                  </Label>
                </div>
              </div>
              {formData.patient.dateOfBirthEstimated === 1 && (
                <div>
                  <Label
                    htmlFor='birthDate'
                    className='text-gray-900 dark:text-gray-900'
                  >
                    Birth Date
                  </Label>
                  <TextInput
                    id='birthDate'
                    name='birthDate'
                    type='date'
                    value={formData.patient.dateOfBirth ?? ''}
                    onChange={(e) =>
                      handleChange('dateOfBirth', e.target.value)
                    }
                  />
                </div>
              )}
              {formData.patient.dateOfBirthEstimated === 0 && (
                <div>
                  <Label
                    htmlFor='age'
                    className='text-gray-900 dark:text-gray-900'
                  >
                    Age
                  </Label>
                  <TextInput
                    id='age'
                    name='age'
                    type='number'
                    value={formData.patient.age ?? ''}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className='text-gray-900 bg-white'
                  />
                </div>
              )}
              <div>
                <Label
                  htmlFor='pregnancyDueDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Pregnancy Due Date
                </Label>
                <TextInput
                  id='pregnancyDueDate'
                  name='pregnancyDueDate'
                  type='date'
                  onChange={(e) =>
                    handleChange('pregnantDueDate', e.target.value)
                  }
                  disabled={formData.patient.gender !== 'FP'}
                />
              </div>
              <div>
                <Label
                  htmlFor='nationalId'
                  className='text-white dark:text-gray-900'
                >
                  National Patient ID
                </Label>
                <TextInput
                  id='nationalId'
                  placeholder='National ID'
                  type='text'
                  name='nationalId'
                  value={formData.patient.nationalId}
                  onChange={(e) => handleChange('nationalId', e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor='dateStartedART'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Date started ART
                </Label>
                <TextInput
                  id='dateStartedART'
                  name='dateStartedART'
                  type='date'
                  onChange={(e) =>
                    handleChange('dateStartedART', e.target.value)
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor='artRegNo'
                  className='text-gray-50 dark:text-gray-900'
                >
                  ART Registration No.
                </Label>
                <TextInput
                  id='artRegNo'
                  placeholder='ART Registration Number'
                  value={formData.patient.ARTNumber}
                  name='artRegNo'
                  onChange={(e) => handleChange('ARTNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Test Monitoring</h2>

            {/* --- Form to add one test --- */}
            <div className='grid gap-4 md:grid-cols-4 items-end'>
              <div>
                <Label htmlFor='newTestType' className='text-gray-900'>
                  Test Type
                </Label>
                <Select
                  id='newTestType'
                  name='newTestType'
                  value={newTest.testTypeId}
                  onChange={(e) =>
                    setNewTest((prev) => ({
                      ...prev,
                      testTypeId: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select Test Type</option>
                  {testType.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor='newTestDate' className='text-gray-900'>
                  Test Date
                </Label>
                <TextInput
                  id='newTestDate'
                  type='date'
                  value={newTest.testDate}
                  onChange={(e) =>
                    setNewTest((prev) => ({
                      ...prev,
                      testDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor='newTestResult' className='text-gray-900'>
                  Result
                </Label>
                <TextInput
                  id='newTestResult'
                  placeholder='Result'
                  value={newTest.result}
                  onChange={(e) =>
                    setNewTest((prev) => ({ ...prev, result: e.target.value }))
                  }
                />
              </div>

              <div className='flex items-end'>
                <button
                  type='button'
                  className='bg-blue-600 text-white px-4 py-2 rounded'
                  onClick={() => {
                    if (
                      newTest.testTypeId !== 0 &&
                      newTest.testDate &&
                      newTest.result
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          testMonitoring: [
                            ...prev.patient.testMonitoring,
                            newTest,
                          ],
                        },
                      }));
                      setNewTest({
                        patientId: 0,
                        testTypeId: 0,
                        testDate: '',
                        result: '',
                      }); // reset form
                    }
                  }}
                >
                  Add Test
                </button>
              </div>
            </div>

            {/* --- List of added tests --- */}
            {formData.patient.testMonitoring.length === 0 ? (
              <p className='text-gray-500 mt-4'>No tests added yet.</p>
            ) : (
              <ul className='divide-y divide-gray-200 mt-4'>
                {formData.patient.testMonitoring.map((test, idx) => (
                  <li
                    key={idx}
                    className='grid md:grid-cols-4 items-center py-2 gap-4'
                  >
                    <span>
                      {testType.find((t) => t.id === Number(test.testTypeId))
                        ?.name || 'Unknown'}
                    </span>
                    <span>{test.testDate}</span>
                    <span>{test.result}</span>
                    <button
                      type='button'
                      onClick={() => removeTestRow(idx)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Treatment history */}

        {step === 3 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Treatment History</h2>

            {/* --- Form to add one test --- */}
            <div className='grid gap-4 md:grid-cols-4 items-end'>
              <div>
                <Label
                  htmlFor='drug1Id'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Drug 1
                </Label>
                <Select
                  id='drug1Id'
                  name='drug1Id'
                  value={newARTTreatment.drug1Id}
                  onChange={(e) =>
                    setNewARTTreatment((prev) => ({
                      ...prev,
                      drug1Id: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select Drug</option>
                  {art_regimens.map(({ id, drugs }) => (
                    <option key={id} value={id}>
                      {drugs}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='drug2Id'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Drug 2
                </Label>
                <Select
                  id='drug2Id'
                  name='drug2Id'
                  value={newARTTreatment.drug2Id}
                  onChange={(e) =>
                    setNewARTTreatment((prev) => ({
                      ...prev,
                      drug2Id: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select Drug</option>
                  {art_regimens.map(({ id, drugs }) => (
                    <option key={id} value={id}>
                      {drugs}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='drug3Id'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Drug 3
                </Label>
                <Select
                  id='drug3Id'
                  name='drug3Id'
                  value={newARTTreatment.drug3Id}
                  onChange={(e) =>
                    setNewARTTreatment((prev) => ({
                      ...prev,
                      drug3Id: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select Drug</option>
                  {art_regimens.map(({ id, drugs }) => (
                    <option key={id} value={id}>
                      {drugs}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='startDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Start Date
                </Label>
                <TextInput
                  id='startDate'
                  type='date'
                  value={newARTTreatment.startDate ?? ''}
                  onChange={(e) =>
                    setNewARTTreatment((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label
                  htmlFor='endDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  End Date
                </Label>
                <TextInput
                  id='endDate'
                  type='date'
                  value={newARTTreatment.endDate ?? ''}
                  onChange={(e) =>
                    setNewARTTreatment((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label
                  htmlFor='reasonForStopping'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Reason for stopping
                </Label>
                <TextInput
                  id='reasonForStopping'
                  placeholder='Reason for stopping'
                  value={newARTTreatment.reasonForStopping}
                  onChange={(e) =>
                    setNewARTTreatment((prev) => ({
                      ...prev,
                      reasonForStopping: e.target.value,
                    }))
                  }
                />
              </div>

              <div className='flex items-end'>
                <button
                  type='button'
                  className='bg-blue-600 text-white px-4 py-2 rounded'
                  onClick={() => {
                    if (
                      newARTTreatment.drug1Id !== 0 &&
                      newARTTreatment.startDate
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          treatmentHistory: [
                            ...prev.patient.treatmentHistory,
                            newARTTreatment,
                          ],
                        },
                      }));
                      setNewARTTreatment({
                        patientId: 0,
                        drug1Id: 0,
                        drug2Id: 0,
                        drug3Id: 0,
                        startDate: '',
                        endDate: '',
                        reasonForStopping: '',
                      }); // reset form
                    }
                  }}
                >
                  Add History
                </button>
              </div>
            </div>

            {/* --- List of added tests --- */}
            {formData.patient.treatmentHistory.length === 0 ? (
              <p className='text-gray-500 mt-4'>
                No treatment history added yet.
              </p>
            ) : (
              <ul className='divide-y divide-gray-200 mt-4'>
                {formData.patient.treatmentHistory.map((his, idx) => (
                  <li
                    key={idx}
                    className='grid md:grid-cols-7 items-center py-2 gap-4'
                  >
                    <span>
                      {art_regimens.find((r) => r.id === Number(his.drug1Id))
                        ?.drugs || 'Unknown'}
                    </span>
                    <span>
                      {art_regimens.find((r) => r.id === Number(his.drug2Id))
                        ?.drugs || 'Unknown'}
                    </span>
                    <span>
                      {art_regimens.find((r) => r.id === Number(his.drug3Id))
                        ?.drugs || 'Unknown'}
                    </span>
                    <span>{his.startDate}</span>
                    <span>{his.endDate}</span>
                    <span>{his.reasonForStopping}</span>
                    <button
                      type='button'
                      onClick={() => removeTreatmentHistoryRow(idx)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* TB History*/}
        {step === 4 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>TB History</h2>

            {/* --- Form to add one test --- */}
            <div className='grid gap-4 md:grid-cols-7 items-end'>
              <div>
                <Label
                  htmlFor='tbRegimen'
                  className='text-gray-900 dark:text-gray-900'
                >
                  TB Regimen
                </Label>
                <Select
                  id='tbRegimen'
                  name='tbRegimen'
                  value={newTBHistory.tbRegimen}
                  onChange={(e) =>
                    setNewTBHistory((prev) => ({
                      ...prev,
                      tbRegimen: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select TB Regimen</option>
                  {tb_regimen.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label
                  htmlFor='startDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Start Date
                </Label>
                <TextInput
                  id='startDate'
                  type='date'
                  value={newTBHistory.startDate ?? ''}
                  onChange={(e) =>
                    setNewTBHistory((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label
                  htmlFor='endDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  End Date
                </Label>
                <TextInput
                  id='endDate'
                  type='date'
                  value={newTBHistory.endDate ?? ''}
                  onChange={(e) =>
                    setNewTBHistory((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label
                  htmlFor='art'
                  className='text-gray-900 dark:text-gray-900'
                >
                  ART Regimen
                </Label>
                <Select
                  id='artRegimen'
                  name='artRegimen'
                  value={newTBHistory.artRegimen}
                  onChange={(e) =>
                    setNewTBHistory((prev) => ({
                      ...prev,
                      artRegimen: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select ART Regimen</option>
                  {art_regimens.map(({ id, regimen_code }) => (
                    <option key={id} value={id}>
                      {regimen_code}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='additionalDrug'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Additional drugs
                </Label>
                <Select
                  id='additionalDrug'
                  name='additionalDrug'
                  value={newTBHistory.additionalDrug}
                  onChange={(e) =>
                    setNewTBHistory((prev) => ({
                      ...prev,
                      additionalDrug: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select Drug</option>
                  {art_regimens.map(({ id, drugs }) => (
                    <option key={id} value={id}>
                      {drugs}
                    </option>
                  ))}
                </Select>
              </div>

              <div className='flex items-end'>
                <button
                  type='button'
                  className='bg-blue-600 text-white px-4 py-2 rounded'
                  onClick={() => {
                    if (
                      newTBHistory.tbRegimen !== 0 &&
                      newTBHistory.startDate &&
                      newTBHistory.endDate
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          tbHistory: [...prev.patient.tbHistory, newTBHistory],
                        },
                      }));
                      setNewTBHistory({
                        patientId: 0,
                        tbRegimen: 0,
                        startDate: '',
                        endDate: '',
                        artRegimen: 0,
                        additionalDrug: 0,
                      }); // reset form
                    }
                  }}
                >
                  Add History
                </button>
              </div>
            </div>

            {/* --- List of added tb regimens --- */}
            {formData.patient.tbHistory.length === 0 ? (
              <p className='text-gray-500 mt-4'>No TB history added yet.</p>
            ) : (
              <ul className='divide-y divide-gray-200 mt-4'>
                {formData.patient.tbHistory.map((his, idx) => (
                  <li
                    key={idx}
                    className='grid md:grid-cols-7 items-center py-2 gap-4'
                  >
                    <span>
                      {tb_regimen.find((r) => r.id === Number(his.tbRegimen))
                        ?.name || 'Unknown'}
                    </span>
                    <span>{his.startDate}</span>
                    <span>{his.endDate}</span>
                    <span>
                      {art_regimens.find((r) => r.id === Number(his.artRegimen))
                        ?.regimen_code || 'Unknown'}
                    </span>
                    <span>
                      {art_regimens.find(
                        (r) => r.id === Number(his.additionalDrug)
                      )?.drugs || 'Unknown'}
                    </span>

                    <button
                      type='button'
                      onClick={() => removeTBHistory(idx)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ART Interuptions*/}
        {step === 5 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>ART Interruptions</h2>

            {/* --- Form to add one test --- */}
            <div className='grid gap-4 md:grid-cols-5 items-end'>
              <div>
                <Label
                  htmlFor='dateStopped'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Date Stopped
                </Label>
                <TextInput
                  id='dateStopped'
                  type='date'
                  value={newARTInterruption.dateStopped ?? ''}
                  onChange={(e) =>
                    setNewARTInterruption((prev) => ({
                      ...prev,
                      dateStopped: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label
                  htmlFor='durationNumber'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Duration
                </Label>
                <TextInput
                  id='durationNumber'
                  type='number'
                  value={newARTInterruption.durationNumber ?? ''}
                  onChange={(e) =>
                    setNewARTInterruption((prev) => ({
                      ...prev,
                      durationNumber: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label
                  htmlFor='duration'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Period
                </Label>
                <Select
                  id='duration'
                  name='duration'
                  value={newARTInterruption.duration}
                  onChange={(e) =>
                    setNewARTInterruption((prev) => ({
                      ...prev,
                      duration: Number(e.target.value),
                    }))
                  }
                >
                  <option value=''>Select Period</option>
                  {period.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label
                  htmlFor='reasonForStopping'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Reason for stopping
                </Label>
                <TextInput
                  id='reasonForStopping'
                  placeholder='Reason for stopping'
                  value={newARTInterruption.reasonForStopping}
                  onChange={(e) =>
                    setNewARTInterruption((prev) => ({
                      ...prev,
                      reasonForStopping: e.target.value,
                    }))
                  }
                />
              </div>

              <div className='flex items-end'>
                <button
                  type='button'
                  className='bg-blue-600 text-white px-4 py-2 rounded'
                  onClick={() => {
                    if (
                      newARTInterruption.dateStopped &&
                      newARTInterruption.duration !== 0 &&
                      newARTInterruption.durationNumber !== 0 &&
                      newARTInterruption.reasonForStopping
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          art_interruption: [
                            ...prev.patient.art_interruption,
                            newARTInterruption,
                          ],
                        },
                      }));
                      setNewARTInterruption({
                        patientId: 0,
                        dateStopped: '',
                        duration: 0,
                        durationNumber: 0,
                        reasonForStopping: '',
                      }); // reset form
                    }
                  }}
                >
                  Add Interuption
                </button>
              </div>
            </div>

            {/* --- List of added ART interuptions --- */}
            {formData.patient.art_interruption.length === 0 ? (
              <p className='text-gray-500 mt-4'>
                No ART interruptions information added yet.
              </p>
            ) : (
              <ul className='divide-y divide-gray-200 mt-4'>
                {formData.patient.art_interruption.map((his, idx) => (
                  <li
                    key={idx}
                    className='grid md:grid-cols-5 items-center py-2 gap-4'
                  >
                    <span>{his.dateStopped}</span>
                    <span>
                      {his.durationNumber}{' '}
                      {period.find((r) => r.id === Number(his.duration))
                        ?.name || 'Unknown'}
                    </span>
                    <span>{his.reasonForStopping}</span>

                    <button
                      type='button'
                      onClick={() => removeARTInterruption(idx)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ART Adherence*/}
        {step === 6 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Adherence</h2>

            {/* --- Form to add one test --- */}
            <div className='grid gap-4 md:grid-cols-5 items-end'>
              <div>
                <Label
                  htmlFor='scheduledVisitDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Scheduled Visit Date
                </Label>
                <TextInput
                  type='date'
                  id='scheduledVisitDate'
                  value={newAdherence.scheduledVisitDate ?? ''}
                  onChange={(e) =>
                    setNewAdherence((prev) => ({
                      ...prev,
                      scheduledVisitDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor='actualVisitDate'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Actual Visit Date
                </Label>
                <TextInput
                  type='date'
                  id='actualVisitDate'
                  value={newAdherence.actualVisitDate ?? ''}
                  onChange={(e) =>
                    setNewAdherence((prev) => ({
                      ...prev,
                      actualVisitDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor='doseMissed'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Dose Missed
                </Label>
                <TextInput
                  type='number'
                  id='doseMissed'
                  value={newAdherence.doseMissed ?? ''}
                  onChange={(e) =>
                    setNewAdherence((prev) => ({
                      ...prev,
                      doseMissed: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor='adherenceChallenges'
                  className='text-gray-900 dark:text-gray-900'
                >
                  Adherence Challenges
                </Label>
                <TextInput
                  type='text'
                  id='adherenceChallenges'
                  value={newAdherence.adherenceChallenges ?? ''}
                  onChange={(e) =>
                    setNewAdherence((prev) => ({
                      ...prev,
                      adherenceChallenges: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='flex items-end'>
                <button
                  type='button'
                  className='bg-blue-600 text-white px-4 py-2 rounded'
                  onClick={() => {
                    if (
                      newAdherence.scheduledVisitDate &&
                      newAdherence.actualVisitDate &&
                      newAdherence.doseMissed >= 0
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          adherence: [...prev.patient.adherence, newAdherence],
                        },
                      }));
                      setNewAdherence({
                        patientId: 0,
                        scheduledVisitDate: '',
                        actualVisitDate: '',
                        doseMissed: 0,
                        adherenceChallenges: '',
                      }); // reset form
                    }
                  }}
                >
                  Add Adherence
                </button>
              </div>
            </div>

            {/* --- List of added ART interuptions --- */}
            {formData.patient.adherence.length === 0 ? (
              <p className='text-gray-500 mt-4'>
                No ART adeherence information added yet.
              </p>
            ) : (
              <ul className='divide-y divide-gray-200 mt-4'>
                {formData.patient.adherence.map((his, idx) => (
                  <li
                    key={idx}
                    className='grid md:grid-cols-5 items-center py-2 gap-4'
                  >
                    <span>{his.scheduledVisitDate}</span>
                    <span>{his.actualVisitDate}</span>
                    <span>{his.doseMissed}</span>
                    <span>{his.adherenceChallenges}</span>
                    <button
                      type='button'
                      onClick={() => removeAdherence(idx)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* {step === 6 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Adherence</h2>
            {formData.patient.adherence.length === 0 && (
              <p className='text-gray-500'>No adherence records added yet.</p>
            )}
            {formData.patient.adherence.map((entry, idx) => (
              <div key={idx} className='border rounded p-4 space-y-3 relative'>
                <div className='grid md:grid-cols-3 gap-2'>
                  <input
                    type='date'
                    placeholder='Scheduled Visit Date'
                    value={entry.scheduledVisitDate}
                    onChange={(e) =>
                      updateAdherence(idx, 'scheduledVisitDate', e.target.value)
                    }
                    className='border p-2 w-full'
                  />
                  <input
                    type='date'
                    placeholder='Actual Visit Date'
                    value={entry.actualVisitDate}
                    onChange={(e) =>
                      updateAdherence(idx, 'actualVisitDate', e.target.value)
                    }
                    className='border p-2 w-full'
                  />
                  <input
                    type='number'
                    placeholder='Dose Missed'
                    value={entry.doseMissed}
                    onChange={(e) =>
                      updateAdherence(idx, 'doseMissed', Number(e.target.value))
                    }
                    className='border p-2 w-full'
                  />
                </div>
                <input
                  type='text'
                  placeholder='Adherence Challenges'
                  value={entry.adherenceChallenges}
                  onChange={(e) =>
                    updateAdherence(idx, 'adherenceChallenges', e.target.value)
                  }
                  className='border p-2 w-full'
                />
                <button
                  type='button'
                  onClick={() => removeAdherence(idx)}
                  className='absolute top-2 right-2 text-red-600 hover:underline'
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addAdherence}
              className='bg-blue-600 text-white px-4 py-2 rounded'
            >
              + Add Adherence Record
            </button>

            <div className='space-y-3 pt-6'>
              <h3 className='text-lg font-semibold'>Adherence Questions</h3>

              <div className='grid md:grid-cols-2 gap-3'>
                <input
                  type='number'
                  placeholder='Last Month Missed Dose'
                  value={
                    formData.patient.adherenceQuestions.lastMonthMissedDose
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          lastMonthMissedDose: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />

                <input
                  type='number'
                  placeholder='Last Week Missed Dose'
                  value={formData.patient.adherenceQuestions.lastWeekMissedDose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          lastWeekMissedDose: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />

                <input
                  type='number'
                  placeholder='Adherence Last Session'
                  value={
                    formData.patient.adherenceQuestions.adherenceLastSession
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          adherenceLastSession: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />

                <input
                  type='date'
                  placeholder='Last Date of Session'
                  value={formData.patient.adherenceQuestions.lastDateOfSession}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          lastDateOfSession: e.target.value,
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />
              </div>

              <div className='grid md:grid-cols-3 gap-2'>
                <input
                  type='number'
                  placeholder='Outcome'
                  value={formData.patient.adherenceQuestions.outcome}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          outcome: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />

                <input
                  type='number'
                  placeholder='HIV Disclosure'
                  value={formData.patient.adherenceQuestions.hivDisclosure}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          hivDisclosure: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />

                <input
                  type='number'
                  placeholder='Swallow Tabs'
                  value={formData.patient.adherenceQuestions.swallowTabs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        adherenceQuestions: {
                          ...prev.patient.adherenceQuestions,
                          swallowTabs: Number(e.target.value),
                        },
                      },
                    }))
                  }
                  className='border p-2 w-full'
                />
              </div>
            </div>
          </div>
        )} */}

        {step === 7 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Review & Submit</h2>
            <pre className='bg-gray-100 p-4 rounded text-sm'>
              {JSON.stringify(formData, null, 2)}
            </pre>
            <button
              onClick={handleSubmit}
              className='bg-green-600 text-white px-4 py-2 rounded'
            >
              Submit
            </button>
          </div>
        )}

        {/* Next/Prev buttons */}
        <div className='flex justify-between mt-6'>
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50'
          >
            Previous
          </button>

          {step < steps.length - 1 && (
            <button
              onClick={() => {
                if (step === 4 && !isArtInterruptionValid()) {
                  alert(
                    'Please fill in Date Stopped and Reason for Stopping for all interruptions.'
                  );
                  return;
                }
                setStep((s) => s + 1);
              }}
              className={`px-4 py-2 rounded text-white ${
                step === 4 && !isArtInterruptionValid()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
