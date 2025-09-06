import ChatInterface from '../components/ChatInterface'
import { useParams } from 'react-router'

const Chat = () => {
  const { id } = useParams()


  return (
    <div className='w-full h-screen'>
      <ChatInterface friendId={id} />
    </div>
  )
}

export default Chat