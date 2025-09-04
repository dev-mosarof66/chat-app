import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import Settings from './Settings'
import NewChat from './NewChat'

const ChatHeader = () => {
  const [newChat, setNewChat] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)

  return (
    <div className="w-full flex items-center justify-between">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold">Chats</h2>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div
          onClick={() => setNewChat(true)}
          className="p-2 rounded-full hover:bg-gray-600/50 cursor-pointer transition-all duration-300 delay-75 tooltip tooltip-bottom tooltip-primary"
        >
          <FaPlus className="text-lg" />
        </div>
        <div
          onClick={() => setSettingsModal(true)}
          className="p-2 rounded-full hover:bg-gray-600/50 cursor-pointer transition-all duration-300 delay-75 tooltip tooltip-bottom tooltip-primary"
        >
          <FaGear className="text-lg" />
        </div>
      </div>

      {/* New Chat Modal */}
      {newChat && (
        <NewChat setNewChat={setNewChat} />
      )}


      {/* Settings Sidebar */}
      {settingsModal && (
        <Settings setSettingsModal={setSettingsModal} />
      )}
    </div>
  )
}

export default ChatHeader
