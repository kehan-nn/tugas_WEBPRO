import { useState } from 'react'
import Header from './components/Header'
import RingkasanJurnal from './components/RingkasanJurnal'
import FormJurnal from './components/FormJurnal'
import DaftarJurnal from './components/DaftarJurnal'
import Footer from './components/Footer'
import jurnalAwal from './data/jurnalAwal'
import { hitungTotal } from './utils/format'
import './App.css'

function App() {
  const [daftarJurnal, setDaftarJurnal] = useState(jurnalAwal)

  const tambahJurnal = (jurnalBaru) => {
    setDaftarJurnal((sebelumnya) => [{ ...jurnalBaru, id: Date.now() }, ...sebelumnya])
  }

  const hapusJurnal = (id) => {
    setDaftarJurnal((sebelumnya) => sebelumnya.filter((jurnal) => jurnal.id !== id))
  }

  const jumlahHold = daftarJurnal.filter((jurnal) => jurnal.status === 'hold').length
  const jumlahJual = daftarJurnal.filter((jurnal) => jurnal.status === 'jual').length
  const totalNilai = daftarJurnal.reduce((total, jurnal) => total + hitungTotal(jurnal), 0)

  return (
    <>
      <Header
        judul="EquityJournal"
        deskripsi="Catat transaksi saham, alasan beli, dan evaluasinya di satu tempat."
      />
      <main className="kontainer utama">
        <RingkasanJurnal
          total={daftarJurnal.length}
          jumlahHold={jumlahHold}
          jumlahJual={jumlahJual}
          totalNilai={totalNilai}
        />
        <div className="tata-letak">
          <FormJurnal onTambah={tambahJurnal} />
          <DaftarJurnal daftarJurnal={daftarJurnal} onHapus={hapusJurnal} />
        </div>
      </main>
      <Footer namaAplikasi="EquityJournal" tahun={2026} />
    </>
  )
}

export default App
