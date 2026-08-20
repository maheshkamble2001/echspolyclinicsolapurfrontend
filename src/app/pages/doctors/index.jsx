import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorsList, doctorLogin } from '../../../api/doctors.js/doctor';
import { toast } from 'sonner';
// ✅ PaginationSection import
import { PaginationSection } from "components/shared/table/PaginationSection";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // ✅ New Error States for Inputs
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
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

  // Fetch Doctors from API with search, page and limit parameters
  useEffect(() => {
    fetchDoctors(debouncedSearch, currentPage, limit);
  }, [debouncedSearch, currentPage, limit]);

  const fetchDoctors = async (search = '', page = 1, itemsPerPage = 3) => {
    try {
      setLoading(true);
      setPaginationLoading(true);
      setError(null);

      const response = await getDoctorsList({
        search: search,
        page: page,
        limit: itemsPerPage
      });

      console.log('API Response:', response);

      if (response.code === 200 && response.data?.DoctorsData) {
        const formattedDoctors = response.data.DoctorsData.map((doc) => ({
          id: doc.id,
          name: doc.doctorname || `Dr ${doc.doctorid}`,
          role: doc.roomname || 'Medical Specialist',
          doctorid: doc.doctorid,
          addedon: doc.addedon
        }));
        setDoctors(formattedDoctors);

        const pagination = response.data.pagination || {};
        const totalRecords = pagination.totalRecords || 0;
        setTotalItems(totalRecords);

        const totalPagesCalc = Math.ceil(totalRecords / itemsPerPage);
        setTotalPages(totalPagesCalc);
      } else {
        setError(response.message || 'Failed to fetch doctors');
        setDoctors([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
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
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setLoginError('');
    setUsername('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setUsername('');
    setPassword('');
    setLoginError('');
    setLoginLoading(false);
    setEmailError('');
    setPasswordError('');
  };

  // ✅ Updated Submit Handler with Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset Errors
    setLoginError('');
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasError = false;
    if (!username.trim()) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }

    // Stop if validation fails
    if (hasError) return;

    setLoginLoading(true);

    try {
      const response = await doctorLogin({
        email: username,
        password: password
      });

      console.log('Login Response:', response);

      if (response.code === 200) {
        toast.success("Login Successfully!");
        handleCloseModal();
      } else {
        toast.error("Login Failed!");
        setLoginError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
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

  // ✅ Mobile Pagination Component
  const MobilePagination = () => {
    const pageNumbers = [];
    const maxVisible = 3;
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="inline-flex items-center justify-center gap-1 bg-[#ebf0f7] p-1.5 rounded-2xl shadow-md max-w-full overflow-x-auto">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* First Page */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-400 text-xs px-0.5">…</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentPage === num
                ? 'bg-[#a020f0] text-white shadow-md scale-105'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Last Page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-400 text-xs px-0.5">…</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex flex-col items-center justify-start pt-4 pb-8 px-2 sm:px-4 md:px-6 relative text-white font-sans overflow-x-hidden">

      {/* Back Button */}
      <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50">
        <Link
          to="/polyclinic"
          className="text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 z-10 w-full max-w-3xl px-2 sm:px-4 mt-12 sm:mt-16 md:mt-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 sm:mt-4 text-white tracking-tight leading-tight drop-shadow-lg">
          {import.meta.env.VITE_TITLE2}
        </h1>

        {/* Search Input */}
        <div className="relative mt-3 sm:mt-4 md:mt-6 max-w-sm sm:max-w-md md:max-w-lg mx-auto px-2 sm:px-0">
          <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name or room..."
            className="w-full pl-7 sm:pl-10 pr-7 sm:pr-10 py-2 sm:py-2.5 md:py-3 bg-white text-gray-800 rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:border-transparent focus:outline-none placeholder-gray-400 transition-all shadow-lg text-xs sm:text-sm border border-gray-200"
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
              <div className="w-4 h-4 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative w-full max-w-7xl px-4 sm:px-8 md:px-12 z-10 mt-1 sm:mt-2 md:mt-4">

        {/* Cards Wrapper */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth py-3 sm:py-4 md:py-6 px-2 sm:px-4 no-scrollbar snap-x snap-mandatory min-h-[220px] sm:min-h-[250px] md:min-h-[280px] bg-[#4a1a8a]/40 backdrop-blur-sm rounded-2xl border border-white/10 items-center justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-white/80 text-sm font-medium">Loading doctors...</p>
            </div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-none snap-start w-full md:w-[calc(33.33%-10px)] lg:w-[calc(33.33%-12px)] bg-white rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between space-y-3 md:space-y-4 shadow-2xl hover:shadow-[#dc2626]/20 transition-all duration-300 hover:-translate-y-2 group border border-gray-100 min-h-[220px] sm:min-h-[250px] md:min-h-[280px]"
              >
                {/* Doctor Name - Top & Center */}
                <div className="text-center w-full">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-1xl font-extrabold text-[#6a11cb] group-hover:text-[#2575fc] transition-colors tracking-wide break-words leading-tight">
                    {doctor.name}
                  </h2>
                  
                  {/* Room Name */}
                  {doctor.role && doctor.role !== 'Medical Specialist' && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#6a11cb]/60 mt-1.5">
                      ({doctor.role})
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleOpenModal(doctor)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 md:px-6 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 active:scale-95"
                >
                  Doctor Login
                </button>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="w-full flex flex-col items-center justify-center py-10 px-4 text-center">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow mb-1.5">
                {searchQuery ? 'No Matching Doctors' : 'No Doctors Available'}
              </h3>
              
              <p className="text-xs sm:text-sm text-white/70 max-w-sm font-normal leading-relaxed mb-5">
                {searchQuery ? (
                  <>
                    We couldn't find any doctor matching <span className="font-semibold text-white underline decoration-red-400 decoration-2 underline-offset-2">"{searchQuery}"</span>. Please check the spelling or clear the filter.
                  </>
                ) : (
                  'There are currently no doctors listed in the system. Please check back again later.'
                )}
              </p>

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

        {/* PAGINATION SECTION */}
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

      {/* Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
          {/* Modal Background changed to White */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-md p-6 sm:p-8 relative mx-2 sm:mx-0 border border-gray-200 text-gray-800">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg sm:text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Doctor Login</h3>
              <p className="text-sm sm:text-base text-[#6a11cb] font-semibold mt-2">
                {selectedDoctor?.name}
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs sm:text-sm text-center font-medium">
                {loginError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ✅ Email Input with Error */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                  Email / ID
                </label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setEmailError(''); // Clear error on typing
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 !bg-white text-gray-800 border rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:border-transparent focus:outline-none placeholder-gray-400 transition-all shadow-sm text-sm sm:text-base ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {/* ✅ Red Error Text Below Email */}
                {emailError && (
                  <p className="text-red-600 text-xs sm:text-sm font-medium mt-1.5 ml-1">
                    {emailError}
                  </p>
                )}
              </div>

              {/* ✅ Password Input with Error */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(''); // Clear error on typing
                  }}
                  placeholder="Enter Password"
                  className={`w-full px-4 py-3 !bg-white text-gray-800 border rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:border-transparent focus:outline-none placeholder-gray-400 transition-all shadow-sm text-sm sm:text-base ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {/* ✅ Red Error Text Below Password */}
                {passwordError && (
                  <p className="text-red-600 text-xs sm:text-sm font-medium mt-1.5 ml-1">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all text-sm sm:text-base border border-gray-300 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hide scrollbar & Autofill fix styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #1f2937 !important;
        }
      `}</style>
    </div>
  );
};

export default DoctorsPage;