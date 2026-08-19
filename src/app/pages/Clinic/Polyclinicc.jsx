import React, { useState, useEffect } from 'react';
import { getDoctorwiseTokens } from '../../../api/polyclinic.js/polyclinicc';

const Polyclinicc = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Tokens from API with search, page and limit parameters
  useEffect(() => {
    fetchTokens(debouncedSearch, currentPage, limit);
  }, [debouncedSearch, currentPage, limit]);

  console.log(currentPage)
  const fetchTokens = async (search = '', page = 1, itemsPerPage = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      // Pass all parameters to API
      const response = await getDoctorwiseTokens({
        search: search,
        page: page,
        limit: itemsPerPage
      });

      console.log('API Response:', response);

      if (response.code === 200 && response.data?.tokens) {
        const formattedDoctors = response.data.tokens.map((item) => ({
          id: item.id,
          name: item.doctor?.doctorname || `Dr ${item.doctorid}`,
          roomname: item.doctor?.roomname || null,
          count: parseInt(item.tokenno) || 0,
          doctorid: item.doctorid,
          addedon: item.addedon
        }));
        setDoctors(formattedDoctors);
        
        // Set pagination data from API response
        setTotalItems(response.data.total || response.data.totalItems || 0);
        setTotalPages(response.data.totalPages || response.data.pages || 0);
      } else {
        setError(response.message || 'Failed to fetch tokens');
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to load tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white/80 text-sm">Loading tokens...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-300 text-base mb-2">⚠️ {error}</p>
          <button 
            onClick={() => fetchTokens(debouncedSearch, currentPage, limit)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white flex flex-col items-center justify-start p-3 md:p-6 font-sans selection:bg-white selection:text-[#6a11cb]">
      
      {/* Login Button - Top Right */}
      <div className="w-full max-w-4xl flex justify-end mb-3">
        <a
          href="/doctors"
          className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition border border-white/20"
        >
          Login →
        </a>
      </div>

      {/* Main Display Header */}
      <header className="text-center my-4 sm:my-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wide drop-shadow-md">
          {import.meta.env.VITE_TITLE}
        </h1>
      </header>

      {/* Search Bar - Header ke neeche */}
      {/* <div className="w-full max-w-4xl mb-4 sm:mb-6">
        <div className="relative w-full sm:w-80 mx-auto">
          <input
            type="text"
            placeholder="Search doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md"
          />
          <svg
            className="w-4 h-4 absolute left-3.5 top-3 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery !== debouncedSearch && (
            <div className="absolute right-3 top-2.5">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div> */}
      {/* </div> */}

      {/* Token Display Grid */}
      <main className="w-full max-w-4xl px-1 sm:px-4 my-auto">
        {doctors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-xl flex flex-col items-center justify-center border border-blue-100/50 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Doctor Name */}
                  <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#6a11cb] tracking-tight">
                    {doctor.name}
                  </h2>

                  {/* Room Name */}
                  {doctor.roomname && (
                    <span className="text-sm sm:text-base md:text-lg text-[#6a11cb]/70 font-medium mt-0.5">
                      ({doctor.roomname})
                    </span>
                  )}

                  {/* Patient Token Count */}
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#dc2626] leading-none tracking-tight mt-1">
                    {doctor.count}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 border-t border-white/20">
                {/* Page Info */}
                <div className="text-white/70 text-sm">
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalItems)} of {totalItems} doctors
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Limit Selector */}
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <option value={5} className="bg-[#6a11cb]">5</option>
                    <option value={10} className="bg-[#6a11cb]">10</option>
                    <option value={20} className="bg-[#6a11cb]">20</option>
                    <option value={50} className="bg-[#6a11cb]">50</option>
                  </select>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg transition text-sm ${
                      currentPage === 1
                        ? 'bg-white/5 text-white/40 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    ← Prev
                  </button>

                  <span className="text-white font-medium text-sm px-2">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => 
                        
                        {
                            handlePageChange(currentPage + 1)}}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg transition text-sm ${
                      currentPage === totalPages
                        ? 'bg-white/5 text-white/40 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-white/70 font-medium text-base">
            {searchQuery ? `No doctors found matching "${searchQuery}"` : 'No doctors available'}
          </div>
        )}
      </main>

    </div>
  );
};

export default Polyclinicc;