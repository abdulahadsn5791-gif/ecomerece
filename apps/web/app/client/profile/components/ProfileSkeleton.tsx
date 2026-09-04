import { motion } from 'framer-motion';

export const ProfileSkeleton = ({ darkMode }: { darkMode: boolean }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className={`border rounded-3xl p-8 shadow-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'}`}
    >
        <div className="flex flex-col sm:flex-row items-center gap-8 animate-pulse">
            <div className={`w-24 h-24 rounded-full ring-4 ${darkMode ? 'ring-gray-700 bg-gray-700' : 'ring-gray-50 bg-gray-200'}`} />
            <div className="flex-1 space-y-4 w-full">
                <div className={`h-7 w-48 rounded-lg mx-auto sm:mx-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-4 w-64 rounded-md mx-auto sm:mx-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="flex gap-2 justify-center sm:justify-start">
                    <div className={`h-6 w-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-6 w-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-20 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`} />
            ))}
        </div>
    </motion.div>
);