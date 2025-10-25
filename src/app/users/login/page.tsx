'use client';

import { Alert, Button, Card, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            username: form.username, // or form.username
            password: form.password,
          }).toString(),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await res.json();
      // Save token in localStorage (or cookie)
      localStorage.setItem('token', data.access_token);

      // Redirect to dashboard or home
      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-4'>Login</h2>

        {error && <Alert color='failure'>{error}</Alert>}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <TextInput
              id='username'
              name='username'
              type='email'
              placeholder='john@example.com'
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='password'>Password</Label>
            <TextInput
              id='password'
              name='password'
              type='password'
              placeholder='********'
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
