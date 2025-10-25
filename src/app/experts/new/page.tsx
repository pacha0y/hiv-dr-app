'use client';
import React, { useState } from 'react';

import Layout from '../../components/Layout';

interface ExpertData {
  title: string;
  first_name: string;
  last_name: string;
  institution: string;
  position: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_lead: boolean;
  creator: string;
}

export default function ExpertForm() {
  const [formData, setFormData] = useState<ExpertData>({
    title: 'Dr.',
    first_name: 'Tom',
    last_name: 'Heller',
    institution: 'LH',
    position: 'TA',
    email: 'theller@lighthouse.org.mw',
    phone: '0888734321',
    is_active: true,
    is_lead: false,
    creator: 'system',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (target as HTMLInputElement).checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Saving expert data:', formData);
    // TODO: Replace with actual save API call
  }

  return (
    <Layout>
      <div className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <section className='border p-4 mb-6 rounded bg-gray-50'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block mb-1 text-sm font-medium'>Title</label>
                <input
                  name='title'
                  onChange={handleChange}
                  className='border p-2 w-full'
                />
              </div>
              <div>
                <label className='block mb-1 text-sm font-medium'>
                  First Name
                </label>
                <input
                  name='firstName'
                  onChange={handleChange}
                  className='border p-2 w-full'
                />
              </div>
              <div>
                <label className='block mb-1 text-sm font-medium'>
                  Last Name
                </label>
                <input
                  name='lastName'
                  onChange={handleChange}
                  className='border p-2 w-full'
                />
              </div>
              <div>
                <label className='block mb-1 text-sm font-medium'>
                  Institution
                </label>
                <input
                  name='institution'
                  onChange={handleChange}
                  className='border p-2 w-full'
                />
              </div>
              <div>
                <label className='block mb-1 text-sm font-medium'>
                  Position
                </label>
                <input
                  name='position'
                  onChange={handleChange}
                  className='border p-2 w-full'
                />
              </div>
              <div>
                <label className='block mb-1 text-sm font-medium'>Email</label>
                <input
                  name='email'
                  onChange={handleChange}
                  className='border p-2 w-full'
                  type='email'
                />
              </div>
              <div>
                <label className='block mb-1 text-sm font-medium'>Phone</label>
                <input
                  name='phone'
                  onChange={handleChange}
                  className='border p-2 w-full'
                  type='tel'
                />
              </div>
              <div className='flex items-center space-x-4'>
                <label htmlFor='is_active' className='font-semibold'>
                  Active
                </label>
                <input
                  id='is_active'
                  name='is_active'
                  checked={formData.is_active}
                  onChange={handleChange}
                  type='checkbox'
                />

                <label htmlFor='is_lead' className='font-semibold'>
                  Lead
                </label>
                <input
                  id='is_lead'
                  name='is_lead'
                  checked={formData.is_lead}
                  onChange={handleChange}
                  type='checkbox'
                />
              </div>
            </div>
          </section>
          <input type='hidden' name='creator' value='system' />

          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
          >
            Save
          </button>
        </form>
      </div>
    </Layout>
  );
}
