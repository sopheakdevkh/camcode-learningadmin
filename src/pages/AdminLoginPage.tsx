import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAdmin } from '@/context/AdminContext';

export const AdminLoginPage: React.FC = () => {
  const { admins, roles, loginAdmin } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = loginAdmin(email, password);
    if (!ok) {
      setError('Invalid admin credentials or inactive account.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-environment" />
      <div className="grid-floor" />
      <div className="w-full max-w-lg card-note p-7 sm:p-8 space-y-6">
        <div className="flex items-center gap-3.5">
          <span className="h-11 w-11 rounded-[10px] bg-[#1c5b48] text-white flex items-center justify-center shadow-2xs shrink-0">
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
            placeholder="admin@camcode.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
                className="p-1 text-[#6e6a62] hover:text-[#141312] cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {error && <p className="text-[12.5px] text-[#a5331f]">{error}</p>}
          <Button type="submit" fullWidth size="lg" leftIcon={<Lock className="h-4 w-4" />}>
            Sign In to Admin Console
          </Button>
        </form>

        {/* Demo Admin Accounts */}
        <div className="p-3.5 rounded-[10px] bg-[#efebe1]/70 border border-[#ded8ca] space-y-2.5">
          <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62]">
            Demo Accounts (Password: Admin@2026)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {admins
              .filter((a) => a.status === 'active')
              .map((adm) => {
                const roleName = roles.find((r) => r.id === adm.roleId)?.name ?? 'Admin';
                const selected = email.trim().toLowerCase() === adm.email.toLowerCase();
                return (
                  <button
                    key={adm.id}
                    type="button"
                    onClick={() => {
                      setEmail(adm.email);
                      setPassword('Admin@2026');
                      setError('');
                    }}
                    className={`text-left px-3 py-2 rounded-[10px] border transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#1c5b48] bg-[#e4ede7]'
                        : 'border-[#ded8ca] bg-[#f6f3ec] hover:border-[#1c5b48]'
                    }`}
                  >
                    <p className="text-[12px] font-semibold text-[#141312] truncate">
                      {roleName}
                    </p>
                    <p className="font-mono-tech text-[10.5px] text-[#6e6a62] truncate">
                      {adm.email}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="p-3.5 rounded-[10px] bg-[#e4ede7]/70 border border-[#c5d6cb] text-[12px] text-[#15463a] flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#1c5b48] shrink-0 mt-0.5" />
          <span>
            Session credentials are managed via backend HttpOnly cookies (no tokens persisted in localStorage).
          </span>
        </div>

        <div className="pt-1 flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#ded8ca] bg-[#efebe1]/75">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="relative group/avatar1 shrink-0 cursor-pointer">
                <img
                  src="/creator-avatar.jpg"
                  alt="Sopheak Khoeun"
                  className="h-8 w-8 rounded-full object-cover object-[50%_22%] ring-1 ring-[#1c5b48]/25 transition-transform duration-200 group-hover/avatar1:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-3 z-50 w-44 sm:w-48 p-1.5 rounded-[14px] bg-[#f6f3ec] border border-[#ded8ca] shadow-[0_18px_40px_-14px_rgba(20,19,18,0.28)] opacity-0 scale-95 translate-y-1.5 group-hover/avatar1:opacity-100 group-hover/avatar1:scale-100 group-hover/avatar1:translate-y-0 transition-all duration-200 ease-out"
                >
                  <img
                    src="/creator-avatar.jpg"
                    alt=""
                    className="w-full h-56 rounded-[10px] object-cover object-[50%_20%]"
                  />
                  <div className="px-1.5 pt-1.5 pb-0.5">
                    <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.08em] text-[#6e6a62] leading-none">
                      Powered by
                    </p>
                    <p className="text-[12.5px] font-semibold text-[#141312] leading-tight mt-0.5">
                      Sopheak Khoeun
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group/avatar2 shrink-0 cursor-pointer">
                <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-[#1c5b48]/25 transition-transform duration-200 group-hover/avatar2:scale-105">
                  <img
                    src="/creator-avatar-studio.jpg"
                    alt="Sokheng Hun"
                    className="h-full w-full object-cover scale-[1.04]"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-3 z-50 w-48 sm:w-52 p-2.5 rounded-[14px] bg-[#f6f3ec] border border-[#ded8ca] shadow-[0_18px_40px_-14px_rgba(20,19,18,0.28)] opacity-0 scale-95 translate-y-1.5 group-hover/avatar2:opacity-100 group-hover/avatar2:scale-100 group-hover/avatar2:translate-y-0 transition-all duration-200 ease-out"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden ring-1 ring-[#ded8ca]">
                    <img
                      src="/creator-avatar-studio.jpg"
                      alt=""
                      className="w-full h-full object-cover scale-[1.03]"
                    />
                  </div>
                  <div className="px-1 pt-2 pb-0.5 text-center">
                    <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.08em] text-[#6e6a62] leading-none">
                      Powered by
                    </p>
                    <p className="text-[12.5px] font-semibold text-[#141312] leading-tight mt-0.5">
                      Sokheng Hun
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-left pr-1">
              <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.08em] text-[#6e6a62] leading-none">
                Powered by
              </p>
              <p className="text-[12.5px] font-semibold text-[#141312] leading-tight mt-0.5">
                Sopheak Khoeun &amp; Sokheng Hun
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
