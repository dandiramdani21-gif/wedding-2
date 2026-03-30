'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  async function submit(formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    await signIn('credentials', { email, password, callbackUrl: '/' });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Login</h1>
      <p className="mb-4 text-sm text-slate-600">Default admin: admin@gmail.com / 123456</p>
      <form action={submit} className="card space-y-3 p-5">
        <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border p-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border p-2" />
        <button className="w-full rounded-lg bg-slate-900 p-2 text-white">Masuk</button>
      </form>
    </main>
  );
}
