"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Router } from "next/router";
import { FaPowerOff } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Spin } from 'antd';
import { Switch } from 'antd';
export default function Topheader({ toggleSidebar }) {
    const router = useRouter();
    const Siginout = () => {
        router.push('/');
    };
    return (
        <>
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4  shadow justify-content-between">
                    <button id="sidebarToggleTop" className="btn btn-link rounded-circle mr-3" onClick={toggleSidebar}>
                        <IoMenu />
                    </button>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow float-end">
                            <a className="nav-link" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="d-lg-inline text-gray-600 small text-dark" onClick={Siginout}>
                                    LogOut
                                </span>
                                <FaPowerOff />
                            </a>
                        </li>
                    </ul>
                </nav>
        </>
    );
}
