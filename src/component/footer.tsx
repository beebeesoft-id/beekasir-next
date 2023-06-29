import Image from "next/image";

export default function ComFooter() {
    return (
        <div className="bg-gray-100">
        <div
            className="
                    container
                    mx-auto
                    py-4
                    px-5
                    flex flex-wrap flex-col
                    sm:flex-row
                    "
            >
        <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2023 Copyright:
            <a
            href="https://www.beebeesoft.com/"
            className="text-gray-600 ml-1"
            target="_blank"
            >Beebeesoft</a
            >
        </p>
        <span
                className="
                    inline-flex
                    sm:ml-auto sm:mt-0
                    mt-2
                    justify-center
                    sm:justify-start
                    "
                >
            <a href="" className="text-gray-500">
            <i className="fab fa-facebook-f"></i>
            </a>
            <a href="" className="ml-3 text-gray-500">
            <i className="fab fa-twitter"></i>
            </a>
            <a href="" className="ml-3 text-gray-500">
            <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="" className="ml-3 text-gray-500">
            <i className="fab fa-youtube"></i>
            </a>
            <a href="" className="ml-3 text-gray-500">
            <i className="fab fa-instagram"></i>
            </a>
        </span>
        </div>
        </div>
    )
}