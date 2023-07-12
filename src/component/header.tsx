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
                <Image
              src="../../beekasir-logo.svg"
              alt="Beekasir Logo"
              className="dark:invert"
              width={50}
              height={24}
              priority
            />
            </Link>
            </div>

            <div className="flex lg:hidden">
            <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
                <Link href="/" className="text-sm font-semibold leading-6 text-gray-900">Home</Link>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Pricing</a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About</a>
            </div>
            
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
            </div>
        </nav>
        { mobileMenuOpen && <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10"></div>
            <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                    <Link href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">BeeKasir</span>
                    <Image
                    src="../../beekasir-logo.svg"
                    alt="BeeKasir Logo"
                    className="dark:invert"
                    width={50}
                    height={24}
                    priority
                    />
                    </Link>
                    <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                    >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                <div className="mt-6 flow-root">
                    <Link href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</Link>
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Pricing</a>
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">About</a>
                
                </div>
                <div className="py-6">
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</a>
                </div>
            </div>
        </div> }
        </header>
    )
}