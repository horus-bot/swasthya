import ClinicCard from "./ClinicCard";

export default function ClinicList() {
  return (
    <div className="space-y-3">
      <ClinicCard name="City Health Center" waitingTime="15 mins" />
      <ClinicCard name="Community Clinic" waitingTime="10 mins" />
    </div>
  );
}
