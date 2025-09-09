export interface ParsedResume {
  text: string
  fileName: string
  uploadDate: Date
}

export async function parsePDF(file: File): Promise<ParsedResume> {
  try {
    // Create FormData to send the file to our API
    const formData = new FormData()
    formData.append('file', file)

    // Send the file to our API route for parsing
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to parse PDF')
    }

    const result = await response.json()
    
    return {
      text: result.text,
      fileName: result.fileName,
      uploadDate: new Date(result.uploadDate)
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to parse PDF: ' + (error as Error).message)
  }
}

export function extractResumeSections(text: string) {
  const sections = {
    contact: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: ''
  }
  
  // Extract contact information (email, phone, location)
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g)
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g)
  
  if (emailMatch) sections.contact += `Email: ${emailMatch.join(', ')}\n`
  if (phoneMatch) sections.contact += `Phone: ${phoneMatch.join(', ')}\n`
  
  // Extract sections based on common headers
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  let currentSection = ''
  let currentContent = ''
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    // Check for section headers
    if (lowerLine.includes('summary') || lowerLine.includes('objective') || lowerLine.includes('profile')) {
      if (currentSection && currentContent) {
        sections[currentSection as keyof typeof sections] = currentContent.trim()
      }
      currentSection = 'summary'
      currentContent = ''
    } else if (lowerLine.includes('experience') || lowerLine.includes('work history') || lowerLine.includes('employment')) {
      if (currentSection && currentContent) {
        sections[currentSection as keyof typeof sections] = currentContent.trim()
      }
      currentSection = 'experience'
      currentContent = ''
    } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
      if (currentSection && currentContent) {
        sections[currentSection as keyof typeof sections] = currentContent.trim()
      }
      currentSection = 'education'
      currentContent = ''
    } else if (lowerLine.includes('skills') || lowerLine.includes('technical skills') || lowerLine.includes('competencies')) {
      if (currentSection && currentContent) {
        sections[currentSection as keyof typeof sections] = currentContent.trim()
      }
      currentSection = 'skills'
      currentContent = ''
    } else if (lowerLine.includes('projects') || lowerLine.includes('portfolio')) {
      if (currentSection && currentContent) {
        sections[currentSection as keyof typeof sections] = currentContent.trim()
      }
      currentSection = 'projects'
      currentContent = ''
    } else if (lowerLine.includes('certification') || lowerLine.includes('certificates')) {
      if (currentSection && currentContent) {
        sections[currentSection as keyof typeof sections] = currentContent.trim()
      }
      currentSection = 'certifications'
      currentContent = ''
    } else if (currentSection) {
      currentContent += line + '\n'
    }
  }
  
  // Add the last section
  if (currentSection && currentContent) {
    sections[currentSection as keyof typeof sections] = currentContent.trim()
  }
  
  return sections
}
