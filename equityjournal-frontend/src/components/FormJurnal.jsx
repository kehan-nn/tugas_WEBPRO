import { useState } from 'react'

const nilaiAwal = {
  tanggal: '',
  ticker: '',
  namaPerusahaan: '',
  harga: '',
  lot: '',
  sekuritas: 'Stockbit',
  status: 'hold',
  alasan: '',
}

function FormJurnal({ onTambah }) {
  const [nilai, setNilai] = useState(nilaiAwal)
  const [pesanError, setPesanError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    const nilaiBaru = name === 'ticker' ? value.toUpperCase().replace(/[^A-Z]/g, '') : value
    setNilai({ ...nilai, [name]: nilaiBaru })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const kolomKosong =
      nilai.tanggal === '' ||
      nilai.ticker === '' ||
      nilai.harga === '' ||
      nilai.lot === '' ||
      nilai.alasan.trim() === ''

    if (kolomKosong) {
      setPesanError('Lengkapi tanggal, kode saham, harga, lot, dan alasan beli terlebih dahulu.')
      return
    }

    if (nilai.ticker.length !== 4) {
      setPesanError('Kode saham harus terdiri dari 4 huruf.')
      return
    }

    if (Number(nilai.harga) < 1 || Number(nilai.lot) < 1) {
      setPesanError('Harga dan jumlah lot minimal 1.')
      return
    }

    onTambah({
      tanggal: nilai.tanggal,
      ticker: nilai.ticker,
      namaPerusahaan: nilai.namaPerusahaan.trim(),
      harga: Number(nilai.harga),
      lot: Number(nilai.lot),
      sekuritas: nilai.sekuritas,
      status: nilai.status,
      alasan: nilai.alasan.trim(),
    })

    setNilai(nilaiAwal)
    setPesanError('')
  }

  return (
    <section className="form-jurnal" aria-label="Form tambah jurnal">
      <h2 className="judul-bagian">Tambah Jurnal</h2>

      {pesanError && <p className="pesan-error" role="alert">{pesanError}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="kolom">
          <label htmlFor="tanggal">Tanggal transaksi</label>
          <input id="tanggal" name="tanggal" type="date" value={nilai.tanggal} onChange={handleChange} />
        </div>

        <div className="baris-dua">
          <div className="kolom">
            <label htmlFor="ticker">Kode saham</label>
            <input
              id="ticker"
              name="ticker"
              type="text"
              maxLength={4}
              placeholder="Contoh: SUPA"
              value={nilai.ticker}
              onChange={handleChange}
            />
          </div>
          <div className="kolom">
            <label htmlFor="sekuritas">Sekuritas</label>
            <select id="sekuritas" name="sekuritas" value={nilai.sekuritas} onChange={handleChange}>
              <option value="Stockbit">Stockbit</option>
              <option value="IndoPremier">IndoPremier</option>
              <option value="Ajaib">Ajaib</option>
              <option value="Mirae Asset Sekuritas">Mirae Asset Sekuritas</option>
            </select>
          </div>
        </div>

        <div className="kolom">
          <label htmlFor="namaPerusahaan">Nama perusahaan (opsional)</label>
          <input
            id="namaPerusahaan"
            name="namaPerusahaan"
            type="text"
            placeholder="Contoh: PT Sumber Alfaria Trijaya"
            value={nilai.namaPerusahaan}
            onChange={handleChange}
          />
        </div>

        <div className="baris-dua">
          <div className="kolom">
            <label htmlFor="harga">Harga beli (Rp)</label>
            <input
              id="harga"
              name="harga"
              type="number"
              min="1"
              placeholder="Contoh: 292"
              value={nilai.harga}
              onChange={handleChange}
            />
          </div>
          <div className="kolom">
            <label htmlFor="lot">Jumlah lot</label>
            <input
              id="lot"
              name="lot"
              type="number"
              min="1"
              placeholder="Contoh: 10"
              value={nilai.lot}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="kolom">
          <label htmlFor="status">Status saat ini</label>
          <select id="status" name="status" value={nilai.status} onChange={handleChange}>
            <option value="hold">Hold</option>
            <option value="jual">Jual</option>
          </select>
        </div>

        <div className="kolom">
          <label htmlFor="alasan">Alasan beli / trading plan</label>
          <textarea
            id="alasan"
            name="alasan"
            rows={4}
            placeholder="Contoh: Laporan keuangan kuartal 3 bagus dan harga tembus resisten 300."
            value={nilai.alasan}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="tombol tombol-utama">Tambah Jurnal</button>
      </form>
    </section>
  )
}

export default FormJurnal
