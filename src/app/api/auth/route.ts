import { Auth, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
      const body = await req.json();
      
      const headersList = headers();
      
      const apiKey  = headersList.get('apikey');
      
      if ((!apiKey) || (apiKey != process.env.APIKEY)) {
        return NextResponse.json({ 'data': null, 'status': '402', 'statusDesc' : 'Forbbiden'});
      }
      
      if (!body.username || !body.password) {
        return NextResponse.json({ 'data': null, 'status': '400', 'statusDesc' : 'bad request'});
      }

      const ref = doc(DB, "Users/" + body.username);

      const user = (await getDoc(ref)).data();

      if (!user) {
        return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : 'no-content'});
      }

      const signIn = await signInWithEmailAndPassword(Auth, body.username, body.password).then((value) => {
        
        return value;
      }).catch((reason) => {
        return reason;
        
      });
      if (!signIn.user) {

        return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : signIn.code});
      }

      return NextResponse.json({ 'data': user, 'status': '200', 'statusDesc' : 'success'});
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': null, 'status': '500', 'statusDesc' : 'Internal Server Error'});
    }
  
  
}