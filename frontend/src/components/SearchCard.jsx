import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import moment from 'moment'

const SearchCard = ({ user, onclick }) => {
    const navigate = useNavigate()
    const [mobileScreen, setMobileScreen] = useState(false)

    const lastMessage =
        user.chatHistory.length > 0
            ? user.chatHistory[user.chatHistory.length - 1].message
            : 'No messages yet.'

    useEffect(() => {
        const handleResize = () => {
            setMobileScreen(window.innerWidth < 768)
        }
        handleResize() // set initial state
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleClick = () => {
        mobileScreen
            ? navigate(`/chat/${user._id}`)
            : navigate(`/${user._id}`)

        onclick()
    }

    return (
        <div
            onClick={() => handleClick()}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition"
        >
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-400 truncate w-40">{lastMessage}</p>
                </div>
            </div>

            {/* Right: Active dot OR last active */}
            <div className="flex flex-col items-end">
                {user.isActive ? (
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                ) : (
                    <p className="text-xs text-gray-500">{user.lastActive && moment(user.lastActive)}</p>
                )}
            </div>
        </div>
    )
}

export default SearchCard