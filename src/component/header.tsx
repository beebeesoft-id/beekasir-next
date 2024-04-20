"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ComHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    return (
        <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">BeeKasir</span>
                
            </Link>
            </div>
        </nav>
        </header>
    )
}