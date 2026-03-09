import FeatureCard from "./FeatureCard";

const features = [
  { title: "Nearest Clinic", description: "Find nearby public clinics" },
  { title: "Waiting Time", description: "Live queue estimation" },
  { title: "Smart Routing", description: "Condition-based routing" },
  { title: "Book Appointment", description: "Schedule visits easily" },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map(f => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </div>
  );
}
