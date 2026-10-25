import KartuJurnal from './KartuJurnal'

function DaftarJurnal({ daftarJurnal, onHapus }) {
  return (
    <section className="daftar" aria-label="Daftar jurnal">
      <h2 className="judul-bagian">Riwayat Jurnal ({daftarJurnal.length})</h2>

      {daftarJurnal.length === 0 ? (
        <p className="kosong">Belum ada data jurnal</p>
      ) : (
        <div className="daftar-kartu">
          {daftarJurnal.map((jurnal) => (
            <KartuJurnal
              key={jurnal.id}
              ticker={jurnal.ticker}
              namaPerusahaan={jurnal.namaPerusahaan}
              tanggal={jurnal.tanggal}
              harga={jurnal.harga}
              lot={jurnal.lot}
              sekuritas={jurnal.sekuritas}
              status={jurnal.status}
              alasan={jurnal.alasan}
              onHapus={() => onHapus(jurnal.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default DaftarJurnal
