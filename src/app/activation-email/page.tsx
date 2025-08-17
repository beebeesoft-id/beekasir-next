'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ActivationEmail() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'default';

  let title = "Verifikasi Gagal!";
  let message = "Email Anda gagal diverifikasi, Kode Aktivasi tidak dikirimkan. Silahkan klik link aktivasi pada email.";

  if (status === 'already_verified') {
    title = "Sudah Diverifikasi";
    message = "Kode Verifikasi tidak ditemukan, mungkin sudah pernah anda aktifasi. Silakan coba masuk ke akun Anda.";
  }

  if (status === 'success_verified') {
    title = "Verifikasi Berhasil";
    message = "Oke Akun anda telah aktif. Silakan masuk ke akun Anda.";
  }

  if (status === 'failed_verified') {
    title = "Verifikasi Gagal";
    message = "Ups Something Wrong. Silakan coba lagi";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-bold text-gray-800">{title}</h1>
        <p className="mt-2 text-gray-600">
          {message}
        </p>
        <div className="mt-6">
          <Link
            href="https://play.google.com/store/apps/details?id=com.beebeesoft.beekasir"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition duration-300 ease-in-out hover:bg-blue-700"
          >
            Lanjutkan ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}