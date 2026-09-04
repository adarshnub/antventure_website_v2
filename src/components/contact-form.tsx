"use client";

import { useSearchParams } from "next/navigation";
import { cloneElement, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { track } from "@vercel/analytics";

type ContactFields = {
  firstName: string; lastName: string; email: string; jobTitle: string; company: string;
  companySize: string; country: string; phone: string; reason: string; details: string;
  consent: boolean; website: string;
};

const reasonLabels: Record<string, string> = {
  rolex: "ROLE:X demonstration",
  workflow: "Automate a workflow",
  business: "AI for my business",
  enterprise: "Enterprise AI transformation",
  government: "Government or sovereign AI",
  general: "General enquiry",
};

export function ContactForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const initialReason = useMemo(() => reasonLabels[params.get("reason") ?? ""] ?? "General enquiry", [params]);
  const scenario = params.get("scenario") ?? "";
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFields>({ defaultValues: { reason: initialReason, details: scenario ? `I would like to explore this workflow: ${scenario}` : "", consent: false, website: "" } });

  const onSubmit = async (values: ContactFields) => {
    setStatus("loading");
    const message = [
      `Company: ${values.company}`,
      `Job title: ${values.jobTitle}`,
      `Company size: ${values.companySize}`,
      `Country/region: ${values.country}`,
      `Reason: ${values.reason}`,
      `Marketing consent: ${values.consent ? "Yes" : "No"}`,
      scenario ? `Explorer context: ${scenario}` : "",
      "",
      values.details,
    ].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${values.firstName} ${values.lastName}`.trim(), email: values.email, mobile: values.phone, website: values.website, message }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      track("contact_submit_success", { reason: values.reason });
      reset({ reason: initialReason, details: "", consent: false, website: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <div className="form-success" role="status"><span aria-hidden="true">● ● ●</span><h2>Thank you.</h2><p>Your note is with our team. We’ll come back with the next useful step.</p><button className="text-link" type="button" onClick={() => setStatus("idle")}>Send another enquiry</button></div>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-grid">
        <Field label="First name" error={errors.firstName?.message}><input autoComplete="given-name" {...register("firstName", { required: "Enter your first name" })} /></Field>
        <Field label="Last name" error={errors.lastName?.message}><input autoComplete="family-name" {...register("lastName", { required: "Enter your last name" })} /></Field>
        <Field label="Work email" error={errors.email?.message}><input type="email" autoComplete="email" {...register("email", { required: "Enter your work email", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} /></Field>
        <Field label="Phone number" error={errors.phone?.message}><input type="tel" autoComplete="tel" {...register("phone", { required: "Enter your phone number", minLength: { value: 6, message: "Enter a valid phone number" } })} /></Field>
        <Field label="Job title" error={errors.jobTitle?.message}><input autoComplete="organization-title" {...register("jobTitle", { required: "Enter your job title" })} /></Field>
        <Field label="Company" error={errors.company?.message}><input autoComplete="organization" {...register("company", { required: "Enter your company name" })} /></Field>
        <Field label="Company size" error={errors.companySize?.message}><select {...register("companySize", { required: "Select a company size" })}><option value="">Select</option><option>1–20</option><option>21–100</option><option>101–500</option><option>501–2,000</option><option>2,001+</option></select></Field>
        <Field label="Country or region" error={errors.country?.message}><input autoComplete="country-name" {...register("country", { required: "Enter your country or region" })} /></Field>
      </div>
      <Field label="Reason for contact" error={errors.reason?.message}><select {...register("reason", { required: true })}>{Object.values(reasonLabels).map((reason) => <option key={reason}>{reason}</option>)}</select></Field>
      <Field label="Tell us about the work" hint="A short description is enough. We’ll map the detail together."><textarea rows={6} {...register("details", { required: "Tell us a little about the workflow", minLength: { value: 10, message: "Please add a little more detail" } })} /></Field>
      <input className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register("website")} />
      <label className="check-row"><input type="checkbox" {...register("consent")} /><span>I agree to receive relevant Ant Venture communications. I can unsubscribe at any time.</span></label>
      {status === "error" && <p className="form-error" role="alert">We couldn’t send that message. Please try again or email support@antventure.ai.</p>}
      <button className="button dark submit-button" type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Contact sales"}<span aria-hidden="true">↗</span></button>
    </form>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }> }) {
  const id = label.toLowerCase().replaceAll(/[^a-z]+/g, "-");
  const errorId = `${id}-error`;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>{hint && <small>{hint}</small>}
      {cloneElement(children, { id, "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}
      {error && <em id={errorId}>{error}</em>}
    </label>
  );
}
