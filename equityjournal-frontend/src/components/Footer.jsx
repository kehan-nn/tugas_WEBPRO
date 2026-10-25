function Footer({ namaAplikasi, tahun }) {
  return (
    <footer className="footer">
      <p>&copy; {tahun} {namaAplikasi}</p>
    </footer>
  )
}

export default Footer
