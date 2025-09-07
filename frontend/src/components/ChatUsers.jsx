import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import axiosInstance from '../lib/axios'
import { setSelectedChat } from '../features/user'

const ChatUsers = () => {
  const { userData } = useSelector(state => state.user)
  // const { chatId } = useSelector(state => state.chat)04


  return (
    <div className="w-full flex flex-col gap-4 h-full overflow-y-scroll no-scrollbar">
      {
        userData?.friends?.length > 0 ?
          userData.friends.map((user, index) => {
            return (
              <UserCard key={index} user={user} />
            )
          }) :
          <p className='text-center py-10 text-gray-400'>No friends found</p>
      }
    </div>
  )
}

const UserCard = ({ user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [mobileScreen, setMobileScreen] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const { selectedChat } = useSelector(state => state.user)

  useEffect(() => {
    const handleResize = () => {

      if (window.innerWidth < 768) {
        setMobileScreen(true)
      }

      if (window.innerWidth > 768) {
        setMobileScreen(false)
      }
    }
    handleResize() // set initial state
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  //fetch the last message

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const res = await axiosInstance.get(`/chats/last-message/${user._id}`)
        if (res.data.data)
          setLastMessage(res?.data.data)
        else
          setLastMessage(null)
      } catch (error) {
        console.log('error while fetching the last message : ', error)
      }
    }
    fetchLastMessage()
  }, [user])


  const handleClick = () => {
    mobileScreen
      ? navigate(`/chat/${user._id}`)
      : navigate(`/${user._id}`);
    dispatch(setSelectedChat(user._id))
  }
  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-2 rounded-lg ${selectedChat === user._id ? 'bg-gray-500/50' : 'hover:bg-gray-800 '} cursor-pointer transition`}
    >
      {/* Left: Avatar + Info */}
      <div className="w-full flex items-center gap-3">
        <div className='relative '>
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="absolute bottom-0 right-0">
            {user.active && (
              <div className="w-3 h-3 rounded-full bg-green-500" />
            )}
          </div>
        </div>
        <div className="w-full flex flex-col">
          <h3 className="font-semibold">{user.name}</h3>
          <div className='w-full flex items-center justify-between'>
            <p className="text-sm text-gray-400 truncate w-40">{lastMessage && lastMessage ? lastMessage?.message?.length > 25 ? lastMessage.message.slice(0, 25) + '...' : lastMessage.message : 'No Messages Yet.'}</p><p className="text-xs text-gray-500">{lastMessage ? moment(lastMessage.createdAt).format(" h:mm a") : ""}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatUsers
