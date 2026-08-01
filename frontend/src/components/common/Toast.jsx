export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#2d1e1e] text-white px-6 py-3 rounded-xl shadow-xl animate-bounce">
      {message}
    </div>
  );
}