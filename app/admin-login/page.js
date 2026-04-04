"use client";

export default function AdminLogin() {
  const login = () => {
    document.cookie = "admin=true";
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0F172A]">
      <button
        onClick={login}
        className="bg-white text-black px-6 py-3 rounded"
      >
        Login as Admin
      </button>
    </div>
  );
}