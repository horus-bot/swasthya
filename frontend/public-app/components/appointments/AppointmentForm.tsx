export default function AppointmentForm() {
  return (
    <form className="bg-white p-4 rounded shadow space-y-3">
      <input className="border p-2 w-full" placeholder="Select Clinic" />
      <input type="date" className="border p-2 w-full" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Confirm Appointment
      </button>
    </form>
  );
}
