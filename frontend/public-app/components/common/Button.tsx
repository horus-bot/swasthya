type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}
