import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import SearchCard from './SearchCard'

const ChatSearch = () => {
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

        setTimeout(() => {
            const filtered = allUser.filter((user) =>
                user.name.toLowerCase().includes(value.toLowerCase())
            )
            setResults(filtered)
        }, 500)
        setLoading(false)
    }

    const clearSearch = () => {
        setSearchTerm('')
        setResults([])
        setLoading(false)
    }

    // console.log(allUser)

    return (
        <div className="w-full flex flex-col gap-3 relative">
            {/* Search Input */}
            <div className="w-full flex items-center border px-4 border-purple-500 rounded-md">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    spellCheck={false}
                    placeholder="Search by person name"
                    className="w-full bg-transparent rounded-lg py-2 text-white outline-none"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="ml-2 text-gray-300 hover:text-white transition cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {searchTerm && (
                <div className="absolute top-full mt-2 w-full h-96 flex flex-col gap-2 backdrop-blur-sm rounded-lg shadow-lg overflow-y-auto z-10 p-2">
                    {loading ? (
                        // Skeleton loader
                        <>
                            {[...Array(5)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-10 w-full bg-gray-700/40 rounded-lg animate-pulse"
                                />
                            ))}
                        </>
                    ) : results.length > 0 ? (
                        results.map((user) => (
                            <SearchCard key={user._id} user={user} onclick={()=>setSearchTerm('')}  />
                        ))
                    ) : (
                        <p className="text-gray-300 text-sm px-2 py-2 text-center">
                            No search results.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChatSearch
