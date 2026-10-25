export const LEMBAR_PER_LOT = 100

export function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID')
}

export function hitungTotal(jurnal) {
  return jurnal.harga * jurnal.lot * LEMBAR_PER_LOT
}
