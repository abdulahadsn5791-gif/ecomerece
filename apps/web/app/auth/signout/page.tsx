'use client'

import { useEffect } from "react"
import { signOut } from "../actions/sign-out"


export default function SignOutButton() {

    useEffect(() => {
        signOut();
    }, [])



}