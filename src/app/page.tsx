import Image from 'next/image'
import Link from 'next/link'
import Pkg from '../../package.json'
import { Grid } from '@mui/material'
export default function Home() {

  return (
    <main>
      <Grid container spacing={2} className='bg-white z-9999'>
        <Grid item md={6}>
          <div className='flex items-center'>
          <Image
            className="relative"
            src="/beekasir-name.svg"
            alt="BeeKasir Logo"
            width={30}
            height={30}
            priority
          />
            Beekasir - Aplikasi Kasir | POS v{Pkg.version}
          </div>

        </Grid>
        <Grid item md={6} textAlign={'right'}>
          <div className='flex items-center justify-end'>
          By Warza Teknologi
          <Image
            src="/warza-logo.svg"
            alt="Warza Logo"
            width={30}
            height={30}
            priority
          />
          </div>
        </Grid>
      </Grid>

      <div>
        <Image
          fill
          src="/bg-beekasir.png"
          alt="Beekasir Logo"
          sizes='80vw'
          style={{ zIndex: -1, objectFit: 'cover' }}
          priority
        />
      </div>

      <div className="mb-32 grid text-center bg-white fixed bottom-0 lg:mb-0 lg:grid-cols-4 lg:text-center w-full">
        <a
          href="https://play.google.com/store/apps/details?id=com.beebeesoft.beekasir"
          className="group rounded-lg border 
          border-transparent px-5 py-4 transition-colors 
          hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Download{' '}
          </h2>
          <p className={`text-sm text-center`}>
            Download and Instal Apps Beekasir on Google Play Store.
          </p>
        </a>

        <Link
          href="/admin"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"

          rel="noopener noreferrer"
        >
          <h2 className={`text-center`}>
            BeeKasir Web{' '}
          </h2>
          <p className={`text-center`}>
            Login Beekasir Web Now.
          </p>
        </Link>

        <Link
          href="/public/pricing"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"

          rel="noopener noreferrer"
        >
          <h2 className={`text-center`}>
            Pilihan Paket
          </h2>
          <p className={`text-center`}>
            Pricing list produk aplikasi mesin kasir scanner printer dan cash drawer.
          </p>
        </Link>

        <a
          href="https://www.beebeesoft.com/"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`text-center font-semibold`}>
            About{' '}
          </h2>
          <p className={`text-center`}>
            Beekasir is the Product of Beebeesoft Developer.
          </p>
        </a>
      </div>
    </main>
  )
}
