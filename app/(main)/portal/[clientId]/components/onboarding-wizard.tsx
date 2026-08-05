'use client';
import React, { useState } from 'react';
import { User, Users, Building2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useCreateProfile } from '@/hooks/profile/use-profile';
import { useRouter } from 'next/navigation';

interface FormData {
  type: "INDIVIDUAL" | "GROUP" | "ORGANIZATION";

  displayName: string;
  phone: string;
  country: string;
  city: string;
  website: string;
  logoUrl: string;
  kraPin: string;
  address: string;
}

const OnboardingWizard = ({userName}:{userName: string}) => {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    type: 'INDIVIDUAL',
    displayName: '',
    phone: '',
    country: '',
    city: '',
    website: '',
    logoUrl: '',
    kraPin: '',
    address: '',
  });
  const {mutate: createProfile, isPending, isSuccess} = useCreateProfile();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const nextStep = () => setStep((p) => Math.min(p + 1, 3));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const isStep2Valid = formData.type !== null;
  
  const isStep3Valid = () => {
    if (formData.type === 'INDIVIDUAL') {
      return formData.phone && formData.country && formData.city;
    }
    if (formData.type === 'GROUP') {
      return formData.displayName && formData.country && formData.city && formData.phone;
    }
    if (formData.type === 'ORGANIZATION') {
      return formData.displayName && formData.country && formData.city && formData.website && formData.phone && formData.address && formData.kraPin;
    }
    return false;
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if(formData.type === 'INDIVIDUAL'){
        const payload = {
            ...formData,
            displayName: userName
        }
        createProfile(payload,
            {
                onSuccess:(data)=>{
                    router.replace(`/portal/${data?.data?.userId}/dashboard`)
                }
            }
        );
    }else{
        createProfile(formData, {
            onSuccess:(data)=>{
                router.replace(`/portal/${data?.data?.userId}/dashboard`)
            }
        });
    }
    if(isSuccess){
        router.replace(`/portal/`)
    }
  };

  return (
        <div className="p-8 md:p-12">
          
          {/* STEP 1: WELCOME & INTRO */}
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Sparkles size={24} />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                  Welcome to CertBridge Global!
                </h1>
                <p className="text-slate-600 text-base leading-relaxed">
                  Your account has been created successfully. To match you with the right training delivery frameworks, customize your logistics, and streamline your experience, we just need a few more details.
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80">
                <h3 className="font-semibold text-slate-800 text-sm mb-1">What happens next?</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Select your learning structure, add minimal background data, and unlock complete access to specialized course matching. It takes less than 60 seconds.
                </p>
              </div>
              <button 
                onClick={nextStep}
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Let&apos;s get started
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: ACCOUNT TYPE SELECTION */}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  How will you be using the platform?
                </h2>
                <p className="text-sm text-slate-500">
                  Select the structure that best fits your immediate learning requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Personal Option */}
                <div 
                  onClick={() => handleInputChange('type', 'INDIVIDUAL')}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-48 ${formData.type === 'INDIVIDUAL' ? 'border-blue-600 bg-blue-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'INDIVIDUAL' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Personal Use</h3>
                    <p className="text-xs text-slate-500 leading-normal">For self-funded, individual learning paths.</p>
                  </div>
                </div>

                {/* Group Option */}
                <div 
                  onClick={() => handleInputChange('type', 'GROUP')}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-48 ${formData.type === 'GROUP' ? 'border-blue-600 bg-blue-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'GROUP' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">For a Group</h3>
                    <p className="text-xs text-slate-500 leading-normal">For coordinated study teams or cohort events.</p>
                  </div>
                </div>

                {/* Organization Option */}
                <div 
                  onClick={() => handleInputChange('type', 'ORGANIZATION')}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-48 ${formData.type === 'ORGANIZATION' ? 'border-blue-600 bg-blue-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'ORGANIZATION' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Organization</h3>
                    <p className="text-xs text-slate-500 leading-normal">For business-wide training logistics and invoicing.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={prevStep} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                  <ChevronLeft size={16} /> Back
                </button>
                <button 
                  onClick={nextStep}
                  disabled={!isStep2Valid}
                  className={`px-6 py-3 font-semibold text-sm rounded-xl flex items-center gap-1 shadow-md transition-all ${isStep2Valid ? 'bg-slate-950 hover:bg-slate-900 text-white cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC FORM DATA */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {formData.type === 'INDIVIDUAL' && "Give us a few details about yourself"}
                  {formData.type === 'GROUP' && "Set up your group or team profile"}
                  {formData.type === 'ORGANIZATION' && "Set up your corporate profile"}
                </h2>
                <p className="text-sm text-slate-500">
                  Please fill out the remaining parameters to complete your initialization.
                </p>
              </div>

              {/* Dynamic Sub-Forms */}
              <div className="space-y-4">
                {formData.type === 'INDIVIDUAL' && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Name</label>
                      <input readOnly value={userName} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" required placeholder="+254 712 345 678" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Country</label>
                      <input type="text" required placeholder="e.g. Kenya" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
                      <input type="text" required placeholder="e.g. Nairobi" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                  </>
                )}

                {formData.type === 'GROUP' && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Group or Team Name</label>
                      <input type="text" required placeholder="e.g. Nexus Cohort 2026" value={formData.displayName} onChange={(e) => handleInputChange('displayName', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                     <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Phone Number</label>
                      <input type="tel" required placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Country</label>
                      <input type="text" required placeholder="e.g. Kenya" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
                      <input type="text" required placeholder="e.g. Nairobi" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                  </>
                )}

                {formData.type === 'ORGANIZATION' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Organization/Company Name</label>
                        <input type="text" required placeholder="e.g. Acme Corporation" value={formData.displayName} onChange={(e) => handleInputChange('displayName', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                      </div>
                       <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Phone Number</label>
                      <input type="tel" required placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Country</label>
                      <input type="text" required placeholder="e.g. Kenya" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
                      <input type="text" required placeholder="e.g. Nairobi" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Website</label>
                      <input type="text" required placeholder="e.g. www.acme.com" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                      <input type="text" required placeholder="e.g. Koinange Street, Nairobi" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">KRA Pin</label>
                      <input type="text" required placeholder="e.g. P123456789A" value={formData.kraPin} onChange={(e) => handleInputChange('kraPin', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-800 text-sm bg-slate-50/50" />
                    </div>
                    </div>
                  </>
                )}
              </div>

              {/* Step 3 Navigation Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                <button type="button" onClick={prevStep} disabled={isPending} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                  <ChevronLeft size={16} /> Back
                </button>
                <button 
                  type="submit"
                  disabled={!isStep3Valid() || isPending}
                  className={`px-6 py-3 font-semibold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all ${isStep3Valid() ? 'bg-primary text-white cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
                >
                    {isPending ? "Submitting..." : 'Complete Setup'}
                </button>
              </div>
            </form>
          )}

        </div>
  );
};

export default OnboardingWizard;