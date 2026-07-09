export const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center px-6">
      <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-red-600 font-semibold mb-2 font-['Space_Grotesk',ui-sans-serif,sans-serif]">
          Something went wrong
        </h2>
        <p className="text-red-900/70">{message}</p>
      </div>
    </div>
  );
};
