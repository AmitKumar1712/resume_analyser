import { useMemo, useState } from 'react'

export default function ResumeViewer({ file, analysis }) {
  const [zoom, setZoom] = useState(1)

  const previewUrl = useMemo(() => {
    if (!file) return ''
    return URL.createObjectURL(file)
  }, [file])

  const handleDownload = () => {
    if (!file) return
    const link = document.createElement('a')
    link.href = previewUrl
    link.download = file.name
    link.click()
  }

  const handleFullscreen = () => {
    const element = document.getElementById('resume-preview')
    if (element?.requestFullscreen) element.requestFullscreen()
  }

  if (!file) {
    return (
      <section className="viewer-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Resume preview</p>
            <h3>Upload a resume to preview it here</h3>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="viewer-card" id="insights">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Resume preview</p>
          <h3>{file.name}</h3>
        </div>
        <div className="viewer-actions">
          <button className="ghost-btn" onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))} type="button">Zoom −</button>
          <button className="ghost-btn" onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))} type="button">Zoom +</button>
          <button className="ghost-btn" onClick={handleDownload} type="button">Download</button>
          <button className="ghost-btn" onClick={handleFullscreen} type="button">Full Screen</button>
        </div>
      </div>

      <div className="preview-frame" id="resume-preview">
        {file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ? (
          <iframe title="Resume Preview" src={previewUrl} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} />
        ) : (
          <div className="preview-placeholder">
            <h4>Preview is available for PDF uploads.</h4>
            <p>The file is stored locally and can still be analyzed by the AI engine.</p>
            {analysis?.summary ? <p className="summary-text">{analysis.summary}</p> : null}
          </div>
        )}
      </div>
    </section>
  )
}
