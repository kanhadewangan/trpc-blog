"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "../_trpc/client";

export default function Navigation() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Get user data if logged in
  const { data: userData } = trpc.getuser.useQuery(
    { id: userId ? Number(userId) : 0 },
    { enabled: !!userId }
  );

  useEffect(() => {
    // Check localStorage for userId
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  useEffect(() => {
    // Set username when user data is available
    if (userData && Array.isArray(userData) && userData.length > 0) {
      setUserName(userData[0].name);
    }
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setUserName(null);
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BlogHub
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/blogs" className="text-gray-600 hover:text-blue-600 transition-colors">Blogs</Link>
              {userId && (
                <>
                  <Link href="/addblog" className="text-gray-600 hover:text-blue-600 transition-colors">Write</Link>
                  <Link href="/users" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {userId ? (
              // Logged in state
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {userName || `User #${userId}`}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in state
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
