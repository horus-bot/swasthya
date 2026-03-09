type Props = {
  name: string;
  waitingTime: string;
};

export default function ClinicCard({ name, waitingTime }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium">{name}</h3>
      <p className="text-sm text-gray-600">
        Waiting Time: {waitingTime}
      </p>
    </div>
  );
}
