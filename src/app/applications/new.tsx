// pages/applications/new.tsx
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function NewApplicationForm() {
  const [formData, setFormData] = useState({
    patientFirstName: '',
    patientLastName: '',
    birthDate: '',
    sex: '',
    pregnancyDueDate: '',
    nationalId: '',
    artRegNo: '',
    facilityName: '',
    clinicianFirstName: '',
    clinicianLastName: '',
    clinicianEmail: '',
    clinicianPhone: '',
    weight: '',
    height: '',
    bmi: '',
    muac: '',
    whoStageEvent: false,
    diarrhoea: false,
    psychosis: false,
    neuropathy: false,
    jaundice: false,
    kidneyFailure: false,
    anaemia: false,
    alcoholUse: false,
    weightGain: false,
    otherConditions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // replace with API call
    alert('Application submitted!');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">New HIVDR Application</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="patientFirstName" onChange={handleChange} placeholder="Patient First Name" className="border p-2" />
            <input name="patientLastName" onChange={handleChange} placeholder="Patient Last Name" className="border p-2" />
            <input name="birthDate" type="date" onChange={handleChange} className="border p-2" />
            <select name="sex" onChange={handleChange} className="border p-2">
              <option value="">Sex</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <input name="pregnancyDueDate" type="date" onChange={handleChange} placeholder="Pregnancy Due Date" className="border p-2" />
            <input name="nationalId" onChange={handleChange} placeholder="National Patient ID" className="border p-2" />
            <input name="artRegNo" onChange={handleChange} placeholder="ART Registration No." className="border p-2" />
            <input name="facilityName" onChange={handleChange} placeholder="ART Facility Name" className="border p-2" />
          </div>

          <h2 className="text-xl font-semibold mt-6">Clinician Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="clinicianFirstName" onChange={handleChange} placeholder="Clinician First Name" className="border p-2" />
            <input name="clinicianLastName" onChange={handleChange} placeholder="Clinician Last Name" className="border p-2" />
            <input name="clinicianEmail" onChange={handleChange} placeholder="Clinician Email" className="border p-2" />
            <input name="clinicianPhone" onChange={handleChange} placeholder="Clinician Phone" className="border p-2" />
          </div>

          <h2 className="text-xl font-semibold mt-6">Clinical Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label><input type="checkbox" name="whoStageEvent" onChange={handleChange} /> WHO Stage 3/4</label>
            <label><input type="checkbox" name="diarrhoea" onChange={handleChange} /> Diarrhoea/Vomiting</label>
            <label><input type="checkbox" name="neuropathy" onChange={handleChange} /> Neuropathy</label>
            <label><input type="checkbox" name="psychosis" onChange={handleChange} /> Psychosis</label>
            <label><input type="checkbox" name="jaundice" onChange={handleChange} /> Jaundice</label>
            <label><input type="checkbox" name="kidneyFailure" onChange={handleChange} /> Kidney Failure</label>
            <label><input type="checkbox" name="anaemia" onChange={handleChange} /> Anaemia</label>
            <label><input type="checkbox" name="alcoholUse" onChange={handleChange} /> Alcohol/Drug Use</label>
            <label><input type="checkbox" name="weightGain" onChange={handleChange} /> Excess Weight Gain</label>
          </div>

          <textarea name="otherConditions" onChange={handleChange} placeholder="Other Conditions (e.g. NCDs)" className="border p-2 w-full"></textarea>

          <h2 className="text-xl font-semibold mt-6">Physical Measurements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input name="weight" onChange={handleChange} placeholder="Weight (kg)" className="border p-2" />
            <input name="height" onChange={handleChange} placeholder="Height (cm)" className="border p-2" />
            <input name="bmi" onChange={handleChange} placeholder="BMI" className="border p-2" />
            <input name="muac" onChange={handleChange} placeholder="MUAC (cm)" className="border p-2" />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Application</button>
        </form>
      </div>
    </Layout>
  );
}
