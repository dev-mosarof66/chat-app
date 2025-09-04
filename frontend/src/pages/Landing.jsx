import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const Landing = () => {
  const {  userData } = useSelector(state => state.user)


  if (userData) {
    return null
  }
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Title */}
      <h1 className="text-3xl sm:text-5xl font-bold mb-4">
        Welcome to ChatApp
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Connect with friends and colleagues instantly. Start chatting now!
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Join Now
        </Link>
      </div>
    </div>
  )
}

export default Landing
