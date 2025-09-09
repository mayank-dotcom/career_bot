import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use pdf-parse with dynamic import
    const pdfParse = (await import('pdf-parse')).default

    // Parse PDF
    const pdfData = await pdfParse(buffer)

    return NextResponse.json({
      text: pdfData.text,
      fileName: file.name,
      uploadDate: new Date().toISOString()
    })

  } catch (error) {
    console.error('PDF parsing error:', error)
    
    // Ensure we always return valid JSON
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to parse PDF: ${errorMessage}` },
      { status: 500 }
    )
  }
}
