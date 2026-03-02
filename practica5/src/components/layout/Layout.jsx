import { useEffect } from 'react';
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import { useUIStore } from "../../store/uiStore"

export default function Layout() {
    const { theme } = useUIStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}