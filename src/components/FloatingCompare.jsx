const FloatingCompare = () => {
  return (
    <>
      {/* Compare Button */}
      <button
        onClick={() => alert('Select doctors to compare')}
        className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition flex items-center gap-2 z-40 group"
        title="Compare Doctors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="hidden group-hover:inline-block text-sm font-medium animate-fadeIn">
          Compare
        </span>
      </button>

      {/* Chat Support */}
      <button
        onClick={() => alert('Opening chat support...')}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition flex items-center gap-2 z-40 group"
        title="Chat Support"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden group-hover:inline-block text-sm font-medium animate-fadeIn">
          Help
        </span>
      </button>
    </>
  );
};

export default FloatingCompare;