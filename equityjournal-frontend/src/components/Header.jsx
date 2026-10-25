function Header({ judul, deskripsi }) {
  return (
    <header className="header">
      <div className="kontainer header-isi">
        <h1 className="header-judul">{judul}</h1>
        <p className="header-deskripsi">{deskripsi}</p>
      </div>
    </header>
  )
}

export default Header
