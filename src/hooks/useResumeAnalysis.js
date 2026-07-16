import { useEffect, useMemo, useState } from 'react'
import { analyzeResumeText } from '../services/puterService'
import { validateResumeFile } from '../utils/fileValidation'
import { readTextFromFile } from '../utils/pdfParser'

export default function useResumeAnalysis() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [status, setStatus] = useState('Ready to upload')
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('resume-analysis-history') || '[]')
    } catch {
      return []
    }
  })
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('resume-theme') || 'dark'
  })

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('resume-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('resume-analysis-history', JSON.stringify(history))
  }, [history])

  const hasFile = useMemo(() => Boolean(file), [file])

  const clearHistory = () => {
    setHistory([])
  }

  const handleFileSelect = (nextFile) => {
    setError('')
    if (!nextFile) {
      setFile(null)
      setAnalysis(null)
      return
    }

    const validation = validateResumeFile(nextFile)
    if (!validation.valid) {
      setError(validation.reason)
      return
    }

    setFile(nextFile)
    setAnalysis(null)
  }

  const analyze = async () => {
    if (!file) {
      setError('Please upload a resume first.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setStatus('Uploading Resume...')
    setProgress(10)

    try {
      const text = await readTextFromFile(file)
      setStatus('Reading Resume...')
      setProgress(35)

      const result = await analyzeResumeText(text)
      setStatus('AI is analyzing...')
      setProgress(75)

      setTimeout(() => {
        setAnalysis(result)
        setHistory((prev) => [{ fileName: file.name, score: result.resumeScore, atsScore: result.atsScore, summary: result.summary }, ...prev].slice(0, 5))
        setStatus('Generating Suggestions...')
        setProgress(90)
      }, 600)

      setTimeout(() => {
        setStatus('Finalizing Report...')
        setProgress(100)
        setIsAnalyzing(false)
      }, 1200)
    } catch (err) {
      setError(err.message || 'The analysis failed. Please try again.')
      setStatus('Analysis failed')
      setProgress(0)
      setIsAnalyzing(false)
    }
  }

  return {
    file,
    analysis,
    status,
    error,
    isAnalyzing,
    progress,
    history,
    theme,
    hasFile,
    setTheme,
    handleFileSelect,
    analyze,
    clearHistory,
  }
}
