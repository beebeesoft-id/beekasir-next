import { AUTH, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
        console.log("request post");
        
      const body = await req.json();
      
      const headersList = headers();
      
    //   const apiKey  = headersList.get('apikey');
      
    //   if ((!apiKey) || (apiKey != process.env.APIKEY)) {
    //     return NextResponse.json({ 'data': null, 'status': '402', 'statusDesc' : 'Forbbiden'});
    //   }
      
    //   if (!body.username || !body.password) {
    //     return NextResponse.json({ 'data': null, 'status': '400', 'statusDesc' : 'bad request'});
    //   }

    //   const ref = doc(DB, "Users/" + body.username);

    //   const user = (await getDoc(ref)).data();

    //   if (!user) {
    //     return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : 'no-content'});
    //   }

    //   const signIn = await signInWithEmailAndPassword(AUTH, body.username, body.password).then((value) => {
    //     console.log(value);
        
    //     return value;
    //   }).catch((reason) => {
    //     return reason;
        
    //   });
    //   if (!signIn.user) {

    //     return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : signIn.code});
    //   }
        console.log(body);
        console.log(headersList);
        
      return NextResponse.json({ 'data': body, 'status': '200', 'statusDesc' : headersList});
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': null, 'status': '500', 'statusDesc' : 'Internal Server Error'});
    }
  
  
}