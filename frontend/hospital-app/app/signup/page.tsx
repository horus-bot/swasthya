'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/api/supabase';
import { registerHospital } from '../lib/api/hospital.service';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    hospital_id: '',
    name: '',
    ward_id: '',
    total_doctors: '',
    available_doctors: '',
    total_staff: '',
    available_staff: '',
    beds_available: '',
    equipment_available: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const authStatus = localStorage.getItem('hospital_auth');
    if (authStatus === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.hospital_id || !formData.name || !formData.ward_id || 
        !formData.total_doctors || !formData.available_doctors || 
        !formData.total_staff || !formData.available_staff || 
        !formData.beds_available || !formData.equipment_available || 
        !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Parse numbers
    const totalDoctors = parseInt(formData.total_doctors);
    const availableDoctors = parseInt(formData.available_doctors);
    const totalStaff = parseInt(formData.total_staff);
    const availableStaff = parseInt(formData.available_staff);
    const bedsAvailable = parseInt(formData.beds_available);
    const equipmentAvailable = parseInt(formData.equipment_available);

    try {
      // NOTE: We are skipping supabase.auth.signUp() for now to avoid database trigger issues.
      // We will rely on 'hospital_credentials' table for login.

      // 1. Create the Hospital Record (Public Table)
      console.log('Registering hospital details...');
      await registerHospital({
        id: formData.hospital_id,
        name: formData.name,
        ward_id: formData.ward_id,
        total_doctors: totalDoctors,
        available_doctors: availableDoctors,
        total_staff: totalStaff,
        available_staff: availableStaff,
        beds_available: bedsAvailable,
        equipment_available: equipmentAvailable
      });

      // 2. Create Credentials for Login (Custom Table)
      console.log('Saving credentials...');
      const { error: credentialError } = await supabase
        .from('hospital_credentials')
        .insert([{
            hospital_id: formData.hospital_id,
            password: formData.password 
        }]);

      if (credentialError) {
        // Detailed error logging
        console.error('Credential Error Details:', credentialError);
        throw new Error('Failed to save login credentials: ' + credentialError.message);
      }

      setSuccess('Hospital registered successfully! Redirecting to login...');
      
      // Clear form
      setFormData({
        hospital_id: '',
        name: '',
        ward_id: '',
        total_doctors: '',
        available_doctors: '',
        total_staff: '',
        available_staff: '',
        beds_available: '',
        equipment_available: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error: any) {
      // Improved Error Logging
      console.error('Signup Failed. Error Object:', error);
      if (typeof error === 'object' && error !== null) {
          // Attempt to log specific properties if standard logging fails
          console.error('Error Message:', error.message);
          console.error('Error Details:', error.details);
          console.error('Error Hint:', error.hint);
      }
      
      const msg = error?.message || 'Registration failed due to an unknown error.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-600 to-teal-400 rounded-xl p-2 shadow-md">
            <img src="/logo.svg" alt="Swasthya" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Register Hospital</h1>
          <p className="text-gray-600">Join Our Healthcare Network</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Identity Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital ID *</label>
              <input
                type="text"
                name="hospital_id"
                value={formData.hospital_id}
                onChange={handleInputChange}
                placeholder="sims1012"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="SIMS Hospital"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Ward ID *</label>
              <input
                type="text"
                name="ward_id"
                value={formData.ward_id}
                onChange={handleInputChange}
                placeholder="WARD-123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
          </div>

          {/* Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Doctors *</label>
              <input
                type="number"
                name="total_doctors"
                value={formData.total_doctors}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Doctors *</label>
              <input
                type="number"
                name="available_doctors"
                value={formData.available_doctors}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Staff Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Staff *</label>
              <input
                type="number"
                name="total_staff"
                value={formData.total_staff}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Staff *</label>
              <input
                type="number"
                name="available_staff"
                value={formData.available_staff}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Resource Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Beds *</label>
              <input
                type="number"
                name="beds_available"
                value={formData.beds_available}
                onChange={handleInputChange}
                placeholder="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Available *</label>
              <input
                type="number"
                name="equipment_available"
                value={formData.equipment_available}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {loading ? 'Registering...' : 'Register Hospital'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already registered?{' '}
            <Link href="/login" className="text-[#3b82f6] hover:text-[#2563eb] font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}