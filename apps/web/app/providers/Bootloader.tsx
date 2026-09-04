'use client'
import { GlobalLoader } from '@/components/loaders/GlobalLoader';
import { storageAdapter } from '@ecomerece/frontend/storage'
import React, { ReactNode, useEffect, useState } from 'react'

function Bootloader({ children }: { children: ReactNode }) {

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const init = async () => {
            await storageAdapter.ensureReady();
            setLoading(false);
        }
        init();
    }, [])


    if (loading) return <GlobalLoader />
    else return children


}

export default Bootloader
