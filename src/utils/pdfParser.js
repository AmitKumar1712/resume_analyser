import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

async function extractPdfText(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const pages = []

  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str).join(' ')
    pages.push(text)
  }

  return pages.join('\n\n').replace(/\s+/g, ' ').trim()
}

export async function readTextFromFile(file) {
  if (!file) throw new Error('No file provided.')

  const name = file.name?.toLowerCase() || ''

  if (name.endsWith('.pdf')) {
    try {
      const text = await extractPdfText(file)
      return text || ''
    } catch {
      return ''
    }
  }

  if (name.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value || ''
    } catch {
      return ''
    }
  }

  try {
    return await file.text()
  } catch {
    return ''
  }
}
