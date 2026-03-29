import { useState } from 'react'
import { Wand2, ImagePlus, PencilLine } from 'lucide-react'
import ImageCard from './ImageCard'
import {
  generateImageFromPrompt,
  getEnhancedPrompt,
} from '../utils/apiHelpers'
import {
  DEFAULT_TEXT_PROMPT,
  TEXT_APPROVAL_HINT,
  TEXT_SYSTEM_PROMPT,
} from '../utils/constants'

function WorkflowText({ isLoading, setIsLoading, setStatusMessage }) {
  const [userPrompt, setUserPrompt] = useState(DEFAULT_TEXT_PROMPT)
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [error, setError] = useState('')

  const handleEnhance = async () => {
    setIsLoading(true)
    setError('')
    setGeneratedImage(null)
    setStatusMessage('Enhancing your prompt with lighting, camera, and style.')

    try {
      const nextPrompt = await getEnhancedPrompt(userPrompt, TEXT_SYSTEM_PROMPT)
      setEnhancedPrompt(nextPrompt)
      setStatusMessage(
        'Enhanced prompt ready. Review and edit it before generating the final image.',
      )
    } catch (caughtError) {
      setError(caughtError.message)
      setStatusMessage('Prompt enhancement failed. You can retry or edit manually.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')
    setStatusMessage('Generating an image from the approved prompt.')

    try {
      const image = await generateImageFromPrompt(enhancedPrompt)
      setGeneratedImage(image)
      setStatusMessage('Image generated successfully.')
    } catch (caughtError) {
      setError(caughtError.message)
      setStatusMessage('Image generation failed. Check your API keys and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="workflow-grid">
      <article className="panel">
        <div className="panel-heading">
          <div className="panel-icon">
            <Wand2 size={18} />
          </div>
          <div>
            <p className="panel-label">Workflow A</p>
            <h2>Prompt Enhancement</h2>
          </div>
        </div>

        <label className="field">
          <span>Start with a simple request</span>
          <textarea
            value={userPrompt}
            onChange={(event) => setUserPrompt(event.target.value)}
            placeholder="A futuristic sneaker ad at sunset"
            rows={6}
          />
        </label>

        <button
          type="button"
          className="primary-button"
          onClick={handleEnhance}
          disabled={isLoading || !userPrompt.trim()}
        >
          Enhance Prompt
        </button>

        {error ? <p className="feedback error">{error}</p> : null}
      </article>

      <article className="panel">
        <div className="panel-heading">
          <div className="panel-icon secondary">
            <PencilLine size={18} />
          </div>
          <div>
            <p className="panel-label">Human In The Loop</p>
            <h2>Approve Before Generate</h2>
          </div>
        </div>

        <label className="field">
          <span>Enhanced prompt</span>
          <textarea
            value={enhancedPrompt}
            onChange={(event) => setEnhancedPrompt(event.target.value)}
            placeholder={TEXT_APPROVAL_HINT}
            rows={8}
          />
        </label>

        <div className="action-row">
          <button
            type="button"
            className="secondary-button"
            onClick={handleGenerate}
            disabled={isLoading || !enhancedPrompt.trim()}
          >
            <ImagePlus size={16} />
            Generate Image
          </button>
          <p className="helper-copy">
            The button stays locked until an enhanced prompt exists.
          </p>
        </div>

        <ImageCard
          image={generatedImage}
          title="Creative Output"
          subtitle="Generated from your approved prompt."
        />
      </article>
    </section>
  )
}

export default WorkflowText
