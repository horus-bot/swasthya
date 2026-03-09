type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}
