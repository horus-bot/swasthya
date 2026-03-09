"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  User,
  Phone,
  MapPin,
  HeartPulse,
  Droplets,
  Activity,
  Save,
  ArrowLeft,
} from "lucide-react";
import { theme } from "@/lib/theme";

export default function PatientHealthRecordPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    location: "",
    bp: "",
    sugar: "",
    symptoms: "",
  });

  useEffect(() => {
    gsap.fromTo(
      ".form-section",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }
    );
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div
      ref={pageRef}
      style={{
        maxWidth: "920px",
        margin: "0 auto",
        padding: "32px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Header */}
      <div
        className="form-section"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "16px",
          borderRadius: theme.borderRadius.xl,
          background: `linear-gradient(135deg, ${theme.colors.bgBlue}, #ffffff)`,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "white",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "999px",
            padding: "8px",
            cursor: "pointer",
            boxShadow: theme.shadows.sm,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: theme.colors.primaryDark,
            }}
          >
            Patient Health Record
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Capture medical data securely during field visits
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div
        className="form-section"
        style={{
          backgroundColor: "white",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.xl,
          padding: "28px",
          boxShadow: theme.shadows.floating,
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* Patient Info */}
        <Section title="Patient Information" icon={User} accent={theme.colors.primary}>
          <Grid>
            <Input label="Patient Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />
            <Input label="Phone Number" name="phone" icon={Phone} value={form.phone} onChange={handleChange} />
            <Input label="Village / Sector" name="location" icon={MapPin} value={form.location} onChange={handleChange} />
          </Grid>
        </Section>

        {/* Vitals */}
        <Section title="Vitals & Measurements" icon={HeartPulse} accent={theme.colors.danger}>
          <Grid>
            <Input
              label="Blood Pressure (mmHg)"
              name="bp"
              placeholder="120 / 80"
              icon={Activity}
              value={form.bp}
              onChange={handleChange}
            />
            <Input
              label="Blood Sugar (mg/dL)"
              name="sugar"
              placeholder="Fasting / Random"
              icon={Droplets}
              value={form.sugar}
              onChange={handleChange}
            />
          </Grid>
        </Section>

        {/* Notes */}
        <Section title="Symptoms / Notes">
          <textarea
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            placeholder="Describe symptoms, observations, or remarks…"
            style={{
              width: "100%",
              minHeight: "110px",
              padding: "14px",
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              fontSize: "14px",
              outline: "none",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.bgBlue}`)
            }
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          />
        </Section>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button onClick={() => router.back()} style={secondaryButton}>
            Cancel
          </button>

          <button
            style={primaryButton}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Save size={18} />
            Save Health Record
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, icon: Icon, accent, children }: any) {
  return (
    <div className="form-section" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: theme.colors.primaryDark,
          borderLeft: accent ? `4px solid ${accent}` : undefined,
          paddingLeft: "8px",
        }}
      >
        {Icon && <Icon size={18} />}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {children}
    </div>
  );
}

function Input({ label, icon: Icon, ...props }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600 }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
        )}
        <input
          {...props}
          style={{
            width: "100%",
            padding: Icon ? "10px 12px 10px 34px" : "10px 12px",
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.bgBlue}`)
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600 }}>{label}</label>
      <select
        {...props}
        style={{
          padding: "10px 12px",
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border}`,
          fontSize: "14px",
        }}
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- BUTTON STYLES ---------------- */

const primaryButton = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 22px",
  borderRadius: theme.borderRadius.lg,
  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
  color: "white",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  boxShadow: theme.shadows.sm,
  transition: "transform 0.15s",
};

const secondaryButton = {
  padding: "12px 18px",
  borderRadius: theme.borderRadius.lg,
  backgroundColor: "#f1f5f9",
  border: `1px solid ${theme.colors.border}`,
  cursor: "pointer",
};
