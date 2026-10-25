import { formatRupiah, hitungTotal } from '../utils/format'

function KartuJurnal({ ticker, namaPerusahaan, tanggal, harga, lot, sekuritas, status, alasan, onHapus }) {
  const total = hitungTotal({ harga, lot })

  return (
    <article className="kartu">
      <div className="kartu-atas">
        <div>
          <h3 className="kartu-ticker">{ticker}</h3>
          {namaPerusahaan && <p className="kartu-nama">{namaPerusahaan}</p>}
        </div>
        <span className={'lencana ' + status}>{status === 'hold' ? 'Hold' : 'Jual'}</span>
      </div>

      <dl className="kartu-rincian">
        <div>
          <dt>Tanggal</dt>
          <dd>{tanggal}</dd>
        </div>
        <div>
          <dt>Sekuritas</dt>
          <dd>{sekuritas}</dd>
        </div>
        <div>
          <dt>Harga beli</dt>
          <dd>{formatRupiah(harga)}</dd>
        </div>
        <div>
          <dt>Jumlah lot</dt>
          <dd>{lot}</dd>
        </div>
      </dl>

      <p className="kartu-total">{formatRupiah(total)}</p>
      <p className="kartu-alasan">{alasan}</p>

      <button type="button" className="tombol tombol-hapus" onClick={onHapus}>
        Hapus
      </button>
    </article>
  )
}

export default KartuJurnal
