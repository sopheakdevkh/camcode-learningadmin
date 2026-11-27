import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAdmin } from '@/context/AdminContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('sopheak.khoeun@camcode.com');
  const [password, setPassword] = useState('Admin@2026');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(email, password);
    if (!ok) {
      setError('Invalid admin credentials or inactive account.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-environment" />
      <div className="grid-floor" />
      <div className="w-full max-w-md card-note p-7 sm:p-8 space-y-6">
        <div className="flex items-center gap-3.5">
          <span className="h-11 w-11 rounded-xl bg-[#1c5b48] text-white flex items-center justify-center shadow-2xs shrink-0">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 5.5H13M3 10.5C5.2 8.9 6.8 12.1 9 10.5C10.5 9.4 11.7 9.6 13 10.5"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="swiss-eyebrow">
              <span className="swiss-dot" />
              Operations Access
            </p>
            <h1 className="font-serif-display text-[24px] font-normal tracking-[-0.02em] text-[#141312] leading-tight mt-0.5">
              Camcode Admin Console
            </h1>
            <p className="font-mono-tech text-[11px] text-[#6e6a62] mt-0.5">
              HttpOnly Session Authentication · Port 3002
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-[12.5px] text-[#a5331f]">{error}</p>}
          <Button type="submit" fullWidth size="lg" leftIcon={<Lock className="h-4 w-4" />}>
            Sign In to Admin Console
          </Button>
        </form>

        <div className="p-3.5 rounded-xl bg-[#e4ede7]/70 border border-[#c5d6cb] text-[12px] text-[#15463a] flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#1c5b48] shrink-0 mt-0.5" />
          <span>
            Session credentials are managed via backend HttpOnly cookies (no tokens persisted in localStorage).
          </span>
        </div>
      </div>
    </div>
  );
};
