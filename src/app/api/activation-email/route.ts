import { NextRequest, NextResponse } from 'next/server';
import { DB } from "@/service/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { today } from '@/service/helper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const baseUrl = process.env.NEXT_BASE_URL;
  let redirectPage = "/activation-email";

  // if (!token) {
  //   return NextResponse.redirect(new URL('/failure', request.url));
  // }

  try {
    // 1. Cari pengguna berdasarkan token verifikasi
    // Asumsi Anda memiliki field 'verificationToken' di dokumen pengguna
    const ref: any = "Users/";
    const list = collection(DB, ref);
    const filter = query(list, where('key', '==', token));
    const data = (await getDocs(filter)).docs;

    // 2. Jika tidak ada pengguna dengan token tersebut, berarti token tidak valid
    if (data.length == 0) {
      redirectPage = '/activation-email?status=already_verified';
    } else if (data.length == 1) {
      let user = data[0].data();
      console.log(user);
      const refUser = doc(DB, ref + user.username);
      await updateDoc(refUser, { 'userStatus': 'Active', 'key': '', 'updatedDate': today() });

      redirectPage = '/activation-email?status=success_verified';
    } else {
      redirectPage = '/activation-email?status=failed_verified';
    }

    // const userDoc = userSnapshot.docs[0];
    // const userData = userDoc.data();

    // 3. Cek apakah pengguna sudah terverifikasi sebelumnya
    // if (userData.status === 'activated') {
    //   // Jika sudah, redirect ke halaman sukses dengan status khusus
    //   return NextResponse.redirect(new URL('/success?status=already_verified', request.url));
    // }

    // 4. Update status pengguna menjadi 'activated'
    // await userDoc.ref.update({
    //   status: 'activated',
    //   // Opsional: Hapus token verifikasi setelah berhasil
    //   verificationToken: null,
    //   updatedAt: new Date(),
    // });

    // 5. Redirect ke halaman sukses setelah verifikasi berhasil
    return NextResponse.redirect(baseUrl + redirectPage);
  } catch (error) {
    console.error('Error during email verification:', error);
    // Redirect ke halaman gagal jika terjadi error tak terduga
    return NextResponse.redirect(new URL('/activation-email?status=failed_verified', request.url));
  }
}