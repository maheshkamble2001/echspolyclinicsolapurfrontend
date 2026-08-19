import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorsList, doctorLogin } from '../../../api/doctors.js/doctor';
import { toast } from 'sonner';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
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

  // Fetch Doctors from API with search, page and limit parameters
  useEffect(() => {
    fetchDoctors(debouncedSearch, currentPage, limit);
  }, [debouncedSearch, currentPage, limit]);

  const fetchDoctors = async (search = '', page = 1, itemsPerPage = 4) => {
    try {
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
        
        // Set pagination data from API response
        const pagination = response.data.pagination || {};
        const totalRecords = pagination.totalRecords || 0;
        setTotalItems(totalRecords);
        
        // Calculate total pages based on totalRecords and limit
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

  // Handle scroll with pagination integration
  const handleScrollWithPagination = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      
      // Calculate new scroll position
      let newScrollLeft;
      if (direction === 'left') {
        newScrollLeft = scrollLeft - scrollAmount;
      } else {
        newScrollLeft = scrollLeft + scrollAmount;
      }
      
      // Check if we're at the end of scroll
      const isAtStart = scrollLeft <= 0;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      
      // If scrolling right and at end, go to next page
      if (direction === 'right' && isAtEnd && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
        // Reset scroll to start after page change
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }, 100);
      } 
      // If scrolling left and at start, go to previous page
      else if (direction === 'left' && isAtStart && currentPage > 1) {
        handlePageChange(currentPage - 1);
        // Scroll to end after page change
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
          }
        }, 100);
      } 
      // Normal scroll within current page
      else {
        scrollRef.current.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setLoginError('');
    setUsername('');
    setPassword('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setUsername('');
    setPassword('');
    setLoginError('');
    setLoginLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await doctorLogin({
        email: username,
        password: password
      });

      console.log('Login Response:', response);

      if (response.code == 200) {
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading doctors...</p>
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
            onClick={() => fetchDoctors(debouncedSearch, currentPage, limit)}
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
      
      {/* Simple Back Button - Top Left */}
      <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50">
        <Link 
          to="/polyclinic" 
          className="text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 z-10 w-full max-w-3xl px-2 sm:px-4 mt-12 sm:mt-16 md:mt-20">
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 sm:mt-4 text-white tracking-tight leading-tight drop-shadow-lg">
          {import.meta.env.VITE_TITLE2}
        </h1>
      
        {/* Search Input - White Background */}
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
          {/* Loading indicator for search */}
          {searchQuery !== debouncedSearch && (
            <div className="absolute right-8 sm:right-10 top-2.5 sm:top-3">
              <div className="w-4 h-4 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Doctor Count */}
        <p className="text-white/50 text-xs mt-2">
          Total Doctors: {totalItems}
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative w-full max-w-7xl px-4 sm:px-8 md:px-12 z-10 mt-1 sm:mt-2 md:mt-4">
        
        {/* Left Arrow - Hide on mobile */}
        {!isMobile && doctors.length > 0 && (
          <button
            onClick={() => handleScrollWithPagination('left')}
            className="absolute left-0 sm:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 text-white p-1.5 sm:p-2 md:p-3 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow - Hide on mobile */}
        {!isMobile && doctors.length > 0 && (
          <button
            onClick={() => handleScrollWithPagination('right')}
            className="absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/40 text-white p-1.5 sm:p-2 md:p-3 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Cards Wrapper - White Background */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth py-3 sm:py-4 md:py-6 px-2 sm:px-4 no-scrollbar snap-x snap-mandatory min-h-[180px] sm:min-h-[200px] md:min-h-[240px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-none snap-start w-full md:w-[calc(50%-6px)] lg:w-[calc(25%-12px)] bg-white rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col items-center justify-between space-y-3 md:space-y-5 shadow-2xl hover:shadow-[#dc2626]/20 transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
              >
                {/* Profile Logo - Red Background */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-red-600 flex items-center justify-center text-base sm:text-lg md:text-xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {doctor.name.replace('Dr ', '').charAt(0) || 'D'}
                </div>

                <div className="text-center space-y-1 w-full">
                  <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#6a11cb] group-hover:text-[#2575fc] transition-colors truncate">
                    {doctor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                    {doctor.role}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    ID: {doctor.doctorid}
                  </p>
                </div>

                {/* Button - Red Background */}
                <button
                  onClick={() => handleOpenModal(doctor)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3 md:px-4 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 active:scale-95"
                >
                  Doctor Login
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
              <p className="text-white/80 font-medium text-lg mb-2">
                {searchQuery ? `No doctor found for "${searchQuery}"` : 'No doctors available'}
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
                  `${((currentPage - 1) * limit) + 1} - ${Math.min(currentPage * limit, totalItems)} of ${totalItems} doctors`
                ) : (
                  'No doctors found'
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
                onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Login Modal - Same styling with red accent */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-md p-5 sm:p-6 md:p-8 relative mx-2 sm:mx-0">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg sm:text-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ✕
            </button>

            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#dc2626]">Doctor Login</h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                {selectedDoctor?.name}
              </p>
              <p className="text-[10px] text-gray-400">
                ID: {selectedDoctor?.doctorid}
              </p>
            </div>

            {/* Login Error Message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium mb-1 sm:mb-1.5">
                  Email / ID
                </label>
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:border-transparent focus:outline-none placeholder-gray-400 transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium mb-1 sm:mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:border-transparent focus:outline-none placeholder-gray-400 transition-all text-sm sm:text-base"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add CSS for hiding scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DoctorsPage;