"use client"

import { AlertSweet } from "@/service/helper";
import { Alert, Button, TextField } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function Login() {
  const { handleSubmit, register, formState: { errors }} = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (data:any) => {
    //console.log(data);
    getUser(data);
  }

  async function getUser(user : any) {
    setLoading(true);
    const api = await fetch('/api/auth', {
        method: 'POST',
        headers :  {
            'Content-Type': 'application/json',
            'ApiKey': '20240101',
        },
        body: JSON.stringify(user)
      });

    const res = await api.json();
    setLoading(false);
    console.log(res.data);
    
    if (!res.data) {
      AlertSweet('error','Gagal Login','Username atau password tidak sesuai ' + res.statusDesc );
    } else {
      //AlertSweet('info','Info','Beekasir web belum dibuka.');
      router.push('/admin');
    }
    
  }
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link href={'/'}>
            <img
              className="mx-auto h-10 w-auto"
              src="/beekasir-logo.svg"
              alt="Your Company"
            />
            </Link>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(handleLogin)}>
              <div>
                <TextField type="email" 
                  fullWidth 
                  label="Email"
                  { ...register('username', { required:{ value:true, message:'Silahkan masukkan email' }})} 
                  helperText={ (errors.username?.message) ? errors.username?.message.toString() : '' }
                  variant="outlined" />
                
              </div>
              <br />
              <div>
                <TextField
                type="password" 
                fullWidth 
                label="Password" 
                { ...register('password', { required:{ value:true, message:'Silahkan masukkan password' }})} 
                helperText={ (errors.password?.message) ? errors.password?.message.toString() : '' }
                variant="outlined" />
              </div>
              <br />
              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </Button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Buat akun di aplikasi Beekasir{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Go to Google Playstore
              </a>
            </p>
          </div>
        </div>
      </>
    )
  }
  