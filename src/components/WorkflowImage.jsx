import { useState } from 'react'
import { Eye, Upload, RefreshCcw } from 'lucide-react'
import ImageCard from './ImageCard'
import {
  analyzeImageFromBase64,
  generateVariationFromAnalysis,
  readFileAsDataUrl,
} from '../utils/apiHelpers'
import { IMAGE_ANALYSIS_PROMPT, MAX_FILE_SIZE_MB } from '../utils/constants'

function WorkflowImage({ isLoading, setIsLoading, setStatusMessage }) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [variationImage, setVariationImage] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image too large. Please upload a file under ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    setIsLoading(true)
    setError('')
    setVariationImage(null)
    setStatusMessage('Converting your upload and analyzing visual style.')

    try {
      const base64Image = await readFileAsDataUrl(file)
      setPreviewUrl(base64Image)
      const nextAnalysis = await analyzeImageFromBase64(
        base64Image,
        IMAGE_ANALYSIS_PROMPT,
      )
      setAnalysis(nextAnalysis)
      setStatusMessage('Image analysis ready. Generate a fresh variation below.')
    } catch (caughtError) {
      setError(caughtError.message)
      setStatusMessage('Image analysis failed. Try another file or check your keys.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVariation = async () => {
    setIsLoading(true)
    setError('')
    setStatusMessage('Creating a new image variation from the detected style cues.')

    try {
      const result = await generateVariationFromAnalysis(analysis)
      setVariationImage(result)
      setStatusMessage('Variation generated successfully.')
    } catch (caughtError) {
      setError(caughtError.message)
      setStatusMessage('Variation generation failed. Review the analysis or your API setup.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="workflow-grid">
      <article className="panel">
        <div className="panel-heading">
          <div className="panel-icon">
            <Upload size={18} />
          </div>
          <div>
            <p className="panel-label">Workflow B</p>
            <h2>Reference Image Upload</h2>
          </div>
        </div>

        <label className="upload-zone">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <span>Drop an image here or click to browse</span>
          <small>Supports PNG, JPG, or WEBP up to {MAX_FILE_SIZE_MB}MB.</small>
        </label>

        {previewUrl ? (
          <ImageCard
            image={{ url: previewUrl, alt: 'Uploaded reference' }}
            title="Reference Upload"
            subtitle="This is the source image used for visual analysis."
          />
        ) : null}

        {error ? <p className="feedback error">{error}</p> : null}
      </article>

      <article className="panel">
        <div className="panel-heading">
          <div className="panel-icon secondary">
            <Eye size={18} />
          </div>
          <div>
            <p className="panel-label">Vision Breakdown</p>
            <h2>Analysis and Variation</h2>
          </div>
        </div>

        <div className="analysis-card">
          <div>
            <span className="analysis-label">Main subjects</span>
            <p>{analysis?.mainObjects || 'Upload an image to inspect the subject matter.'}</p>
          </div>
          <div>
            <span className="analysis-label">Color palette</span>
            <p>{analysis?.colorPalette || 'Dominant tones and contrast notes will appear here.'}</p>
          </div>
          <div>
            <span className="analysis-label">Artistic style</span>
            <p>{analysis?.artisticStyle || 'Style descriptors will be generated after upload.'}</p>
          </div>
          <div>
            <span className="analysis-label">Variation prompt</span>
            <p>{analysis?.variationPrompt || 'A reusable generation prompt will be composed automatically.'}</p>
          </div>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleVariation}
          disabled={isLoading || !analysis?.variationPrompt}
        >
          <RefreshCcw size={16} />
          Generate Variation
        </button>

        <ImageCard
          image={variationImage}
          title="Style Variation"
          subtitle="Generated from the analyzed objects, palette, and mood."
        />
      </article>
    </section>
  )
}

export default WorkflowImage
