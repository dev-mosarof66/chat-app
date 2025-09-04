import React from 'react'
import ChatHeader from './ChatHeader'
import ChatSearch from './ChatSearch'
import ChatUsers from './ChatUsers'

const Sidebar = () => {
  return (
    <div className='w-full h-screen flex flex-col gap-4 p-6 sm:p-4 border-r border-r-gray-400'>
      <ChatHeader />
      <ChatSearch />
      <ChatUsers />
    </div>
  )
}

export default Sidebar