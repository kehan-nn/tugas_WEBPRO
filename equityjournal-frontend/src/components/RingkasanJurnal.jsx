import { formatRupiah } from '../utils/format'

function RingkasanJurnal({ total, jumlahHold, jumlahJual, totalNilai }) {
  const daftarStatistik = [
    { label: 'Total transaksi', nilai: total, variasi: '' },
    { label: 'Posisi Hold', nilai: jumlahHold, variasi: 'hold' },
    { label: 'Posisi Jual', nilai: jumlahJual, variasi: 'jual' },
    { label: 'Total nilai beli', nilai: formatRupiah(totalNilai), variasi: '' },
  ]

  return (
    <section className="ringkasan" aria-label="Ringkasan jurnal">
      {daftarStatistik.map((statistik) => (
        <div key={statistik.label} className={'statistik ' + statistik.variasi}>
          <span className="statistik-label">{statistik.label}</span>
          <span className="statistik-nilai">{statistik.nilai}</span>
        </div>
      ))}
    </section>
  )
}

export default RingkasanJurnal
