'use client';
import { useState } from "react";
import { courses } from "@/lib/courses";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";


export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="bg-primary text-white py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            Book a Training
          </span>
          <h1 className="mt-3 font-display text-5xl lg:text-6xl font-bold max-w-3xl">
            Tell us what your team needs
          </h1>
          <p className="mt-5 text-lg text-white/75 max-w-2xl">
            Fill in the form and we&apos;ll come back within 24 hours with trainer options,
            pricing and proposed dates.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-accent-green mx-auto mb-4" />
                <h2 className="font-display text-3xl font-bold mb-2">
                  Request received
                </h2>
                <p className="text-text-secondary">
                  Thanks — one of our training advisors will reach out within 24
                  hours with a tailored proposal.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="bg-white border border-blue-100 rounded-2xl p-8 lg:p-10 shadow-sm space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Company name" required>
                    <input required className={inputCls} placeholder="Acme Ltd" />
                  </Field>
                  <Field label="Your name" required>
                    <input required className={inputCls} placeholder="Jane Wanjiku" />
                  </Field>
                  <Field label="Work email" required>
                    <input
                      required
                      type="email"
                      className={inputCls}
                      placeholder="jane@acme.co.ke"
                    />
                  </Field>
                  <Field label="Phone (optional)">
                    <input className={inputCls} placeholder="+254 700 000 000" />
                  </Field>
                  <Field label="Course of interest">
                    <select className={inputCls} defaultValue="">
                      <option value="">Not sure yet — recommend one</option>
                      {courses.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Number of participants">
                    <select className={inputCls} defaultValue="">
                      <option value="">Select group size</option>
                      <option>1 (Individual)</option>
                      <option>2 – 10</option>
                      <option>11 – 25</option>
                      <option>26 – 50</option>
                      <option>50+</option>
                    </select>
                  </Field>
                  <Field label="Preferred format">
                    <select className={inputCls} defaultValue="">
                      <option value="">Select format</option>
                      <option>Online</option>
                      <option>At our offices</option>
                      <option>At a venue you arrange</option>
                      <option>Not sure yet</option>
                    </select>
                  </Field>
                  <Field label="Preferred dates">
                    <input className={inputCls} placeholder="e.g. 15 – 17 March" />
                  </Field>
                </div>

                <Field label="Anything else we should know?">
                  <textarea
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us about your team, goals, or any custom needs..."
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold transition"
                >
                  Submit Booking Request
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-primary text-white rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold mb-5">Talk to us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-white mt-0.5" />
                  <span>hello@trainhub.co.ke</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-white mt-0.5" />
                  <span>+254 700 000 000</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-white mt-0.5" />
                  <span>Westlands Office Park,
                    <br /> Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8">
              <h3 className="font-display text-lg font-bold mb-2">Response time</h3>
              <p className="text-sm text-text-secondary">
                We respond to every booking request within one business day,
                Monday – Friday.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-lg border border-purple-100 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-text-primary mb-2">
        {label} {required && <span className="text-accent-green">*</span>}
      </span>
      {children}
    </label>
  );
}
