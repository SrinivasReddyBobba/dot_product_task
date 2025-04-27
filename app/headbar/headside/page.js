
"use client";
import React, { useState, useEffect } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Sidebar({ toggleSidebar, sidebarToggled }) {
    const [windowWidth, setWindowWidth] = useState(0);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [activePage, setActivePage] = useState("");
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                if (window.innerWidth < 768) {
                    toggleSidebar(false);
                }
            };
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, [toggleSidebar]);
    const handleDropdownToggle = (dropdownId) => {
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const storedUserName = localStorage.getItem("userName");
            setUserName(storedUserName);
        }
    }, []);
    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes("/dashboard")) setActivePage("dashboard");
        else if (path.includes("/reports")) setActivePage("reports");
        else if (path.includes("/users")) setActivePage("users");
        else if (path.includes("/tables")) setActivePage("tables");
        else if (path.includes("/login")) setActivePage("login");
        else if (path.includes("/register")) setActivePage("register");
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    if (!role) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div
                className={`navbar-nav bg-primary sidebar sidebar-dark accordion ${sidebarToggled ? "toggled" : ""}`}
                id="accordionSidebar"
            >
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/dashboard">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">
                        BUDGET-TRACKER
                    </div>
                </a>

                <hr className="sidebar-divider my-0" />

                <li className={`nav-item ${activePage === "loginboard" ? "active" : ""}`}>
                    <a className="nav-link" href="/loginboard">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </a>
                </li>

                {role === "Admin" && (
                    <li className={`nav-item ${activePage === "users" ? "active" : ""}`}>
                        <a className="nav-link" href="/totalbudget">
                            <i className="fas fa-fw fa-chart-area"></i>
                            <span>Monthly Budget  </span>
                        </a>
                    </li>
                )}
                {role === "Admin" && (
                    <li className={`nav-item ${activePage === "users" ? "active" : ""}`}>
                        <a className="nav-link" href="/employs">
                            <i className="fas fa-fw fa-chart-area"></i>
                            <span>Add categories</span>
                        </a>
                    </li>
                )}

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={toggleSidebar}></button>
                </div>
            </div>
            <div className="main-content">
            </div>
        </>
    );
}



