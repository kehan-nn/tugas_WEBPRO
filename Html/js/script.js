const LEMBAR_PER_LOT = 100;
const KUNCI_STORAGE = 'equityjournal_jurnal_v1';

const dataAwal = [
  {
    id: 1, tanggal: '2026-09-02', ticker: 'SUPA', nama: 'PT Sumber Alfaria Trijaya',
    harga: 292, lot: 50, sekuritas: 'Stockbit', status: 'hold', jenis: 'reguler',
    plan: 'Beli setelah harga tembus resisten 300 dengan volume naik. TP 340, CL 270.',
    detail: 'detail-supa.html'
  },
  {
    id: 2, tanggal: '2026-09-10', ticker: 'RLCO', nama: 'PT Abadi Lestari Indonesia',
    harga: 855, lot: 20, sekuritas: 'Stockbit', status: 'jual', jenis: 'reguler',
    plan: 'Trading jangka pendek berdasarkan analisis teknikal harga dan volume.',
    detail: 'detail-rlco.html'
  },
  {
    id: 3, tanggal: '2026-09-18', ticker: 'BBCA', nama: 'PT Bank Central Asia Tbk',
    harga: 10150, lot: 10, sekuritas: 'Stockbit', status: 'hold', jenis: 'reguler',
    plan: 'Saham big cap likuid dengan fundamental kuat, strategi jangka menengah-panjang.',
    detail: 'detail-bbca.html'
  },
  {
    id: 4, tanggal: '2026-09-24', ticker: 'ANTM', nama: 'PT Aneka Tambang Tbk',
    harga: 1590, lot: 30, sekuritas: 'Stockbit', status: 'jual', jenis: 'reguler',
    plan: 'Momentum teknikal dan harga komoditas. Level TP dan CL ditetapkan sejak awal.',
    detail: 'detail-antm.html'
  }
];

function muatData() {
  try {
    const mentah = localStorage.getItem(KUNCI_STORAGE);
    if (mentah) {
      const hasil = JSON.parse(mentah);
      if (Array.isArray(hasil)) return hasil;
    }
  } catch (e) { /* storage tidak tersedia jadi pakai data dummy */ }
  return dataAwal.map(function (d) { return Object.assign({}, d); });
}

function simpanData(data) {
  try { localStorage.setItem(KUNCI_STORAGE, JSON.stringify(data)); } catch (e) { /* abaikan */ }
}

let jurnal = muatData();

function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function hitungTotal(item) {
  return item.harga * item.lot * LEMBAR_PER_LOT;
}

function hitungRingkasan(data) {
  const hasil = { total: data.length, jumlahHold: 0, jumlahJual: 0, nilaiHold: 0, nilaiJual: 0, nilaiTotal: 0 };
  for (const item of data) {
    const nilai = hitungTotal(item);
    hasil.nilaiTotal += nilai;
    if (item.status === 'hold') {
      hasil.jumlahHold++;
      hasil.nilaiHold += nilai;
    } else {
      hasil.jumlahJual++;
      hasil.nilaiJual += nilai;
    }
  }
  return hasil;
}

function filterData(data, status, kata) {
  const kunci = (kata || '').trim().toUpperCase();
  return data.filter(function (item) {
    const cocokStatus = (status === 'semua') || (item.status === status);
    const cocokKata = kunci === '' || item.ticker.indexOf(kunci) !== -1;
    return cocokStatus && cocokKata;
  });
}

function urutkanData(data, mode) {
  const salinan = data.slice();
  salinan.sort(function (a, b) {
    switch (mode) {
      case 'tanggal-asc':  return a.tanggal.localeCompare(b.tanggal) || a.id - b.id;
      case 'nilai-desc':   return hitungTotal(b) - hitungTotal(a);
      case 'nilai-asc':    return hitungTotal(a) - hitungTotal(b);
      default:             return b.tanggal.localeCompare(a.tanggal) || b.id - a.id; // tanggal-desc
    }
  });
  return salinan;
}

function esc(teks) {
  return String(teks).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function badgeStatus(status) {
  return status === 'hold'
    ? '<span class="badge text-bg-success">Hold</span>'
    : '<span class="badge text-bg-danger">Jual</span>';
}

function tickerHtml(item) {
  return item.detail
    ? '<a href="' + item.detail + '" class="ticker">' + esc(item.ticker) + '</a>'
    : '<span class="ticker">' + esc(item.ticker) + '</span>';
}

function renderDashboard() {
  const r = hitungRingkasan(jurnal);

  const kartu = [
    { label: 'Total transaksi', isi: r.total, kelas: '' },
    { label: 'Posisi Hold', isi: r.jumlahHold, kelas: '' },
    { label: 'Posisi Jual', isi: r.jumlahJual, kelas: 'jual' },
    { label: 'Total nilai beli', isi: formatRupiah(r.nilaiTotal), kelas: '' }
  ];
  let htmlKartu = '';
  for (const k of kartu) {
    htmlKartu +=
      '<div class="col-12 col-sm-6 col-lg-3">' +
        '<div class="card kartu-stat ' + k.kelas + ' h-100"><div class="card-body">' +
          '<div class="text-secondary small">' + k.label + '</div>' +
          '<div class="angka">' + k.isi + '</div>' +
        '</div></div>' +
      '</div>';
  }
  $('#dash-stat').html(htmlKartu);

  const terbaru = urutkanData(jurnal, 'tanggal-desc').slice(0, 5);
  let htmlTerbaru = '';
  if (terbaru.length === 0) {
    htmlTerbaru = '<li class="list-group-item text-secondary">Belum ada transaksi. Tambahkan jurnal pertama Anda.</li>';
  }
  for (const item of terbaru) {
    htmlTerbaru +=
      '<li class="list-group-item d-flex justify-content-between align-items-center gap-2">' +
        '<div>' + tickerHtml(item) +
          '<div class="small text-secondary">' + item.tanggal + ' &middot; ' + item.lot + ' lot @ ' + formatRupiah(item.harga) + '</div></div>' +
        '<div class="text-end"><div class="fw-semibold">' + formatRupiah(hitungTotal(item)) + '</div>' + badgeStatus(item.status) + '</div>' +
      '</li>';
  }
  $('#dash-terbaru').html(htmlTerbaru);

  const persenHold = r.nilaiTotal > 0 ? Math.round(r.nilaiHold / r.nilaiTotal * 100) : 0;
  const persenJual = r.nilaiTotal > 0 ? 100 - persenHold : 0;
  $('#bar-hold').css('width', persenHold + '%');
  $('#bar-jual').css('width', persenJual + '%');
  $('#bar-komposisi').attr('aria-valuenow', persenHold);
  $('#teks-hold').text('Hold ' + formatRupiah(r.nilaiHold));
  $('#teks-jual').text('Jual ' + formatRupiah(r.nilaiJual));

  const posisiHold = filterData(jurnal, 'hold', '');
  let htmlHold = '';
  if (posisiHold.length === 0) {
    htmlHold = '<li class="list-group-item text-secondary">Tidak ada posisi Hold.</li>';
  }
  for (const item of posisiHold) {
    htmlHold +=
      '<li class="list-group-item d-flex justify-content-between">' +
        tickerHtml(item) + '<span>' + formatRupiah(hitungTotal(item)) + '</span>' +
      '</li>';
  }
  $('#dash-hold').html(htmlHold);
}

const filterRiwayat = { status: 'semua', kata: '', urut: 'tanggal-desc' };

function barisTabel(item) {
  const total = hitungTotal(item);
  return (
    '<tr data-id="' + item.id + '">' +
      '<td>' + item.tanggal + '</td>' +
      '<td>' + tickerHtml(item) + '</td>' +
      '<td class="text-end">' + formatRupiah(item.harga) + '</td>' +
      '<td class="text-end">' + item.lot + '</td>' +
      '<td class="text-end">' + formatRupiah(total) + '</td>' +
      '<td class="text-center">' + badgeStatus(item.status) + '</td>' +
      '<td class="text-center text-nowrap">' +
        '<button type="button" class="btn btn-sm btn-outline-secondary btn-detail" data-id="' + item.id + '">Detail</button> ' +
        '<button type="button" class="btn btn-sm btn-outline-danger btn-hapus" data-id="' + item.id + '">Hapus</button>' +
      '</td>' +
    '</tr>' +
    '<tr class="baris-detail d-none" data-detail="' + item.id + '">' +
      '<td colspan="7"><div class="isi-detail" style="display:none">' +
        '<div class="row g-2 small">' +
          '<div class="col-12 col-md-4"><strong>Perusahaan:</strong> ' + esc(item.nama || '-') + '</div>' +
          '<div class="col-12 col-md-4"><strong>Sekuritas:</strong> ' + esc(item.sekuritas) + '</div>' +
          '<div class="col-12 col-md-4"><strong>Jenis:</strong> ' + (item.jenis === 'ipo' ? 'Penjatahan IPO' : 'Beli Reguler') + '</div>' +
          '<div class="col-12"><strong>Alasan beli / trading plan:</strong> ' + esc(item.plan || '-') + '</div>' +
        '</div>' +
      '</div></td>' +
    '</tr>'
  );
}

function renderRiwayat() {
  const hasil = urutkanData(filterData(jurnal, filterRiwayat.status, filterRiwayat.kata), filterRiwayat.urut);

  let html = '';
  if (hasil.length === 0) {
    html = '<tr><td colspan="7" class="text-center text-secondary py-4">Tidak ada transaksi yang cocok dengan filter.</td></tr>';
  }
  for (const item of hasil) {
    html += barisTabel(item);
  }
  $('#tabel-riwayat-body').html(html);

  const r = hitungRingkasan(jurnal);
  $('#jml-semua').text(r.total);
  $('#jml-hold').text(r.jumlahHold);
  $('#jml-jual').text(r.jumlahJual);

  let totalNilaiTampil = 0;
  for (const item of hasil) { totalNilaiTampil += hitungTotal(item); }
  $('#ringkasan-tabel').text(
    'Menampilkan ' + hasil.length + ' dari ' + jurnal.length + ' transaksi \u00b7 Total nilai: ' + formatRupiah(totalNilaiTampil)
  );
}

function validasiForm(nilai) {
  const error = [];
  if (nilai.tanggal === '') {
    error.push({ id: 'tanggal', pesan: 'Tanggal transaksi wajib diisi.' });
  }
  if (nilai.ticker === '') {
    error.push({ id: 'ticker', pesan: 'Kode saham wajib diisi.' });
  } else if (!/^[A-Z]{4}$/.test(nilai.ticker)) {
    error.push({ id: 'ticker', pesan: 'Kode saham harus 4 huruf (contoh: SUPA).' });
  }
  if (nilai.lot === '') {
    error.push({ id: 'jumlah-lot', pesan: 'Jumlah lot wajib diisi.' });
  } else if (!(Number(nilai.lot) >= 1) || Number(nilai.lot) % 1 !== 0) {
    error.push({ id: 'jumlah-lot', pesan: 'Jumlah lot harus bilangan bulat minimal 1.' });
  }
  if (nilai.harga === '') {
    error.push({ id: 'harga-beli', pesan: 'Harga beli wajib diisi.' });
  } else if (!(Number(nilai.harga) >= 1)) {
    error.push({ id: 'harga-beli', pesan: 'Harga beli harus lebih dari 0.' });
  }
  if (nilai.plan === '') {
    error.push({ id: 'trading-plan', pesan: 'Alasan beli / trading plan wajib diisi.' });
  } else if (nilai.plan.length < 10) {
    error.push({ id: 'trading-plan', pesan: 'Tuliskan alasan minimal 10 karakter.' });
  }
  return error;
}

$(function () {

  if ($('#dash-stat').length) {
    renderDashboard();
    $('#dash-stat').hide().fadeIn(500);

    $('#btn-toggle-ringkasan').on('click', function () {
      const $tombol = $(this);
      $('#dash-stat').slideToggle(300, function () {
        $tombol.text($(this).is(':visible') ? 'Sembunyikan ringkasan' : 'Tampilkan ringkasan');
      });
    });
  }

  if ($('#tabel-riwayat-body').length) {
    let idHapus = null;
    const modalHapus = new bootstrap.Modal(document.getElementById('modal-hapus'));

    function tampilNotif(pesan, jenis) {
      $('#notif')
        .removeClass('alert-success alert-warning alert-danger')
        .addClass('alert-' + jenis)
        .text(pesan)
        .stop(true, true).fadeIn(250).delay(3000).fadeOut(400);
    }

    renderRiwayat();

    $('.btn-filter').on('click', function () {
      $('.btn-filter').removeClass('active');
      $(this).addClass('active');
      filterRiwayat.status = $(this).data('status');
      renderRiwayat();
    });

    $('#cari-ticker').on('input', function () {
      filterRiwayat.kata = $(this).val();
      renderRiwayat();
    });
    $('#urut-data').on('change', function () {
      filterRiwayat.urut = $(this).val();
      renderRiwayat();
    });

    $(document).on('click', '.btn-detail', function () {
      const id = $(this).data('id');
      const $baris = $('tr.baris-detail[data-detail="' + id + '"]');
      const $isi = $baris.find('.isi-detail');
      const $tombol = $(this);
      if ($baris.hasClass('d-none')) {
        $baris.removeClass('d-none');
        $isi.slideDown(250);
        $tombol.text('Tutup');
      } else {
        $isi.slideUp(250, function () { $baris.addClass('d-none'); });
        $tombol.text('Detail');
      }
    });

    $(document).on('click', '.btn-hapus', function () {
      idHapus = Number($(this).data('id'));
      const item = jurnal.find(function (j) { return j.id === idHapus; });
      if (item) {
        $('#teks-hapus').text(item.ticker + ' (' + item.tanggal + ', ' + item.lot + ' lot)');
        modalHapus.show();
      }
    });

    $('#konfirmasi-hapus').on('click', function () {
      modalHapus.hide();
      const item = jurnal.find(function (j) { return j.id === idHapus; });
      const $baris = $('tr[data-id="' + idHapus + '"], tr[data-detail="' + idHapus + '"]');
      $baris.fadeOut(400).promise().done(function () {
        jurnal = jurnal.filter(function (j) { return j.id !== idHapus; });
        simpanData(jurnal);
        renderRiwayat();
        if (item) { tampilNotif('Jurnal ' + item.ticker + ' berhasil dihapus dari tampilan.', 'warning'); }
      });
    });

    $('#btn-reset-data').on('click', function () {
      jurnal = dataAwal.map(function (d) { return Object.assign({}, d); });
      simpanData(jurnal);
      renderRiwayat();
      tampilNotif('Data dikembalikan ke data awal.', 'success');
    });
  }

  if ($('#form-jurnal').length) {
    const $form = $('#form-jurnal');

    function bersihkanValidasi() {
      $form.find('.is-invalid').removeClass('is-invalid');
      $('#alert-error').stop(true, true).slideUp(200);
    }

    function updatePreview() {
      const lot = Number($('#jumlah-lot').val());
      const harga = Number($('#harga-beli').val());
      if (lot >= 1 && harga >= 1) {
        $('#preview-total').text('Estimasi total nilai: ' + formatRupiah(harga * lot * LEMBAR_PER_LOT) +
          ' (' + lot + ' lot x ' + LEMBAR_PER_LOT + ' lembar x ' + formatRupiah(harga) + ')').slideDown(200);
      } else {
        $('#preview-total').slideUp(200);
      }
    }

    $('#ticker').on('input', function () {
      $(this).val($(this).val().toUpperCase().replace(/[^A-Z]/g, ''));
    });
    $('#jumlah-lot, #harga-beli').on('input', updatePreview);

    $form.on('input change', '.is-invalid', function () {
      $(this).removeClass('is-invalid');
    });

    $('#btn-panduan').on('click', function () {
      const $tombol = $(this);
      $('#panduan').slideToggle(250, function () {
        $tombol.text($(this).is(':visible') ? 'Sembunyikan panduan' : 'Lihat panduan pengisian');
      });
    });

    $form.on('submit', function (e) {
      e.preventDefault();
      bersihkanValidasi();
      $('#alert-sukses').hide();

      const nilai = {
        tanggal: $('#tanggal').val().trim(),
        ticker: $('#ticker').val().trim().toUpperCase(),
        lot: $('#jumlah-lot').val().trim(),
        harga: $('#harga-beli').val().trim(),
        plan: $('#trading-plan').val().trim()
      };
      const daftarError = validasiForm(nilai);

      if (daftarError.length > 0) {
        for (const err of daftarError) {
          $('#' + err.id).addClass('is-invalid').siblings('.invalid-feedback').text(err.pesan);
        }
        $('#alert-error-teks').text('Ada ' + daftarError.length + ' isian yang belum benar. Periksa kolom bertanda merah.');
        $('#alert-error').hide().slideDown(250);
        $('#' + daftarError[0].id).trigger('focus');
        return;
      }

      const idBaru = jurnal.reduce(function (maks, j) { return Math.max(maks, j.id); }, 0) + 1;
      const serupa = jurnal.find(function (j) { return j.ticker === nilai.ticker && j.nama; });
      jurnal.push({
        id: idBaru,
        tanggal: nilai.tanggal,
        ticker: nilai.ticker,
        nama: serupa ? serupa.nama : '',
        harga: Number(nilai.harga),
        lot: Number(nilai.lot),
        sekuritas: $('#sekuritas option:selected').text(),
        status: $('#status').val(),
        jenis: $('input[name="jenis-transaksi"]:checked').val(),
        plan: nilai.plan,
        detail: ''
      });
      simpanData(jurnal);

      $('#sukses-teks').text('Jurnal ' + nilai.ticker + ' (' + formatRupiah(Number(nilai.harga) * Number(nilai.lot) * LEMBAR_PER_LOT) + ') berhasil disimpan.');
      $('#alert-sukses').fadeIn(300);
      $form[0].reset();
      $('#preview-total').hide();
      $('html, body').animate({ scrollTop: 0 }, 300);
    });

    $form.on('reset', function () {
      bersihkanValidasi();
      $('#alert-sukses').hide();
      $('#preview-total').slideUp(150);
    });

    $('#tutup-sukses').on('click', function () {
      $('#alert-sukses').fadeOut(250);
    });
  }

  if ($('#btn-toggle-evaluasi').length) {
    $('#btn-toggle-evaluasi').on('click', function () {
      const $tombol = $(this);
      $('#isi-evaluasi').slideToggle(300, function () {
        $tombol.text($(this).is(':visible') ? 'Sembunyikan' : 'Tampilkan');
      });
    });
  }
});