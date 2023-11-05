export const globalRole = { 
    "list" : ["Admin", "Kasir", "Pengadaan"],
    OWNER : "Owner",
    KASIR : "Kasir",
    ADMIN : "Admin",
    PENGADAAN : "Pengadaan"
}

export const globalRoleAccess = (role : string) => {
    switch (role) {
        case globalRole.KASIR:
            return ['TRX','CBX','HST','MBR','PBT']
            break;
        case globalRole.PENGADAAN:
            return ['INV','CAT','SUP']
            break;
        case globalRole.ADMIN:
          return ['INV','CAT','SUP','TRX','CBX','HST','RPT','MBR','USR','PBT','SYS']
              break;
        default:
            return ['INV','CAT','SUP','TRX','CBX','HST','RPT','MBR','USR','BCS','PBT','SYS']
            break;
    }
}

export const sysMenus = [
    // {
    //   id:'INV',
    //   label:'Inventori Produk',
    //   icon:'fa-solid fa-cube',
    //   route:'MenuProduct',
    //   level:0,
    // },
    // {
    //   id:'CAT',
    //   label:'Daftar Kategori',
    //   icon:'fa-solid fa-cubes',
    //   route:'InvProductCategory',
    //   level:0,
    // },
    // {
    //   id:'SUP',
    //   label:'Daftar Suplier',
    //   icon:'fa-solid fa-truck-field',
    //   route:'Suplier',
    //   level:0,
    // },
    {
      id:'TRX',
      label:'Transaksi Penjualan',
      icon:'fa-solid fa-cash-register',
      route:'PosTrx',
      level:0,
    },
    // {
    //   id:'CBX',
    //   label:'Data Cashbox',
    //   icon:'fa-solid fa-vault',
    //   route:'Cashbox',
    //   level:0,
    // },
    {
      id:'HST',
      label:'Riwayat Penjualan',
      icon:'fa-solid fa-file-lines',
      route:'PosHistory',
      level:0,
    },
    // {
    //   id:'RPT',
    //   label:'Laporan Penjualan',
    //   icon:'fa-solid fa-chart-line',
    //   route:'MenuReport',
    //   level:0,
    // },
    // {
    //   id:'MBR',
    //   label:'Daftar Member',
    //   icon:'fa-solid fa-address-card',
    //   route:'Member',
    //   level:0,
    // },
    // {
    //   id:'USR',
    //   label:'Daftar   User',
    //   icon:'fa-solid fa-users-gear',
    //   route:'UserManagement',
    //   level:1,
    // },
    // {
    //   id:'BCS',
    //   label:'Daftar Cabang',
    //   icon:'fa-solid fa-shop',
    //   route:'BranchManagement',
    //   level:2,
    // },
    // {
    //   id:'PBT',
    //   label:'Printer Bluetooth',
    //   icon:'fa-brands fa-bluetooth',
    //   route:'Bluetooth',
    //   level:0,
    // },
    // {
    //   id:'SYS',
    //   label:'Pengaturan Sistem',
    //   icon:'fa-solid fa-screwdriver-wrench',
    //   route:'MenuSetting',
    //   level:0,
    // },
  ]