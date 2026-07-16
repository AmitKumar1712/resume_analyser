const DEFAULT_PROMPT = `You are an expert technical recruiter and resume analyst.
Analyze the provided resume text and return a compact JSON object with these keys:
resumeScore, atsScore, summary, skills, missingSkills, strengths, weaknesses, grammar, keywords, projects, experience, education, suggestions, careerRecommendations.
Use numbers for scores, arrays for lists, and short strings for summary.
If information is missing, keep arrays empty and scores conservative.
`;

function normalizeArray(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return [value]
}

function extractJsonPayload(raw) {
  if (!raw) return null

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const candidate = match?.[1] ?? trimmed
    try {
      return JSON.parse(candidate)
    } catch {
      return null
    }
  }

  if (typeof raw === 'object') {
    if (raw.choices?.[0]?.message?.content) {
      return extractJsonPayload(raw.choices[0].message.content)
    }
    if (raw.message?.content) {
      return extractJsonPayload(raw.message.content)
    }
    if (raw.result) {
      return extractJsonPayload(raw.result)
    }
    if (raw.output) {
      return extractJsonPayload(raw.output)
    }
    return raw
  }

  return null
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildFallbackAnalysis(text) {
  const lowerText = text.toLowerCase()
  const skillCandidates = [
    'javascript', 'react', 'python', 'sql', 'node', 'typescript', 'communication', 'leadership',
    'java', 'c++', 'c#', 'html', 'css', 'tailwind', 'mongodb', 'postgresql', 'docker', 'aws',
    'kubernetes', 'git', 'github', 'api', 'rest', 'graphql', 'nextjs', 'express', 'django', 'flask',
    'machine learning', 'data analysis', 'ui ux', 'testing', 'agile', 'problem solving'
  ]
  const detectedSkills = skillCandidates.filter((skill) => new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i').test(text))
  const missingSkills = ['Docker', 'Kubernetes', 'AWS', 'CI/CD'].filter((skill) => !lowerText.includes(skill.toLowerCase()))

  const hasSummary = /summary|profile|objective|about me/i.test(text)
  const hasSkills = /skills|technologies|tools|stack|programming|frameworks/i.test(text)
  const hasExperience = /experience|employment|work history|job|role|positions/i.test(text)
  const hasEducation = /education|degree|university|college|school|graduation/i.test(text)
  const hasProjects = /project|portfolio|case study/i.test(text)
  const hasAchievements = /achievement|accomplishment|award|certification|certified|awards|internship/i.test(text)
  const hasMetrics = /\b\d+(?:\.\d+)?%|\b\d+\+|\b\d+\s*(years|yrs|yr|months|projects|clients|users|teams)\b/i.test(text)
  const hasActionVerbs = /\b(led|developed|built|designed|implemented|optimized|managed|created|improved|delivered|collaborated|worked|automated)\b/i.test(text)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const sectionScore = [hasSummary, hasSkills, hasExperience, hasEducation, hasProjects].filter(Boolean).length * 12
  const detailScore = (hasMetrics ? 8 : 0) + (hasActionVerbs ? 6 : 0) + (hasAchievements ? 6 : 0) + (wordCount > 250 ? 6 : 0)
  const resumeScore = Math.min(95, 55 + sectionScore + detailScore)
  const atsScore = Math.min(97, 68 + Math.min(10, detectedSkills.length * 2) + (hasSkills ? 8 : 0) + (hasMetrics ? 4 : 0))

  const suggestions = []
  if (!hasSummary) suggestions.push('Add a short professional summary tailored to the role you want.')
  if (!hasSkills) suggestions.push('Create a dedicated skills section with technologies, tools, and soft skills.')
  if (!hasExperience) suggestions.push('Expand your experience section with roles, responsibilities, and outcomes.')
  if (!hasProjects) suggestions.push('Add 2-3 strong project examples with the stack and business impact.')
  if (!hasMetrics) suggestions.push('Add measurable achievements such as growth, efficiency, or revenue impact.')
  if (!hasActionVerbs) suggestions.push('Use stronger action verbs like developed, built, led, and improved.')
  if (!hasAchievements) suggestions.push('Mention certifications, awards, internships, or standout accomplishments.')
  if (suggestions.length < 3) suggestions.push('Add ATS-friendly keywords that match the target role.')

  const grammarIssues = []
  if (/\b(\w+)\s+\1\b/i.test(text)) grammarIssues.push({ issue: 'Repeated words detected.', suggestion: 'Remove duplicate words to improve readability.' })
  if (!/[.!?]/.test(text) && text.length > 80) grammarIssues.push({ issue: 'Resume bullets may need punctuation.', suggestion: 'Add periods or semicolons to make the text easier to read.' })
  if (/[.!?]\s+[a-z]/.test(text)) grammarIssues.push({ issue: 'Sentence capitalization may be inconsistent.', suggestion: 'Start new sentences with uppercase letters.' })
  if (grammarIssues.length === 0) grammarIssues.push({ issue: 'No major grammar issues detected.', suggestion: 'Keep the language concise and consistent.' })

  const resumeAdditions = [
    'Add a concise profile summary tailored to your target role.',
    'Include a bullet with measurable impact such as “increased efficiency by 25%”.',
    'List relevant tools, frameworks, and keywords in a dedicated skills section.',
    'Highlight one project with business impact, stack used, and your contribution.',
  ]

  return {
    resumeScore,
    atsScore,
    summary: hasSummary ? 'This resume presents a solid professional profile with clear growth potential.' : 'This resume would benefit from a stronger summary and a clearer structure.',
    skills: detectedSkills.map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1)),
    missingSkills,
    strengths: [
      hasExperience ? 'Experience section is present' : 'Experience can be strengthened',
      hasSkills ? 'Relevant skills are visible' : 'Skills section should be added',
      hasProjects ? 'Projects are mentioned' : 'Projects should be highlighted',
    ],
    weaknesses: [
      'Add measurable achievements',
      'Include more ATS keywords',
      'Strengthen the summary and project impact',
    ],
    grammar: grammarIssues,
    keywords: ['React', 'JavaScript', 'Leadership', 'Problem Solving', 'SQL'],
    projects: [{ name: 'Project review', insight: 'Add impact metrics and stack details.' }],
    experience: [{ role: 'Experience review', insight: 'Use stronger action verbs and quantify results.' }],
    education: [{ degree: 'Education details', insight: 'Include graduation year and CGPA if available.' }],
    suggestions,
    resumeAdditions,
    careerRecommendations: ['Frontend Developer', 'Full-Stack Developer'],
  }
}

function normalizeAnalysis(parsed, fallback) {
  return {
    resumeScore: Number(parsed?.resumeScore ?? fallback.resumeScore) || fallback.resumeScore,
    atsScore: Number(parsed?.atsScore ?? fallback.atsScore) || fallback.atsScore,
    summary: parsed?.summary || fallback.summary,
    skills: normalizeArray(parsed?.skills || fallback.skills),
    missingSkills: normalizeArray(parsed?.missingSkills || fallback.missingSkills),
    strengths: normalizeArray(parsed?.strengths || fallback.strengths),
    weaknesses: normalizeArray(parsed?.weaknesses || fallback.weaknesses),
    grammar: normalizeArray(parsed?.grammar || fallback.grammar),
    keywords: normalizeArray(parsed?.keywords || fallback.keywords),
    projects: normalizeArray(parsed?.projects || fallback.projects),
    experience: normalizeArray(parsed?.experience || fallback.experience),
    education: normalizeArray(parsed?.education || fallback.education),
    suggestions: normalizeArray(parsed?.suggestions || fallback.suggestions),
    resumeAdditions: normalizeArray(parsed?.resumeAdditions || fallback.resumeAdditions),
    careerRecommendations: normalizeArray(parsed?.careerRecommendations || fallback.careerRecommendations),
  }
}

async function askPuter(text) {
  const prompt = `${DEFAULT_PROMPT}\n\nResume text:\n${text}`
  const payloads = [
    {
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: 'You are a resume analysis assistant that returns strict JSON.' },
        { role: 'user', content: prompt },
      ],
      json: true,
    },
    {
      model: 'gpt-4.1',
      input: prompt,
      system: 'You are a resume analysis assistant that returns strict JSON.',
      json: true,
    },
    prompt,
    { input: prompt, model: 'gpt-4.1' },
  ]

  let lastError = null

  for (const payload of payloads) {
    try {
      const response = await window.puter.ai.chat(payload)
      const parsed = extractJsonPayload(response)
      if (parsed) return parsed
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('AI analysis failed')
}

export async function analyzeResumeText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Resume text is required.')
  }

  const fallback = buildFallbackAnalysis(text)
  const isFallbackMode = !text || text.trim().length < 40
  const fallbackResult = {
    ...fallback,
    analysisNote: isFallbackMode
      ? 'The resume text could not be extracted clearly, so the analysis uses a structure-based review of the document layout and content signals.'
      : 'The analysis is based on the extracted resume content and section structure.',
  }

  if (typeof window === 'undefined' || !window.puter?.ai?.chat) {
    return fallbackResult
  }

  try {
    const parsed = await askPuter(text)
    return {
      ...normalizeAnalysis(parsed, fallback),
      analysisNote: fallbackResult.analysisNote,
    }
  } catch {
    return fallbackResult
  }
}
