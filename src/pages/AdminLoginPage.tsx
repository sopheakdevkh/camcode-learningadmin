import React, { useState } from 'react';
import { GraduationCap, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAdmin } from '@/context/AdminContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('kosal.rith@camcodelearn.edu');
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
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[14px] border border-[#E5E7EB] shadow-sm p-7 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#1F2937]">CamcodeLearn Admin Console</h1>
            <p className="text-[12.5px] text-[#6B7280]">
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
          {error && <p className="text-[12.5px] text-[#DC2626]">{error}</p>}
          <Button type="submit" fullWidth size="lg" leftIcon={<Lock className="h-4 w-4" />}>
            Sign In to Admin Console
          </Button>
        </form>

        <div className="p-3 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] text-[12px] text-[#4B5563] flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
          <span>
            Session credentials are managed via backend HttpOnly cookies (no tokens persisted in localStorage).
          </span>
        </div>
      </div>
    </div>
  );
};

