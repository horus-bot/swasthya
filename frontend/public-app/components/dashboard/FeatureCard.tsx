type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}
