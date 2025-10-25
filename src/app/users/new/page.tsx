'use client';

import { Alert, Button, Card, Label, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';

interface Institution {
  id: number;
  name: string;
}
interface Facility {
  id: number;
  name: string;
}

export default function Signup() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const [form, setForm] = useState({
    title: '',
    first_name: '',
    last_name: '',
    institutionId: '',
    facilityId: '',
    position: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load institutions/facilities on mount
  useEffect(() => {
    const loadLookups = async () => {
      const [instRes, facRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/institutions`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/facilities`),
      ]);
      if (instRes.ok) setInstitutions(await instRes.json());
      if (facRes.ok) setFacilities(await facRes.json());
    };
    loadLookups();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1️⃣ Create Person
      const personRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/people`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            first_name: form.first_name,
            last_name: form.last_name,
            institutionId: parseInt(form.institutionId),
            facilityId: parseInt(form.facilityId),
            position: form.position,
            email: form.email,
            phone: form.phone,
          }),
        }
      );
      if (!personRes.ok) throw new Error('Failed to create person');
      const person = await personRes.json();

      // 2️⃣ Create User
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            personId: person.id,
          }),
        }
      );
      if (!userRes.ok) throw new Error('Failed to create user');

      setSuccess(true);
      setForm({
        title: '',
        first_name: '',
        last_name: '',
        institutionId: '',
        facilityId: '',
        position: '',
        email: '',
        phone: '',
        password: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-2xl'>
        <h2 className='text-2xl font-bold text-center mb-4'>Create Account</h2>

        {error && <Alert color='failure'>{error}</Alert>}
        {success && <Alert color='success'>Signup successful!</Alert>}

        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='title'>Title</Label>
            <TextInput
              id='title'
              name='title'
              value={form.title}
              onChange={handleChange}
              placeholder='Mr/Ms/Dr'
              required
            />
          </div>

          <div>
            <Label htmlFor='position'>Position</Label>
            <TextInput
              id='position'
              name='position'
              value={form.position}
              onChange={handleChange}
              placeholder='Data Officer'
            />
          </div>

          <div>
            <Label htmlFor='first_name'>First Name</Label>
            <TextInput
              id='first_name'
              name='first_name'
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='last_name'>Last Name</Label>
            <TextInput
              id='last_name'
              name='last_name'
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className='col-span-2'>
            <Label htmlFor='email'>Email</Label>
            <TextInput
              id='email'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='col-span-2'>
            <Label htmlFor='phone'>Phone</Label>
            <TextInput
              id='phone'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              placeholder='+265…'
            />
          </div>

          <div>
            <Label htmlFor='institutionId'>Institution</Label>
            <Select
              id='institutionId'
              name='institutionId'
              value={form.institutionId}
              onChange={handleChange}
              required
            >
              <option value=''>Select institution</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor='facilityId'>Facility</Label>
            <Select
              id='facilityId'
              name='facilityId'
              value={form.facilityId}
              onChange={handleChange}
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

          <div className='col-span-2'>
            <Label htmlFor='password'> Password</Label>
            <TextInput
              id='password'
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className='col-span-2'>
            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Creating account…' : 'Register Account'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
