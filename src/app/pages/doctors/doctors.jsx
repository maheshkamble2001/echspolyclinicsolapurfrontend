import React, { useState, useEffect } from 'react';
import { listDoctors } from '../../../api/doctor';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listDoctors();

      if (response?.code === 200 && response?.data?.Doctors) {
        setDoctors(response.data.Doctors);
      } else {
        setError(response?.message || 'Doctors fetch nahi ho sake');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Data load karne me problem aayi. Kripya punah prayas karein.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2d52e5] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-100 text-lg">Loading Doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2d52e5] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-200 text-xl mb-4">⚠️ {error}</p>
          <button 
            onClick={fetchDoctors}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d52e5] text-white flex flex-col items-center justify-start py-8 px-4 sm:px-6 md:px-12 font-sans selection:bg-white selection:text-[#2d52e5]">
      
      {/* Title Header */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center my-6 sm:my-10">
        ECHS Doctors Solapur
      </h1>

      {/* Grid Display */}
      <main className="w-full max-w-5xl my-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {doctors.map((doctor) => {
            const name = doctor.doctorname || '';
            const displayName = name.toLowerCase().startsWith('dr') ? name : `Dr ${name}`;

            return (
              <div
                key={doctor.id}
                className="bg-[#dcdde1] rounded-xl p-8 sm:p-10 md:p-12 text-center shadow-md flex flex-col items-center justify-center transition-transform hover:scale-[1.01]"
              >
                {/* Doctor Name */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3b5998] tracking-wide mb-6">
                  {displayName}
                </h2>

                {/* Login Button */}
                <button
                  type="button"
                  className="bg-[#c0392b] hover:bg-[#a93226] text-white text-base sm:text-lg font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Doctor Login
                </button>
              </div>
            );
          })}
        </div>
      </main>

    </div>
  );
};

export default Doctors;