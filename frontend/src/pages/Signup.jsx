import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { createUser } from '../utils/user/user'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { signupLoading, isSignupSuccess } = useSelector(state => state.user);
  console.log(isSignupSuccess)


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!")
      return
    }


    dispatch(createUser({ name, email, password, confirmPassword }))
  }


  useEffect(() => {
  if (isSignupSuccess) {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    navigate('/login')
  }
}, [isSignupSuccess, navigate])

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
      <div className="w-[90%] max-w-md bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm mb-1 text-gray-300">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-1 text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-sm mb-1 text-gray-300">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            <label htmlFor="confirmPassword" className="text-sm mb-1 text-gray-300">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={signupLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center disabled:opacity-50 cursor-pointer transition-all duration-300 delay-75"
          >
            {signupLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
