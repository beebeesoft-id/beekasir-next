import { AUTH, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, getAuth, onAuthStateChanged, Auth } from 'firebase/auth'
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function GET(req : Request, response : Response, head : Headers) {
    try {
      
      // const headersList = headers();
      
      // const apiKey  = headersList.get('apikey');
      
      // if ((!apiKey) || (apiKey != process.env.APIKEY)) {
      //   return NextResponse.json({ 'data': null, 'status': '402', 'statusDesc' : 'Forbbiden'});
      // }
      
      console.log("start");
      console.log(AUTH.currentUser?.email);
      if (AUTH.currentUser?.email) {
        return NextResponse.json({ 'data': AUTH.currentUser.email, 'status': '200', 'statusDesc' : 'Logged In Success'});
      } else {
        return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : 'Otorisasi tidak sah'});
      }
      
      
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': null, 'status': '500', 'statusDesc' : 'Internal Server Error'});
    }
  
  
}