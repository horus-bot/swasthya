export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      {children}
    </div>
  );
}
