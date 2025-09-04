/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'motion/react'
import { FaTimes, FaUser } from 'react-icons/fa'
import { FaShield } from "react-icons/fa6";
import { IoNotifications, IoLogOut } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import { useSelector } from 'react-redux'
import { useState } from 'react';
import NotificationModal from './NotificationModal';
import Help_SupportModal from './Help_SupportModal';
import ProfileModal from '../components/ProfileModal'
import PrivacyModal from './PrivacyModal';
import LogoutModal from './LogoutModal';

const settingsitems = [
    {
        id: 1,
        name: 'Profile',
        icon: () => <FaUser size={20} />
    },
    {
        id: 2,
        name: 'Notifications',
        icon: () => <IoNotifications size={20} />
    },
    {
        id: 3,
        name: 'Privacy',
        icon: () => <FaShield size={18} />
    },
    {
        id: 4,
        name: 'Help & Support',
        icon: () => <IoMdHelpCircle size={20} />
    },
    {
        id: 5,
        name: 'Logout',
        icon: () => <IoLogOut size={20} />
    },
]

const Settings = ({ setSettingsModal }) => {
    const { userData } = useSelector((state) => state.user)
    const [profileModal, setProfileModal] = useState(false)
    const [notificationModal, setNotificationModal] = useState(false)
    const [privaceyModal, setPrivacyModal] = useState(false)
    const [help_SupportModal, setHelp_SupportModal] = useState(false)
    const [logoutModal, setLogoutModal] = useState(false)

    const handleClick = (id) => {
        if (id === 1) {
            setProfileModal(true)
        }
        else if (id === 2) {
            setNotificationModal(true)
        }
        else if (id === 3) {
            setPrivacyModal(true)
        }
        else if (id === 4) {
            setHelp_SupportModal(true)
        }
        else if (id === 5) {
            setLogoutModal(true)
        }
        console.log("handle clicked", id)
    }
    return (
        <div

            className="w-full h-screen fixed top-0 left-0 z-50 backdrop-blur-sm "
        >
            <AnimatePresence>
                <motion.div initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }} className='w-64 xl:w-96 h-screen bg-gray-900 shadow-lg z-40 flex flex-col text-gray-200'>
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-700">
                        <h2 className="text-lg font-semibold">Settings</h2>
                        <div
                            className="p-1 hover:bg-gray-600/50 rounded-full cursor-pointer"
                            onClick={() => setSettingsModal(false)}
                        >
                            <FaTimes className="text-xl" />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="w-full h-full flex flex-col justify-between p-4">
                        {/* Top Items */}
                        <div className="space-y-2">
                            {settingsitems.slice(0, 3).map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                                >
                                    {
                                        item.id === 1 ?
                                            <div className='w-6 h-6 rounded-full overflow-hidden border border-purple-600 flex items-center justify-center'>
                                                {
                                                    userData?.avatar ?
                                                        <div>
                                                            <img src={userData?.avatar} alt='profile' />
                                                        </div>
                                                        :
                                                        <div>

                                                            <FaUser  />
                                                        </div>
                                                }
                                            </div>
                                            :
                                            <div>
                                                {item.icon()}
                                            </div>
                                    }
                                    <p className="text-sm font-medium">{item.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Items */}
                        <div className="space-y-2">
                            {settingsitems.slice(3, 5).map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer hover:bg-gray-700 ${item.id === 5 ? "border border-red-600 hover:bg-red-500 " : ""} active:scale-[0.95] transition-all duration-300 delay-75`}
                                >
                                    {item.icon()}
                                    <p className="text-sm font-medium">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence >
            {
                profileModal && <ProfileModal onclick={setProfileModal} />
            }
            {
                notificationModal && <NotificationModal onclick={setNotificationModal} />
            }
            {
                privaceyModal && <PrivacyModal onclick={setPrivacyModal} />
            }
            {
                help_SupportModal && <Help_SupportModal onclick={setHelp_SupportModal} />
            }
            {
                logoutModal && <LogoutModal onclick={setLogoutModal} />
            }
        </div>
    )
}

export default Settings
