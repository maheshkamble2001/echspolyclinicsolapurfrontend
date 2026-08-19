import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorwiseTokens } from '../../../api/polyclinic.js/polyclinicc';

const Polyclinic = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const scrollRef = useRef(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4); // Default 4 for desktop
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // Check if mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set limit based on mobile/desktop
  useEffect(() => {
    setLimit(isMobile ? 1 : 4);
    setCurrentPage(1);
  }, [isMobile]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Tokens from API with search, page and limit parameters
  useEffect(() => {
    fetchTokens(debouncedSearch, currentPage, limit);
  }, [debouncedSearch, currentPage, limit]);

  const fetchTokens = async (search = '', page = 1, itemsPerPage = 4) => {
    try {
      setPaginationLoading(true);
      setError(null);
      
      // Pass all parameters to API
      const response = await getDoctorwiseTokens({
        search: search,
        page: page,
        limit: limit
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
        const pagination = response.data.pagination || {};
        setTotalItems(pagination.totalRecords || 0);
        // Calculate total pages based on totalRecords and limit
        const totalPagesCalc = Math.ceil((pagination.totalRecords || 0) / itemsPerPage);
        setTotalPages(totalPagesCalc);
      } else {
        setError(response.message || 'Failed to fetch tokens');
        setDoctors([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to load tokens. Please try again.');
      setDoctors([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading tokens...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-300 text-lg mb-2">⚠️ {error}</p>
          <button 
            onClick={() => fetchTokens(debouncedSearch, currentPage, limit)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex flex-col items-center justify-start pt-4 pb-8 px-2 sm:px-4 md:px-6 relative text-white font-sans overflow-x-hidden">
      
      {/* Simple Login Button - Top Right */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <Link 
          to="/doctors" 
          className="text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-colors"
        >
          Login →
        </Link>
      </div>

      {/* Background Lighting & Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[150px] sm:w-[200px] md:w-[300px] h-[150px] sm:h-[200px] md:h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header Section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 z-10 w-full max-w-5xl px-2 sm:px-4 mt-12 sm:mt-16 md:mt-20">
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mt-3 sm:mt-4 text-white tracking-tight leading-tight break-words px-2 drop-shadow-lg">
          {import.meta.env.VITE_TITLE || ''}
        </h1>
        
        {/* Search Input Filter - White Background with Dark Text */}
        <div className="relative mt-3 sm:mt-4 md:mt-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-2 sm:px-0">
          <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by token number..."
            className="w-full pl-7 sm:pl-10 pr-7 sm:pr-10 py-2 sm:py-2.5 md:py-3 bg-white text-gray-800 rounded-xl focus:ring-2 focus:ring-[#6a11cb] focus:border-transparent focus:outline-none placeholder-gray-400 transition-all shadow-lg text-xs sm:text-sm border border-gray-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs sm:text-sm"
            >
              ✕
            </button>
          )}
          {/* Loading indicator for search */}
          {searchQuery !== debouncedSearch && (
            <div className="absolute right-8 sm:right-10 top-2.5 sm:top-3">
              <div className="w-4 h-4 border-2 border-[#6a11cb] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Total Tokens Count */}
        <p className="text-white/50 text-xs mt-2">
          Total Tokens: {totalItems}
        </p>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative w-full max-w-7xl px-4 sm:px-8 md:px-12 z-10 mt-1 sm:mt-2 md:mt-4">
        
        {/* Left Arrow Button - Hide on mobile */}
        {!isMobile && doctors.length > 0 && (
          <button
            onClick={() => {
              handlePageChange(currentPage - 1)
              handleScroll('left')}}
            className="absolute left-0 sm:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 text-white p-1.5 sm:p-2 md:p-3.5 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
            aria-label="Scroll Left"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow Button - Hide on mobile */}
        {!isMobile && doctors.length > 0 && (
          <button
            onClick={() => {
              handlePageChange(currentPage + 1)
              handleScroll('right')}}
            className="absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 text-white p-1.5 sm:p-2 md:p-3.5 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
            aria-label="Scroll Right"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Cards Wrapper - White Background with Dark Text */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth py-3 sm:py-4 md:py-6 px-2 sm:px-4 no-scrollbar snap-x snap-mandatory min-h-[180px] sm:min-h-[210px] md:min-h-[260px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-none snap-start w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] bg-white rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col items-center justify-between shadow-2xl hover:shadow-[#6a11cb]/20 transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
              >
                {/* Header Info */}
                <div className="text-center space-y-1 w-full">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#6a11cb] group-hover:text-[#2575fc] transition-colors tracking-wide truncate w-full">
                    {doctor.name}
                    {doctor.roomname && (
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#6a11cb]/70 ml-1">
                        ({doctor.roomname})
                      </span>
                    )}
                  </h2>
                </div>

                {/* Patient / Token Count */}
                <div className="my-2 sm:my-3 md:my-4 py-2 sm:py-2.5 md:py-3 px-4 md:px-6 bg-gradient-to-r from-[#6a11cb]/5 to-[#2575fc]/5 rounded-xl border border-gray-100 w-full flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#dc2626] tracking-wider drop-shadow-sm">
                    {doctor.count}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
              <p className="text-white/80 font-medium text-lg mb-2">
                {searchQuery ? `No tokens found for "${searchQuery}"` : 'No tokens available'}
              </p>
              <p className="text-white/50 text-sm">
                {searchQuery ? 'Try adjusting your search term' : 'Check back later for updates'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 sm:mt-6 pt-4 border-t border-white/20">
            {/* Page Info */}
            <div className="text-white/70 text-xs sm:text-sm">
              {paginationLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </span>
              ) : (
                totalItems > 0 ? (
                  `${((currentPage - 1) * limit) + 1} - ${Math.min(currentPage * limit, totalItems)} of ${totalItems} tokens`
                ) : (
                  'No tokens found'
                )
              )}
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || paginationLoading}
                className={`px-3 py-1.5 rounded-lg transition text-xs sm:text-sm ${
                  currentPage === 1 || paginationLoading
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                ← Prev
              </button>

              <span className="text-white font-medium text-xs sm:text-sm px-2">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => {
                  console.log("hi")
                  handlePageChange(currentPage + 1)}}
                disabled={currentPage === totalPages || paginationLoading}
                className={`px-3 py-1.5 rounded-lg transition text-xs sm:text-sm ${
                  currentPage === totalPages || paginationLoading
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for hiding scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Polyclinic;