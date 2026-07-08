export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center">
      <div className="flex items-center gap-3 text-[#8891A4]">
        <span className="relative flex h-2 w-2">
          <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#4FD8C4]" />
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
