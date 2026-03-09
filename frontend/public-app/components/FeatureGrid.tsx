import FeatureCard from "./FeatureCard";

const features = [
  { title: "Nearest Clinic", desc: "Find nearby public clinics instantly" },
  { title: "Waiting Time", desc: "Live queue & waiting time info" },
  { title: "Smart Routing", desc: "Pregnancy, fever & emergency routing" },
  { title: "Book Appointment", desc: "Schedule visits at public clinics" },
  { title: "Health Profile", desc: "Your medical history & reports" },
  { title: "Mobile Health Tracker", desc: "Track health updates & follow-ups" },
  { title: "Alerts & Notifications", desc: "Govt & emergency health alerts" },
  { title: "Report / Request", desc: "Submit issues & service requests" },
];

export default function FeatureGrid() {
  return (
    <section className="p-4">
      <h2 className="text-lg font-semibold mb-4">App Features</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.desc}
          />
        ))}
      </div>
    </section>
  );
}
