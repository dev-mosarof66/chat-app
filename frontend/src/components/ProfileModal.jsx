import React, { useEffect, useState } from 'react'
import { FaTimes, FaEdit, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateProfile } from '../utils/user/user';
import { useNavigate } from 'react-router';

const ProfileModal = ({ onclick }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData, updateUserLoading, isUpdateUserSuccess,isDeleteUserSuccess,deleteUserLoading } = useSelector((state) => state.user)
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || null);
  const [avatar, setAvatar] = useState(null)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
    setAvatar(file)
  };

  console.log(avatar)

  const handleSaveProfile = async () => {
    console.log('insdie the handle save profile handler');
    dispatch(updateProfile({ avatar }))

  }
  const handleDeleteProfile = async()=>{
    dispatch(deleteUser())
  }

  useEffect(() => {
    if (isUpdateUserSuccess) {
      onclick(false)
    }
    if (isDeleteUserSuccess) {
      onclick(false)
      navigate('/')
    }
  }, [isUpdateUserSuccess, onclick,isDeleteUserSuccess,navigate])

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-xl shadow-lg w-96 p-5 border border-purple-600 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
          <h2 className="text-lg font-semibold">Profile</h2>
          <button
            onClick={() => onclick(false)}
            className="p-1 text-lg sm:text-xl hover:bg-gray-700 rounded-full cursor-pointer transition-all duration-300 delay-75"
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-4">
          <div className=' relative'>
            <div className=" w-24 h-24 flex items-center justify-center rounded-full border-2 border-purple-600 overflow-hidden">
              {
                avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser size={45} />
                )
              }
            </div>
            <label className="absolute bottom-0 right-0 z-50 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition duration-300 delay-75">
              <input
                type='file'
                className='opacity-0 absolute inset-0 w-full h-full '
                onChange={handleAvatarChange}
              />
              <FaEdit className="text-sm relative z-50" />
            </label>
          </div>
          <p className="mt-2 text-lg font-medium">{userData?.name}</p>
          <p className="text-gray-400 text-sm">{userData?.email}</p>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <button onClick={handleDeleteProfile} className="w-full bg-red-500 hover:bg-red-700 px-4 py-2 rounded-sm cursor-pointer transition duration-300 delay-75 font-medium">
            {
              deleteUserLoading ? <span className="loading loading-spinner loading-xs"></span>
                : "Delete Profile"
            }
          </button>
          <button onClick={handleSaveProfile} className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-sm cursor-pointer transition duration-300 delay-75 font-medium">
            {
              updateUserLoading ? <span className="loading loading-spinner loading-xs"></span>
                : "Save Profile"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
