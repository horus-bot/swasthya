type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-[#3b82f6] transition-all duration-300 group hover:scale-105 transform cursor-pointer">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 group-hover:text-[#3b82f6] transition-colors duration-200">{title}</p>
          <p className="text-4xl font-bold mt-3 text-slate-900 group-hover:text-[#1e3a8a] transition-colors duration-200">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {/* Icon background with animation */}
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg group-hover:scale-110 transform"></div>
      </div>
    </div>
  );
}
