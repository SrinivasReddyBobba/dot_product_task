"use client";

import Eboard from "../eboard/page";
import Mboard from "../mboard/page";
import React, { useState, useEffect } from "react";
export default function Dashboard() {
    const [role, setRole] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("role");
            setRole(storedRole);
            setIsMounted(true);
        }
    }, []);
    if (!isMounted) {
        return <div>Loading...</div>; 
    }
    return (
        <>
            {role === "user" ? <Eboard /> : <Mboard />}
        </>
    );
}