import React, { useEffect } from 'react'
import ChatInterface from '../components/ChatInterface'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'

const Chat = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  // console.log(id)


  useEffect(() => {
    // dispatch(createNewChat({ friendId: id }))

  }, [id, dispatch])
  return (
    <div className='w-full h-screen'>
      <ChatInterface id={id} />
    </div>
  )
}

export default Chat