/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import SearchCard from './SearchCard'

const NewChat = ({ setNewChat }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState([])
    const { allUser } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)

    const handleSearch = (e) => {
        const value = e.target.value
        setSearchTerm(value)

        if (value.trim() === '') {
            setResults([])
            return
        }

        setLoading(true)

        // simulate async search
        setTimeout(() => {
            const filtered = allUser.filter((user) =>
                user.name.toLowerCase().includes(value.toLowerCase())
            )
            setResults(filtered)
            setLoading(false)
        }, 300) // 300ms delay
    }

    const clearSearch = () => {
        setSearchTerm('')
        setResults([])
        setLoading(false)
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-screen fixed top-0 left-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-[90%] max-w-md h-72 mx-auto flex flex-col gap-4 bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                    {/* Header */}
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold">New Chat</h2>
                        <div
                            className="p-1 hover:bg-gray-500/50 active:bg-gray-500/50 active:scale-[0.95] rounded-full cursor-pointer transition-all duration-300 delay-75"
                            onClick={() => setNewChat(false)}
                        >
                            <FaTimes className="text-xl" />
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="w-full py-2 relative">
                        <input
                            type="text"
                            spellCheck={false}
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder="Search by person name"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {/* Search Results */}
                    <div className="w-full flex flex-col gap-2 h-full overflow-y-auto">
                        {loading ? (
                            [...Array(5)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-48 w-full bg-gray-700/40 rounded-lg animate-pulse"
                                />
                            ))
                        ) : results.length > 0 ? (
                            results.map((user) => (
                                <SearchCard key={user._id} user={user} onclick={()=>setNewChat(false)} />
                            ))
                        ) : searchTerm ? (
                            <p className="text-gray-400 text-center py-2">No user found.</p>
                        ) : (
                            <p className="text-gray-400 text-center py-2">Start typing to search.</p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default NewChat
