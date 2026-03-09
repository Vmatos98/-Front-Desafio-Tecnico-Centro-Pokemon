'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register, isLoading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      await register({ name, email, password });
    } catch {
      // Error is handled by the useAuth hook and displayed below
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden font-sans">
      {/* Subtle Dark Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-400 via-zinc-900 to-zinc-950 pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-2xl p-8 space-y-8 relative z-10 border border-zinc-800/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-800/80 text-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-700/50">
            <UserPlus className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Centro Pokémon</h1>
          <p className="text-zinc-400 text-sm">Cadastre-se na nossa rede de treinadores.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Ash Ketchum"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-400 font-medium pt-2">
          Já possui licença?{' '}
          <Link href="/login" className="font-semibold text-zinc-100 hover:text-white transition-colors">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
