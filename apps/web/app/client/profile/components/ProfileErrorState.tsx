import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ProfileErrorStateProps {
    darkMode: boolean;
    refetch: () => void;
    isFetching: boolean;
}

export const ProfileErrorState = ({ darkMode, refetch, isFetching }: ProfileErrorStateProps) => (
    <main className="lg:col-span-3">
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`border rounded-3xl p-10 text-center shadow-lg backdrop-blur-sm ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}
        >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-500'}`}>
                <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Unable to load profile</h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We encountered an issue fetching your data.</p>
            <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Synchronizing...' : 'Try Again'}
            </button>
        </motion.div>
    </main>
);