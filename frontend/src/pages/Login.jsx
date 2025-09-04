import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../utils/user/user'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const { loginLoading, isLoginSuccess } = useSelector((state) => state.user)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }

    dispatch(loginUser({ email, password }))

  }


  useEffect(() => {
    if (isLoginSuccess) {
      setEmail('')
      setPassword('')
      navigate('/')
    }
  }, [isLoginSuccess, navigate])

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
      <div className="w-[90%] max-w-md bg-gray-800 p-6 rounded-xl shadow-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-1 text-gray-300">
              Email
            </label>
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
            <label htmlFor="password" className="text-sm mb-1 text-gray-300">
              Password
            </label>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {loginLoading ? <span className="loading loading-spinner loading-sm"></span>
              : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
