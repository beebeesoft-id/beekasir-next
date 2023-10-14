"use client"

import { AlertSweet, ToastSweet, localSave } from "@/service/helper";
import { Alert, Button, LinearProgress, TextField } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AUTH, DB } from "@/service/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Login() {
  const { handleSubmit, register, formState: { errors }} = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingDesc, setLoadingDesc] = useState('Please wait');
  const router = useRouter();

  const handleLogin = (data:any) => {
    // console.log(data);
    getUser(data);
  }

  async function getUser(user : any) {
    setLoading(true);
    setLoadingDesc('Check User');
    
    const ref = doc(DB, 'Users', user.username);
    const data = await getDoc(ref);
    const row = data.data();
    
    if (!row) {
      setLoading(false);
      setLoadingDesc('User Tidak Terdaftar');
      AlertSweet('warning', 'Login Gagal','Username atau Password tidak sesuai');
    } else {
      localSave('@user', row);
      setLoadingDesc('User Terdaftar');
      getCompany(row, user);
    }
  }

  async function getCompany(user : any, login: any) {
    try {
      setLoading(true);
      setLoadingDesc('Check Data Usaha');
      //console.log(user);
      
      const ref = doc(DB, 'Company', user.companyId);
      //console.log(ref);
      
      const data = await getDoc(ref);
      //console.log(data);
      
      const row = data.data();
      //console.log(row);
      
      if (!row) {
        setLoading(false);
        setLoadingDesc('Usaha Tidak Terdaftar');
        AlertSweet('warning', 'Login Gagal','Silahkan login di aplikasi mobile untuk melengkapi data.');
      } else {
        localSave('@company', row);
        setLoadingDesc('Usaha Terdaftar');
        getBranch(user, login);
      }
    } catch (error) {
      setLoading(false);
      AlertSweet('error', 'Login Gagal','ERR.62 ' + error);
    }
    
  }

  async function getBranch(user : any, login: any) {
    try {
      setLoading(true);
      setLoadingDesc('Check Cabang User');
      console.log(user);
      
      const ref = doc(DB, 'Company/' + user.companyId + '/Branch', user.branchId);
      console.log(ref);
      
      const data = await getDoc(ref);
      console.log(data);
      
      const row = data.data();
      //console.log(row);
      
      if (!row) {
        setLoading(false);
        setLoadingDesc('Cabang Tidak Terdaftar');
        AlertSweet('warning', 'Login Gagal','Silahkan login di aplikasi mobile untuk melengkapi data.');
      } else {
        localSave('@branch', row);
        setLoadingDesc('Cabang User ditemukan');
        checkLDAP(login);
      }
    } catch (error) {
      setLoading(false);
      AlertSweet('error', 'Login Gagal','ERR.100 ' + error);
    }
    
  }

  async function checkLDAP(user : any) {
    setLoading(true);
    setLoadingDesc('Check LDAP');
    console.log(user);
    
    signInWithEmailAndPassword(AUTH, user.username, user.password).then((value) => {
      ToastSweet('success', 'Welcome ' + value.user.email + '.');
      
      setLoadingDesc('Anda akan diarahkan ke halaman admin.');
      router.push('/admin');
    }).catch((err) => {
      setLoading(false);
      if (err.code.includes('wrong-password')) {
        AlertSweet('warning', 'Login Gagal','Username atau Password tidak sesuai');
      } else if (err.code.includes('user-disable')) {
        AlertSweet('warning', 'Login Gagal','User Tidak Aktif');
      } else if (err.code.includes('too-many-requests')) {
        AlertSweet('warning', 'Login Gagal','User diblokir sementara karena teralu banyak percobaan login');
      } else if (err.code.includes('auth/network-request-failed')) {
        AlertSweet('warning', 'Login Gagal','Ops, Untuk Login Membutuhkan Koneksi Internet.');
      } else {
        AlertSweet('error', 'Login Gagal','ERR.LOGIN.36 Ups Terjadi kesalahan sistem. silahkan ulangi.');
      }
    });
    
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
              Sign in to Beekasir Web
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(handleLogin)}>
              <div>
                <TextField type="email" 
                  fullWidth 
                  label="Email"
                  disabled={loading}
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
                disabled={loading}
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
              <br/>
              <div>
              <LinearProgress hidden={!loading} />
              <Alert hidden={!loading} severity="info">{loadingDesc}</Alert>
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
  