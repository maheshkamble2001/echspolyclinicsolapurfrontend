import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorwiseTokens } from '../../../api/polyclinic.js/polyclinicc';
// ✅ PaginationSection import
import { PaginationSection } from "components/shared/table/PaginationSection";

const Polyclinic = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const scrollRef = useRef(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(3);
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
    setLimit(isMobile ? 1 : 3);
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

  const fetchTokens = async (search = '', page = 1, itemsPerPage = 3) => {
    try {
      setLoading(true);
      setPaginationLoading(true);
      setError(null);
      
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
        
        const pagination = response.data.pagination || {};
        setTotalItems(pagination.totalRecords || 0);
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

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  // ✅ Create a dummy table object for PaginationSection compatibility
  const dummyTable = {
    getState: () => ({
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: limit,
      }
    }),
    setPageIndex: (index) => handlePageChange(index + 1),
    setPageSize: (size) => handleLimitChange(size),
    getPageCount: () => totalPages,
    getCanPreviousPage: () => currentPage > 1,
    getCanNextPage: () => currentPage < totalPages,
    previousPage: () => handlePageChange(currentPage - 1),
    nextPage: () => handlePageChange(currentPage + 1),
  };

  // ✅ Custom Mobile Pagination
  const MobilePagination = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="inline-flex items-center justify-center gap-1 bg-[#ebf0f7] p-1.5 rounded-2xl shadow-md">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-400 text-sm px-1">…</span>
            )}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
              currentPage === num
                ? 'bg-[#a020f0] text-white shadow-md scale-105'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {num}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-400 text-sm px-1">…</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

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
        
        {/* Search Input Filter */}
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
          {searchQuery !== debouncedSearch && (
            <div className="absolute right-8 sm:right-10 top-2.5 sm:top-3">
              <div className="w-4 h-4 border-2 border-[#6a11cb] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative w-full max-w-7xl px-4 sm:px-8 md:px-12 z-10 mt-1 sm:mt-2 md:mt-4">
        
        {/* Cards Wrapper */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth py-3 sm:py-4 md:py-6 px-2 sm:px-4 no-scrollbar snap-x snap-mandatory min-h-[220px] sm:min-h-[250px] md:min-h-[280px] bg-gradient-to-r from-[#4a1a8a]/40 to-[#1a4a8a]/40 backdrop-blur-sm rounded-2xl border border-white/10 items-center justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-white/80 text-sm font-medium">Loading tokens...</p>
            </div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-none snap-start w-full md:w-[calc(33.33%-10px)] lg:w-[calc(33.33%-12px)] bg-white rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between space-y-3 md:space-y-4 shadow-2xl hover:shadow-[#6a11cb]/20 transition-all duration-300 hover:-translate-y-2 group border border-gray-100 min-h-[220px] sm:min-h-[250px] md:min-h-[280px]"
              >
                {/* Doctor Name - Top & Center */}
                <div className="text-center w-full">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#6a11cb] group-hover:text-[#2575fc] transition-colors tracking-wide break-words leading-tight">
                    {doctor.name}
                  </h2>
                  
                  {/* Room Name - In Brackets */}
                  {doctor.roomname && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#6a11cb]/60 mt-1.5">
                      ({doctor.roomname})
                    </p>
                  )}
                </div>

                {/* Patient / Token Count - Center */}
                <div className="py-2 sm:py-2.5 md:py-3 px-4 md:px-6 bg-gradient-to-r from-[#6a11cb]/5 to-[#2575fc]/5 rounded-xl border border-gray-100 w-full flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#dc2626] tracking-wider drop-shadow-sm">
                    {doctor.count}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Total Patients
                  </span>
                </div>
              </div>
            ))
          ) : (
            /* ✨ ATTRACTIVE NO TOKENS FOUND / EMPTY STATE ✨ */
            <div className="w-full flex flex-col items-center justify-center py-10 px-4 text-center">
              
              {/* Animated Icon Container */}
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute inset-0 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-white/20 to-white/5 border border-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 drop-shadow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title & Message */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow mb-1.5">
                {searchQuery ? 'No Matching Tokens' : 'No Tokens Available'}
              </h3>
              
              <p className="text-xs sm:text-sm text-white/70 max-w-sm font-normal leading-relaxed mb-5">
                {searchQuery ? (
                  <>
                    We couldn't find any token matching <span className="font-semibold text-white underline decoration-purple-400 decoration-2 underline-offset-2">"{searchQuery}"</span>. Please double-check your query.
                  </>
                ) : (
                  'There are currently no active tokens in the queue. Please check back again later.'
                )}
              </p>

              {/* Clear Search Button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Search Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* ✅ PAGINATION */}
        {!loading && doctors.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-center w-full">
              {isMobile ? (
                <MobilePagination />
              ) : (
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-full">
                  <PaginationSection
                    table={dummyTable}
                    totalCount={totalItems}
                    limit={limit}
                    activePage={currentPage}
                    setLimit={handleLimitChange}
                    setActivePage={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for hiding scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Polyclinic;