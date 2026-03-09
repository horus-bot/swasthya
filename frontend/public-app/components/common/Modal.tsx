export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">{children}</div>
    </div>
  );
}
