import { DB } from "@/service/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";
import axios from "axios";

//export const dynamic = "force-dynamic" //clodflare solution
interface Company {
        createdDate: string;
        companyName: string;
        status: string;
        level: number;
        lastUpdate: string;
        createdBy: string;
        companyPhone: string;
        id: string;
        member: string;
}

export async function POST(req : Request, response : Response, head : Headers) {
    try {
      console.log("Scanning Auto Downgrade");
      
      //const headersList = headers();
      //const apiKey  = headersList.get('Authorization');
      
      // if ((!apiKey) || (apiKey != `Bearer ${process.env.APIKEY}`)) {
      //   console.log(headersList);
        
      //   console.log("ApiKey blocked " + apiKey);
      //   return NextResponse.json({ 'data': 401, 'error': 'Not Authenticated.' }, { status : 401});
      // }
      
      const list = collection(DB, "Company/");

      const filter = query(list, where('status','==','destroy'));

      const data = (await getDocs(filter)).docs;
        
      console.log(data);

      let listCompany = <any>[];

      let listNonFree = <any>[];

      let listMore30d = <any>[];
      
    //   const today = moment().format('YYYY-MM-DD');
    //   console.log('Found ' + data.length);
    //   let countExp = 0;
    //   const dayReminder = -4;
      
        data.forEach(async(val) => {
            try {
                let row = val.data();

                // const collectTrx = collection(DB, 'Company/' + row.id + '/Transactions');
                
                // const dataTrx = (await getDocs(collectTrx)).docs;

                // console.log(dataTrx.length);

                listCompany.push(row);
                console.log(row);
                
                let selisih = moment().diff(row.lastUpdate, 'day');
                

                if (selisih >= 30) { //lebih 30 hari
                    listMore30d.push(row);
                }
                
                if (row.exp) {
                    listNonFree.push(row);
                }
                
                
            
            } catch (error) {
                console.log(error);
            
            }
        
        });
      console.log("Finish Scanning");
      
      return NextResponse.json({ 'data': {
        'size' : data.length,
        'sizeMore30d' : listMore30d.length,
        'listNonFree' : listNonFree,
        'listMore30d' : listMore30d,
        'listAll' : listCompany
      }, 'status': '200', 'statusDesc' : 'Clean User Sukses '});
    } catch (error) {
        console.log("Error di clear user");
        
        console.log('error ' + error);
        
      console.log(error);
      
      
      return NextResponse.json({ 'data': "clear user", 'status': '500', 'statusDesc' : error});
    }
  
  
}