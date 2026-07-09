export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
      <div className="flex items-center gap-3 text-[#6B7280]">
        <span className="relative flex h-2 w-2">
          <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#0F8C7C]" />
        </span>
        <p className="text-lg font-['Space_Grotesk',ui-sans-serif,sans-serif]">
          Loading employees…
        </p>
      </div>
      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
