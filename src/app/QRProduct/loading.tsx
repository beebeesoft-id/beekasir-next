import Link from "next/link";
import styles from './styles.module.css'
export default function Loading() {
    return (
      <>
        <main className="grid h-full w-full fixed place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
        <div className={styles.ldsGrid}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <p className="mt-6 text-base leading-7 text-gray-600">Silahkan tunggu, Sedang Memuat Halaman.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
        
      </>
    )
  }
  