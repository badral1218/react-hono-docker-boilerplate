export const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center px-6">
      <div className="max-w-md rounded-xl border border-red-900/50 bg-red-950/20 p-6">
        <h2 className="text-red-400 font-semibold mb-2 font-['Space_Grotesk',ui-sans-serif,sans-serif]">
          Something went wrong
        </h2>
        <p className="text-[#c9b3b3]">{message}</p>
      </div>
    </div>
  );
};
