"use client";

export default function NotificationPage() {
  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-gray-500">
          Updates and notifications from all healthcare services
        </p>
      </div>

      {/* ================= Appointments ================= */}
      <AlertSection title="Appointments">
        <AlertCard
          icon="📅"
          title="Upcoming Doctor Appointment"
          description="Appointment scheduled with verified doctor"
          meta="Tomorrow · 10:30 AM"
          tag="Appointment"
        />
      </AlertSection>

      {/* ================= Clinics ================= */}
      <AlertSection title="Clinics">
        <AlertCard
          icon="🏥"
          title="Nearby Clinic Available"
          description="Government clinic is open near your location"
          meta="2 km away"
          tag="Clinic"
        />
      </AlertSection>

      {/* ================= Routing ================= */}
      <AlertSection title="Routing">
        <AlertCard
          icon="🗺️"
          title="Optimized Route Available"
          description="AI found a faster route to your clinic"
          meta="Save 12 minutes"
          tag="Routing"
        />
      </AlertSection>

      {/* ================= Health Tracker ================= */}
      <AlertSection title="Health Tracker">
        <AlertCard
          icon="📊"
          title="Abnormal Health Reading"
          description="High blood pressure detected"
          meta="Today"
          tag="Health"
          warning
        />
      </AlertSection>

      {/* ================= Health Reports ================= */}
      <AlertSection title="Health Reports">
        <AlertCard
          icon="📄"
          title="New Medical Report Uploaded"
          description="Blood test report is now available"
          meta="Today"
          tag="Report"
        />
      </AlertSection>

      {/* ================= Alerts / Reminders ================= */}
      <AlertSection title="Reminders">
        <AlertCard
          icon="⏰"
          title="Medicine Reminder"
          description="Time to take blood pressure medicine"
          meta="8:00 AM"
          tag="Reminder"
        />
      </AlertSection>

      {/* ================= AI Assistant ================= */}
      <AlertSection title="AI Assistant">
        <AlertCard
          icon="🤖"
          title="Health Tip from AI Assistant"
          description="Stay hydrated during heatwave conditions"
          meta="Just now"
          tag="AI"
        />
      </AlertSection>
    </main>
  );
}

/* ================= Reusable Components ================= */

function AlertSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function AlertCard({
  icon,
  title,
  description,
  meta,
  tag,
  warning = false,
}: {
  icon: string;
  title: string;
  description: string;
  meta: string;
  tag: string;
  warning?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 flex items-start justify-between hover:shadow-md transition ${
        warning ? "border-red-400" : ""
      }`}
    >
      {/* Left */}
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
            warning
              ? "bg-red-100 border border-red-400"
              : "bg-blue-50 border border-blue-400"
          }`}
        >
          {icon}
        </div>

        {/* Text */}
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>

          <span
            className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
              warning
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {tag}
          </span>
        </div>
      </div>

      {/* Right Meta */}
      <span className="text-sm text-gray-400 whitespace-nowrap">
        {meta}
      </span>
    </div>
  );
}
