import { useMemo, useState } from 'react'

export default function ResumeUploader({ file, onFileSelect, onAnalyze, isAnalyzing, error, status, progress }) {
  const [dragActive, setDragActive] = useState(false)

  const fileMeta = useMemo(() => {
    if (!file) return null
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2)
    return { name: file.name, size: `${sizeInMb} MB` }
  }, [file])

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) onFileSelect(droppedFile)
  }

  return (
    <section className="uploader-card" id="features">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Resume upload</p>
          <h3>Drop in a resume and start the AI review</h3>
        </div>
      </div>

      <label
        className={`dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => onFileSelect(event.target.files?.[0])} hidden />
        <div className="dropzone-content">
          <div className="dropzone-icon">⬆️</div>
          <h4>Drag and drop your resume</h4>
          <p>PDF, DOC, or DOCX files are supported. Files larger than 5MB are rejected.</p>
        </div>
      </label>

      {fileMeta ? (
        <div className="file-pill">
          <div>
            <strong>{fileMeta.name}</strong>
            <p>{fileMeta.size}</p>
          </div>
          <button className="ghost-btn" onClick={() => onFileSelect(null)} type="button">
            Remove
          </button>
        </div>
      ) : null}

      <div className="uploader-actions">
        <button className="primary-btn" onClick={onAnalyze} type="button" disabled={isAnalyzing || !file}>
          {isAnalyzing ? 'Scanning…' : 'Analyze Resume'}
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {isAnalyzing ? (
        <div className="workflow-card">
          <div className="progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>{status}</p>
        </div>
      ) : null}
    </section>
  )
}
