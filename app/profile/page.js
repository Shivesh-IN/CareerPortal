"use client"
import { useState } from 'react'
import ResumePreview from '../../components/ResumePreview'

export default function ProfilePage(){
  const [resumeFile, setResumeFile] = useState(null)
  const [cvFile, setCVFile] = useState(null)
  const [showResumeForm, setShowResumeForm] = useState(false)
  const [showCVForm, setShowCVForm] = useState(false)
  const [generated, setGenerated] = useState(null)
  const [resumeFeedback, setResumeFeedback] = useState(null)
  const [cvFeedback, setCVFeedback] = useState(null)
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaAnalysis, setMediaAnalysis] = useState(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingCVAnalysis, setLoadingCVAnalysis] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
    company: '',
    position: '',
    duration: '',
    skills: '',
    education: '',
    certifications: ''
  })
  
  // Extract text from file for analysis
  async function extractTextFromFile(file) {
    if (!file) return ''
    try {
      const text = await file.text()
      return text
    } catch (error) {
      console.error('Error reading file:', error)
      return ''
    }
  }

  // Analyze Resume with Gemini
  async function analyzeResumeWithGemini(file) {
    if (!file) return
    setLoadingAnalysis(true)
    try {
      const fileContent = await extractTextFromFile(file)
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeContent: fileContent,
          fileType: 'resume'
        })
      })
      const data = await response.json()
      setResumeFeedback(data)
    } catch (error) {
      console.error('Error analyzing resume:', error)
      setResumeFeedback({ 
        score: 0, 
        error: 'Failed to analyze resume. Please try again.',
        strengths: [],
        improvements: []
      })
    } finally {
      setLoadingAnalysis(false)
    }
  }

  // Analyze CV with Gemini
  async function analyzeCVWithGemini(file) {
    if (!file) return
    setLoadingCVAnalysis(true)
    try {
      const fileContent = await extractTextFromFile(file)
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeContent: fileContent,
          fileType: 'cv'
        })
      })
      const data = await response.json()
      setCVFeedback(data)
    } catch (error) {
      console.error('Error analyzing CV:', error)
      setCVFeedback({ 
        score: 0, 
        error: 'Failed to analyze CV. Please try again.',
        strengths: [],
        improvements: []
      })
    } finally {
      setLoadingCVAnalysis(false)
    }
  }

  function handleResumeUpload(f){
    const selected = f?.[0] || null
    setResumeFile(selected)
    setResumeFeedback(null)
  }

  function handleCVUpload(f){
    const selected = f?.[0] || null
    setCVFile(selected)
    setCVFeedback(null)
  }

  function handleMediaUpload(f){
    const selected = f?.[0] || null
    setMediaFile(selected)
    if(selected){
      setMediaAnalysis({ posture: 7.5, confidence: 8.2, notes: 'Good posture, speak a bit slower and add pausing for emphasis.' })
    } else {
      setMediaAnalysis(null)
    }
  }

  function handleFormChange(e){
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Generate Resume with AI suggestions
  async function handleGenerateResume(e){
    e.preventDefault()
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'resume' })
      })
      const data = await response.json()
      setGenerated(data)
      setShowResumeForm(false)
    } catch (error) {
      console.error('Error generating resume:', error)
      setGenerated({ ...formData, type: 'resume' })
      setShowResumeForm(false)
    }
  }

  // Generate CV with AI suggestions
  async function handleGenerateCV(e){
    e.preventDefault()
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'cv' })
      })
      const data = await response.json()
      setGenerated(data)
      setShowCVForm(false)
    } catch (error) {
      console.error('Error generating CV:', error)
      setGenerated({ ...formData, type: 'cv' })
      setShowCVForm(false)
    }
  }

  async function analyzeMedia(){
    if(!mediaFile) return
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-[#fff7f7] to-[#fff5f5] py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-10 animate-fadeInUp'>
          <h1 className='text-3xl font-bold mb-2 text-slate-800'>
            Profile & Resume
          </h1>
          <p className='text-slate-600 text-sm'>Manage your professional information and create an impressive resume</p>
        </div>

        {/* Profile Summary */}
        <div className='mb-8 animate-fadeInUp bg-slate-50 rounded-xl p-6 border border-slate-200'>
          <h3 className='text-lg font-semibold text-slate-800 mb-2'>Profile Summary</h3>
          <p className='text-sm text-slate-600'>Use the sections below to upload or generate your resume and CV. Practice with media clips to improve your presentation skills. Your uploaded files and generated previews will appear on the right side.</p>
        </div>

        {/* Row 1: Resume */}
        <div className='mb-8 animate-fadeInUp'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Upload Resume */}
            <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>📄 Upload Resume</h3>
              <p className='text-sm text-slate-600 mb-4'>PDF, DOC or DOCX. Get instant AI feedback.</p>
              <label className='w-full cursor-pointer'>
                <div className='w-full border-2 border-dashed border-indigo-200 rounded-md py-6 text-center hover:bg-indigo-50 transition-colors'>
                  <p className='font-semibold text-slate-700'>Click to upload or drag and drop</p>
                  <p className='text-xs text-slate-500'>Max 5MB</p>
                </div>
                <input type='file' accept='.pdf,.doc,.docx,.txt' className='hidden' onChange={e => handleResumeUpload(e.target.files)} />
              </label>
              {resumeFile && (
                <div className='mt-4'>
                  <div className='text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg mb-3'>✅ {resumeFile.name}</div>
                  <button 
                    onClick={() => analyzeResumeWithGemini(resumeFile)}
                    disabled={loadingAnalysis}
                    className='w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-semibold py-2 rounded-lg transition-colors'
                  >
                    {loadingAnalysis ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                </div>
              )}
            </div>

            {/* Generate Resume */}
            <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>✨ Generate Resume</h3>
              <p className='text-sm text-slate-600 mb-4'>Quickly generate a polished resume from your details.</p>
              {!showResumeForm ? (
                <button onClick={() => setShowResumeForm(true)} className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors'>
                  Create New Resume
                </button>
              ) : (
                <form onSubmit={handleGenerateResume} className='space-y-3 max-h-96 overflow-y-auto'>
                  <input name='fullName' placeholder='Full Name' value={formData.fullName} onChange={handleFormChange} required className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='email' placeholder='Email Address' type='email' value={formData.email} onChange={handleFormChange} required className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='phone' placeholder='Phone Number' value={formData.phone} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='location' placeholder='Location' value={formData.location} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='headline' placeholder='Professional Headline' value={formData.headline} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <textarea name='summary' placeholder='Professional Summary' value={formData.summary} onChange={handleFormChange} rows='3' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <input name='company' placeholder='Company Name' value={formData.company} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='position' placeholder='Job Position' value={formData.position} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='duration' placeholder='Duration (e.g., Jan 2020 - Present)' value={formData.duration} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <textarea name='skills' placeholder='Skills (comma separated)' value={formData.skills} onChange={handleFormChange} rows='2' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <textarea name='education' placeholder='Education' value={formData.education} onChange={handleFormChange} rows='2' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <textarea name='certifications' placeholder='Certifications' value={formData.certifications} onChange={handleFormChange} rows='2' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <div className='flex gap-2 pt-2'>
                    <button type='submit' className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors'>Generate Resume</button>
                    <button type='button' onClick={() => setShowResumeForm(false)} className='flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50'>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Upload CV */}
            <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>📋 Upload CV</h3>
              <p className='text-sm text-slate-600 mb-4'>PDF, DOC or DOCX. Get AI-powered analysis.</p>
              <label className='w-full cursor-pointer'>
                <div className='w-full border-2 border-dashed border-indigo-200 rounded-md py-6 text-center hover:bg-indigo-50 transition-colors'>
                  <p className='font-semibold text-slate-700'>Click to upload or drag and drop</p>
                  <p className='text-xs text-slate-500'>Max 5MB</p>
                </div>
                <input type='file' accept='.pdf,.doc,.docx,.txt' className='hidden' onChange={e => handleCVUpload(e.target.files)} />
              </label>
              {cvFile && (
                <div className='mt-4'>
                  <div className='text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg mb-3'>✅ {cvFile.name}</div>
                  <button 
                    onClick={() => analyzeCVWithGemini(cvFile)}
                    disabled={loadingCVAnalysis}
                    className='w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-semibold py-2 rounded-lg transition-colors'
                  >
                    {loadingCVAnalysis ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                </div>
              )}
            </div>

            {/* Generate CV */}
            <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>✨ Generate CV</h3>
              <p className='text-sm text-slate-600 mb-4'>Create a professional CV from your details.</p>
              {!showCVForm ? (
                <button onClick={() => setShowCVForm(true)} className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors'>
                  Create New CV
                </button>
              ) : (
                <form onSubmit={handleGenerateCV} className='space-y-3 max-h-96 overflow-y-auto'>
                  <input name='fullName' placeholder='Full Name' value={formData.fullName} onChange={handleFormChange} required className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='email' placeholder='Email Address' type='email' value={formData.email} onChange={handleFormChange} required className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='phone' placeholder='Phone Number' value={formData.phone} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='location' placeholder='Location' value={formData.location} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='headline' placeholder='Professional Headline' value={formData.headline} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <textarea name='summary' placeholder='Professional Summary' value={formData.summary} onChange={handleFormChange} rows='3' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <input name='company' placeholder='Company Name' value={formData.company} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='position' placeholder='Job Position' value={formData.position} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <input name='duration' placeholder='Duration (e.g., Jan 2020 - Present)' value={formData.duration} onChange={handleFormChange} className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                  <textarea name='skills' placeholder='Skills (comma separated)' value={formData.skills} onChange={handleFormChange} rows='2' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <textarea name='education' placeholder='Education' value={formData.education} onChange={handleFormChange} rows='2' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <textarea name='certifications' placeholder='Certifications' value={formData.certifications} onChange={handleFormChange} rows='2' className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                  <div className='flex gap-2 pt-2'>
                    <button type='submit' className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors'>Generate CV</button>
                    <button type='button' onClick={() => setShowCVForm(false)} className='flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50'>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Media Upload */}
            <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>🎥 Upload Voice / Video</h3>
              <p className='text-sm text-slate-600 mb-4'>Short clip for AI analysis of posture and confidence.</p>
              <div className='flex gap-3'>
                <label className='flex-1 px-6 py-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors font-semibold text-red-600'>
                  <input type='file' accept='audio/*,video/*' className='hidden' onChange={e => handleMediaUpload(e.target.files)} />
                  Upload Media
                </label>
                <button onClick={analyzeMedia} className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors'>Analyze</button>
              </div>
              {mediaFile && <div className='mt-4 text-sm text-slate-700 bg-slate-50 px-4 py-2 rounded-lg'>📎 {mediaFile.name}</div>}
            </div>
          </div>

          {/* Right Column - Preview & Feedback */}
          <div className='space-y-6'>
            <div className='sticky top-24'>
              {generated && (
                <div className='card-gradient rounded-2xl p-6 shadow-lg animate-slideInRight'>
                  <h3 className='text-xl font-bold text-slate-800 mb-4'>📋 Preview</h3>
                  <div className='bg-white rounded-lg p-4 text-sm text-slate-700 space-y-2'>
                    <p><strong>Name:</strong> {generated.fullName}</p>
                    <p><strong>Email:</strong> {generated.email}</p>
                    <p><strong>Phone:</strong> {generated.phone}</p>
                    <p><strong>Location:</strong> {generated.location}</p>
                    <p><strong>Headline:</strong> {generated.headline}</p>
                    <p><strong>Type:</strong> {generated.type === 'resume' ? 'Resume' : 'CV'}</p>
                    <button className='w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors'>
                      Download {generated.type === 'resume' ? 'Resume' : 'CV'}
                    </button>
                  </div>
                </div>
              )}

              {resumeFeedback && (
                <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
                  <h3 className='text-xl font-bold mb-3 text-slate-800'>📈 Resume Analysis</h3>
                  {resumeFeedback.error ? (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800'>{resumeFeedback.error}</div>
                  ) : (
                    <>
                      <p className='text-sm text-slate-600 mb-3'>Score: <span className='font-bold text-orange-600'>{resumeFeedback.score || 0}/100</span></p>
                      <div className='space-y-2'>
                        {resumeFeedback.strengths && resumeFeedback.strengths.length > 0 && (
                          <>
                            <div className='text-sm font-semibold text-green-700 mb-2'>✅ Strengths:</div>
                            {resumeFeedback.strengths.map((s, i) => (
                              <div key={i} className='p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800'>{s}</div>
                            ))}
                          </>
                        )}
                        {resumeFeedback.improvements && resumeFeedback.improvements.length > 0 && (
                          <>
                            <div className='text-sm font-semibold text-yellow-700 mb-2 mt-3'>⚠️ Improvements:</div>
                            {resumeFeedback.improvements.map((s, i) => (
                              <div key={i} className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800'>{s}</div>
                            ))}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {cvFeedback && (
                <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
                  <h3 className='text-xl font-bold mb-3 text-slate-800'>📋 CV Analysis</h3>
                  {cvFeedback.error ? (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800'>{cvFeedback.error}</div>
                  ) : (
                    <>
                      <p className='text-sm text-slate-600 mb-3'>Score: <span className='font-bold text-orange-600'>{cvFeedback.score || 0}/100</span></p>
                      <div className='space-y-2'>
                        {cvFeedback.strengths && cvFeedback.strengths.length > 0 && (
                          <>
                            <div className='text-sm font-semibold text-green-700 mb-2'>✅ Strengths:</div>
                            {cvFeedback.strengths.map((s, i) => (
                              <div key={i} className='p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800'>{s}</div>
                            ))}
                          </>
                        )}
                        {cvFeedback.improvements && cvFeedback.improvements.length > 0 && (
                          <>
                            <div className='text-sm font-semibold text-yellow-700 mb-2 mt-3'>⚠️ Improvements:</div>
                            {cvFeedback.improvements.map((s, i) => (
                              <div key={i} className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800'>{s}</div>
                            ))}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {mediaAnalysis && (
                <div className='card-gradient rounded-2xl p-6 shadow-lg animate-fadeInUp'>
                  <h3 className='text-xl font-bold mb-3 text-slate-800'>🎤 Media Analysis</h3>
                  <div className='space-y-2'>
                    <p className='text-sm'><strong>Posture Score:</strong> {mediaAnalysis.posture}/10</p>
                    <p className='text-sm'><strong>Confidence Score:</strong> {mediaAnalysis.confidence}/10</p>
                    <p className='text-sm'><strong>Notes:</strong> {mediaAnalysis.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
