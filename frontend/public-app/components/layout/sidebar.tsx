import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white shadow h-screen p-4 text-sm">
      <ul className="space-y-2">
        <li><Link href="/clinics">Nearest Clinics</Link></li>
        <li><Link href="/routing">Smart Routing</Link></li>
        <li><Link href="/appointments">Appointments</Link></li>
        <li><Link href="/map">Healthcare Map</Link></li>
        <li><Link href="/tracker">Health Tracker</Link></li>
      </ul>
    </aside>
  );
}
