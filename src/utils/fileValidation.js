export function validateResumeFile(file) {
  if (!file) {
    return { valid: false, reason: 'Please choose a resume to upload.' }
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const name = file.name?.toLowerCase() || ''
  const isAccepted = allowedTypes.includes(file.type) || name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx')

  if (!isAccepted) {
    return { valid: false, reason: 'Unsupported file type. Please upload a PDF, DOC, or DOCX file.' }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, reason: 'File is too large. Please upload a file smaller than 5MB.' }
  }

  return { valid: true }
}

export function getFileLabel(file) {
  if (!file) return 'Resume'
  const name = file.name || 'resume'
  const extension = name.split('.').pop()?.toUpperCase() || 'FILE'
  return `${extension} file`
}
