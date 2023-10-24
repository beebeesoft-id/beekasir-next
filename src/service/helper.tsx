import Swal from 'sweetalert2'

var _ = require('lodash');

export function formatCcy(amount:any) {
    if (amount == '') {
        amount = 0;
    } else if(isNaN(amount)){
        amount = 0;
    } else {
        amount = parseInt(amount);
    }
    
    return String(amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
}

export function AlertSweet(status:string | any, title:string, desc:string) {
    Swal.fire({
        title: title,
        text: desc,
        icon: status,
        confirmButtonText: 'OK',
      });
}

export function ConfirmSweet(status:string | any, title:string, desc:string, fn : Function) {
    Swal.fire({
        title: title,
        text: desc,
        icon: status,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak',
        showCancelButton: true,
      }).then((response) => {
        if (response.isConfirmed) {
            fn();
        }
      });
}

export function ToastSweet(status:string | any, title:string) {
    Swal.fire({
        title: title,
        icon: status,
        position:'bottom-left',
        timer: 3000,
        timerProgressBar:true,
        toast: true,
        showConfirmButton:false
      });
}

export function localSave(key: string, value:any) {
    value = encrypt(value);
    localStorage.setItem(key, value);
}

export function localGet(key: string,) {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            const realData = decrypt(data);
            
            return realData;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        
        return null;
    }
    
    
}

import { AES, enc } from "crypto-js";
import { globalRoleAccess, sysMenus } from './globalVar';
const secret = 'afterCyberkay';

export function encrypt(plaintext : any) {
    try {
        const chipertext = AES.encrypt(JSON.stringify(plaintext), secret).toString();
        return chipertext;        
    } catch (error) {
        return '';
    }
    
}

export function decrypt(chipertext : string) {
    try {
        
        const decrypt = AES.decrypt(chipertext, secret);
        
        const plaintext = JSON.parse(decrypt.toString(enc.Utf8));
        
        return plaintext;
    } catch (error) {
        console.log(error);
        return '';
    }
    
}

export const setAccess = (data : any) => {
    let listMenu : any[] = [];
    let haveAccess = globalRoleAccess(data.role);
    
    sysMenus.forEach((menu) => {
      if(_.includes(haveAccess, menu.id)){
        listMenu.push(menu);
      }
    })
    return listMenu;
}

export function makeId(length : number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}