"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "../_trpc/client";
import { tr } from "zod/locales";



type FormState = {
    name: string;
    email: string;
    password: string;
    confirm: string;
    remember: boolean;
};

 function SignupPage( ) {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        password: "",
        confirm: "",
        remember: false,
    });
    const mutation = trpc.signIn.useMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [pwScore, setPwScore] = useState(0);

    useEffect(() => {
        setPwScore(calcPasswordScore(form.password));
    }, [form.password]);

    function calcPasswordScore(pw: string) {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score; // 0..4
    }

    function pwLabel(score: number) {
        return ["Too weak", "Weak", "OK", "Good", "Strong"][score] ?? "Too weak";
    }

    function validate(): boolean {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
        if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

     function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSuccess(null);
        if (!validate()) return;
        setSubmitting(false);
        mutation.mutate({
            name: form.name,
            email: form.email,
            password: form.password,
        }, {
            onSuccess(data) {
                setSubmitting(true);
                setSuccess("Account created successfully! You can now log in.");
            }
        });
            console.log("Render SignupPage", { form, errors, pwScore, submitting, success });

    }


    return (
        <>
            <main className="page">
                <div className="hero">
                    <div className="glass">
                        <h1 className="title">Create your account</h1>
                        <p className="subtitle">Join us — beautiful forms, delightful experience.</p>

                        <form className="form" onSubmit={handleSubmit} noValidate>
                            <label className="field">
                                <span className="labelText">Full name</span>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={form.name}
                                    onChange={(ev) => setForm({ ...form, name: ev.target.value })}
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                />
                                {errors.name && (
                                    <div id="name-error" role="alert" className="error">
                                        {errors.name}
                                    </div>
                                )}
                            </label>

                            <label className="field">
                                <span className="labelText">Email</span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={(ev) => setForm({ ...form, email: ev.target.value })}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                />
                                {errors.email && (
                                    <div id="email-error" role="alert" className="error">
                                        {errors.email}
                                    </div>
                                )}
                            </label>

                            <div className="twoCols">
                                <label className="field">
                                    <span className="labelText">Password</span>
                                    <div className="pwWrap">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={form.password}
                                            onChange={(ev) => setForm({ ...form, password: ev.target.value })}
                                            aria-invalid={!!errors.password}
                                            aria-describedby={errors.password ? "pw-error" : "pw-strength"}
                                        />
                                        <button
                                            type="button"
                                            className="toggle"
                                            onClick={() => setShowPassword((s) => !s)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            tabIndex={0}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div id="pw-strength" className="pwStrength" aria-hidden="false">
                                        <div className={`meter s${pwScore}`} />
                                        <div className="pwMeta">
                                            <small className="pwLabel">{pwLabel(pwScore)}</small>
                                            <small className="pwTip">Use uppercase, numbers & symbols.</small>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <div id="pw-error" role="alert" className="error">
                                            {errors.password}
                                        </div>
                                    )}
                                </label>

                                <label className="field">
                                    <span className="labelText">Confirm</span>
                                    <input
                                        id="confirm"
                                        name="confirm"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Re-type password"
                                        value={form.confirm}
                                        onChange={(ev) => setForm({ ...form, confirm: ev.target.value })}
                                        aria-invalid={!!errors.confirm}
                                        aria-describedby={errors.confirm ? "confirm-error" : undefined}
                                    />
                                    {errors.confirm && (
                                        <div id="confirm-error" role="alert" className="error">
                                            {errors.confirm}
                                        </div>
                                    )}
                                </label>
                            </div>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={(ev) => setForm({ ...form, remember: ev.target.checked })}
                                />
                                <span>Keep me signed in</span>
                            </label>

                            <button
                                className="submit"
                                type="submit"
                                disabled={submitting}
                                aria-busy={submitting}
                            >
                                {submitting ? "Creating..." : "Create account"}
                            </button>

                            <div className="divider">Or continue with</div>

                            <div className="socials">
                                <button type="button" className="social google" aria-label="Sign up with Google">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                                        <path d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84c-.21 1.16-.86 2.15-1.83 2.8v2.33h2.96c1.73-1.6 2.73-3.95 2.73-6.77z" fill="#4285F4"/>
                                        <path d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.96-2.33c-.82.55-1.87.88-2.99.88-2.3 0-4.25-1.55-4.95-3.64H1.97v2.29C3.46 15.86 6.02 18 9 18z" fill="#34A853"/>
                                        <path d="M4.05 10.73a5.42 5.42 0 010-3.46V4.98H1.97a9 9 0 000 8.04l2.08-2.29z" fill="#FBBC05"/>
                                        <path d="M9 3.56c1.32 0 2.5.45 3.43 1.34l2.57-2.56C13.45.86 11.42 0 9 0 6.02 0 3.46 2.14 1.97 4.98l2.08 2.29C4.75 5.11 6.7 3.56 9 3.56z" fill="#EA4335"/>
                                    </svg>
                                    Google
                                </button>

                                <button type="button" className="social github" aria-label="Sign up with GitHub">
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8 .198a8 8 0 00-2.53 15.59c.4.073.55-.174.55-.387 0-.19-.007-.693-.01-1.36-2.24.487-2.71-1.08-2.71-1.08-.364-.924-.89-1.17-.89-1.17-.727-.497.055-.487.055-.487.803.057 1.225.825 1.225.825.714 1.223 1.873.87 2.328.666.072-.517.28-.87.508-1.07-1.788-.203-3.667-.894-3.667-3.978 0-.879.314-1.597.826-2.16-.083-.204-.358-1.025.078-2.136 0 0 .67-.215 2.2.82a7.64 7.64 0 012-.27 7.64 7.64 0 012 .27c1.53-1.035 2.2-.82 2.2-.82.436 1.11.162 1.932.08 2.136.513.563.825 1.281.825 2.16 0 3.093-1.882 3.772-3.676 3.97.288.247.544.733.544 1.48 0 1.068-.01 1.93-.01 2.192 0 .215.147.463.556.385A8 8 0 008 .198z" fill="#fff"/>
                                    </svg>
                                    GitHub
                                </button>
                            </div>

                            {success && (
                                <div role="status" className="success" aria-live="polite">
                                    {success}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="attribution">
                    Crafted with care — responsive, accessible and delightful.
                </div>
            </main>

            <style jsx>{`
                :root {
                    --bg-1: #0f172a;
                    --bg-2: #011627;
                    --card: rgba(255,255,255,0.06);
                    --glass: rgba(255,255,255,0.04);
                    --accent: linear-gradient(90deg,#7c3aed,#06b6d4);
                    --muted: rgba(255,255,255,0.7);
                }

                * { box-sizing: border-box; }
                body,html,#__next { height: 100%; margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

                .page {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 48px 20px;
                    background: radial-gradient(1000px 600px at 10% 20%, rgba(124,58,237,0.12), transparent),
                                            radial-gradient(800px 500px at 90% 80%, rgba(6,182,212,0.06), transparent),
                                            linear-gradient(180deg, var(--bg-1), var(--bg-2));
                }

                .hero { width: 100%; max-width: 980px; display: flex; justify-content: center; align-items: center; gap: 32px; }
                .glass {
                    width: 100%;
                    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.015));
                    border: 1px solid rgba(255,255,255,0.06);
                    backdrop-filter: blur(8px) saturate(120%);
                    padding: 34px;
                    border-radius: 14px;
                    box-shadow: 0 10px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
                }

                .title { margin: 0; font-size: 22px; color: #fff; letter-spacing: -0.2px; }
                .subtitle { margin: 8px 0 22px 0; color: var(--muted); font-size: 13px; }

                .form { display: grid; gap: 14px; }
                .field { display: flex; flex-direction: column; gap: 8px; }
                .labelText { color: #cbd5e1; font-size: 13px; }

                input[type="text"], input[type="email"], input[type="password"] {
                    width: 100%;
                    background: var(--card);
                    border: 1px solid rgba(255,255,255,0.06);
                    padding: 12px 14px;
                    border-radius: 10px;
                    color: #fff;
                    outline: none;
                    transition: box-shadow .15s, transform .06s;
                    font-size: 14px;
                }
                input::placeholder { color: rgba(255,255,255,0.35); }
                input:focus { box-shadow: 0 4px 18px rgba(6,182,212,0.08); transform: translateY(-1px); border-color: rgba(6,182,212,0.2); }

                .twoCols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .pwWrap { display: flex; gap: 8px; align-items: center; }
                .toggle {
                    background: transparent;
                    border: none;
                    color: #a5b4fc;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 8px 10px;
                    border-radius: 8px;
                }

                .pwStrength { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
                .meter {
                    height: 8px;
                    width: 120px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                }
                .meter::after {
                    content: "";
                    position: absolute;
                    height: 100%;
                    left: 0;
                    top: 0;
                    transition: width .35s ease, background .35s ease;
                }
                .meter.s0::after { width: 12%; background: #ef4444; }
                .meter.s1::after { width: 35%; background: #f97316; }
                .meter.s2::after { width: 58%; background: #fbbf24; }
                .meter.s3::after { width: 80%; background: #60a5fa; }
                .meter.s4::after { width: 100%; background: #34d399; }

                .pwMeta { display:flex; gap:10px; align-items:center; color: var(--muted); font-size: 12px; }
                .pwLabel { color: #fff; font-weight: 600; margin-right: 6px; }

                .checkbox { display:flex; gap:10px; align-items:center; color: var(--muted); font-size: 13px; margin-top: 6px; }
                .checkbox input { width: 16px; height: 16px; accent-color: #7c3aed; }

                .submit {
                    margin-top: 6px;
                    background: var(--accent);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 6px 18px rgba(124,58,237,0.2);
                }
                .submit[disabled] { opacity: 0.6; cursor: not-allowed; }

                .divider { text-align: center; color: var(--muted); margin: 8px 0 2px; font-size: 12px; }

                .socials { display:flex; gap: 10px; margin-top: 8px; }
                .social {
                    flex: 1;
                    display:flex;
                    align-items:center;
                    gap:10px;
                    justify-content:center;
                    padding: 10px 12px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.04);
                    background: rgba(255,255,255,0.02);
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                }
                .social svg { filter: drop-shadow(0 1px 0 rgba(0,0,0,0.2)); }
                .social.google { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); }
                .social.github { background: rgba(255,255,255,0.02); }

                .error { color: #ffb4b4; font-size: 12px; margin-top: 6px; }
                .success { margin-top: 10px; color: #bbf7d0; background: rgba(0,0,0,0.15); padding: 8px 10px; border-radius: 8px; font-weight: 600; }

                .attribution { margin-top: 18px; color: rgba(255,255,255,0.4); font-size: 13px; text-align: center; }

                @media (max-width: 720px) {
                    .twoCols { grid-template-columns: 1fr; }
                    .hero { padding: 10px; }
                }
            `}</style>
        </>
    );
}

export default SignupPage;