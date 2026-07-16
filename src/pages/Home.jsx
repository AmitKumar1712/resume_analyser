import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ResumeUploader from '../components/ResumeUploader'
import ResumeViewer from '../components/ResumeViewer'
import AnalysisCard from '../components/AnalysisCard'
import ScoreCard from '../components/ScoreCard'
import SkillsCard from '../components/SkillsCard'
import SuggestionsCard from '../components/SuggestionsCard'
import Footer from '../components/Footer'

export default function Home({
  file,
  analysis,
  status,
  error,
  isAnalyzing,
  progress,
  history,
  theme,
  hasFile,
  onToggleTheme,
  onFileSelect,
  onAnalyze,
  onClearHistory,
}) {
  const grammarItems = Array.isArray(analysis?.grammar)
    ? analysis.grammar.map((item) => `${item.issue} → ${item.suggestion}`)
    : []

  return (
    <div className="page-shell">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="container">
        <Hero onUploadClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} onAnalyzeClick={onAnalyze} hasFile={hasFile} isAnalyzing={isAnalyzing} />
        <ResumeUploader file={file} onFileSelect={onFileSelect} onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} error={error} status={status} progress={progress} />
        <ResumeViewer file={file} analysis={analysis} />

        {history?.length ? (
          <section className="uploader-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Recent analyses</p>
                <h3>Saved snapshots of your latest resume reviews</h3>
              </div>
              <button className="secondary-btn" onClick={onClearHistory} type="button">Clear snapshots</button>
            </div>
            <div className="chip-list">
              {history.map((item) => (
                <span className="chip" key={`${item.fileName}-${item.score}`}>{item.fileName} • {item.score}/100</span>
              ))}
            </div>
          </section>
        ) : null}

        {analysis ? (
          <section className="uploader-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Resume enhancement guide</p>
                <h3>What to enhance in your resume</h3>
              </div>
            </div>
            <div className="enhancement-grid">
              <div className="enhancement-card">
                <h4>1. Professional Summary</h4>
                <p>Add a short, role-specific summary that highlights your strongest skills, tools, and impact.</p>
              </div>
              <div className="enhancement-card">
                <h4>2. Skills Section</h4>
                <p>Include technical and soft skills clearly, and match them with the job title you want.</p>
              </div>
              <div className="enhancement-card">
                <h4>3. Experience & Projects</h4>
                <p>Show responsibilities, outcomes, technologies used, and business impact in measurable language.</p>
              </div>
              <div className="enhancement-card">
                <h4>4. Metrics & Achievements</h4>
                <p>Use numbers where possible, such as growth, efficiency, revenue, or user impact.</p>
              </div>
            </div>
          </section>
        ) : null}

        {analysis ? (
          <section className="dashboard-grid">
            <ScoreCard label="Resume Score" score={analysis.resumeScore} />
            <ScoreCard label="ATS Score" score={analysis.atsScore} max={100} tone="mint" />
            <AnalysisCard title="Resume Summary" value={analysis.summary} icon="🧠" />
            {analysis.analysisNote ? <AnalysisCard title="Analysis Note" value={analysis.analysisNote} icon="ℹ️" /> : null}
            <SkillsCard title="Skills Detected" items={analysis.skills} emptyText="No skills were detected." />
            <SkillsCard title="Missing Skills" items={analysis.missingSkills} emptyText="No missing skills identified." />
            <SuggestionsCard title="Strengths" items={analysis.strengths} emptyText="No strengths detected." />
            <SuggestionsCard title="Weaknesses" items={analysis.weaknesses} emptyText="No weaknesses detected." />
            <SuggestionsCard title="Grammar Check" items={grammarItems} emptyText="No grammatical errors found." />
            <SuggestionsCard title="Keyword Analysis" items={analysis.keywords} emptyText="No keywords extracted." />
            <SuggestionsCard title="Resume Improvement Suggestions" items={analysis.suggestions} emptyText="No suggestions available." />
            <SuggestionsCard title="Suggested Resume Additions" items={analysis.resumeAdditions} emptyText="No additions suggested." />
            <SuggestionsCard title="Career Recommendations" items={analysis.careerRecommendations} emptyText="No career recommendations available." />
          </section>
        ) : null}

        {analysis ? (
          <section className="uploader-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Report actions</p>
                <h3>Share or save your analysis</h3>
              </div>
            </div>
            <div className="viewer-actions">
              <button className="primary-btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(analysis, null, 2))} type="button">Copy Report</button>
              <button className="secondary-btn" onClick={() => { const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'resume-analysis.json'; link.click(); }} type="button">Download Report</button>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
