"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ProfileNavigationBar() {
    const pathname = usePathname();

    //get url from the path
    const base = pathname.split("/").slice(0, 3).join("/");

    //tabs for the navbar
    const tabs = [
        {label: "Home", toAppend:""},
        { label: "Your Restaurants", toAppend: "yourRestaurants" },
        { label: "Liked Restaurants", toAppend: "likedRestaurants" },
    ];

    return (
        <nav className="bg-black">
            <ul className="flex space-x-6 px-4 py-3">
                {/*map over each tab, and return a link. */}
                {tabs.map(({ label, toAppend }) => {
                    //create the new link
                    const href = toAppend? `${base}/${toAppend}` :base;

                    //isActive checks if the current path name is equal to the one we are generating so we can highlight or not
                    const isActive = pathname === href;
                    return (
                        <li key={toAppend}>
                            <Link
                                href={href}
                                className={`text-sm font-medium transition-colors ${isActive ? "text-white border-b-2 border-white" : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}