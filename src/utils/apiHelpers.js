const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_IMAGE_MODEL =
  import.meta.env.VITE_OPENAI_IMAGE_MODEL || 'gpt-image-1'

function hasUsableOpenAIKey() {
  if (!OPENAI_API_KEY) {
    return false
  }

  const normalizedKey = OPENAI_API_KEY.trim().toLowerCase()
  return !normalizedKey.includes('your_openai_api_key_here')
}

function createSvgPlaceholder(title, caption, accentA, accentB) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentA}" />
          <stop offset="100%" stop-color="${accentB}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" rx="48" />
      <circle cx="920" cy="180" r="120" fill="rgba(255,255,255,0.15)" />
      <circle cx="250" cy="720" r="180" fill="rgba(255,255,255,0.12)" />
      <rect x="110" y="120" width="980" height="660" rx="36" fill="rgba(10,17,40,0.26)" stroke="rgba(255,255,255,0.4)" />
      <text x="140" y="250" fill="white" font-family="Georgia, serif" font-size="64" font-weight="700">${escapeXml(
        title,
      )}</text>
      <text x="140" y="340" fill="white" font-family="Arial, sans-serif" font-size="30">${escapeXml(
        caption,
      )}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function parseJsonSafely(input) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

async function callOpenAIChat(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('No text was returned from the language model.')
  }

  return content
}

export async function getEnhancedPrompt(input, systemPrompt) {
  if (!hasUsableOpenAIKey()) {
    return `Editorial product photography of ${input.trim()}, captured from a low three-quarter angle with cinematic golden-hour lighting, crisp material texture, refined depth of field, and an aspirational luxury campaign mood. Blend contemporary commercial realism with subtle magazine styling and polished color grading for a premium finish.`
  }

  return callOpenAIChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: input },
  ])
}

export async function generateImageFromPrompt(prompt) {
  if (!hasUsableOpenAIKey()) {
    return {
      url: createSvgPlaceholder(
        'Creative Studio Output',
        prompt.slice(0, 120),
        '#1d4ed8',
        '#ec4899',
      ),
      alt: prompt,
    }
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_IMAGE_MODEL,
      prompt,
      size: '1024x1024',
    }),
  })

  if (!response.ok) {
    throw new Error(`Image generation failed with status ${response.status}.`)
  }

  const data = await response.json()
  const image = data.data?.[0]

  if (image?.url) {
    return { url: image.url, alt: prompt }
  }

  if (image?.b64_json) {
    return {
      url: `data:image/png;base64,${image.b64_json}`,
      alt: prompt,
    }
  }

  throw new Error('No image data was returned from the image model.')
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Unable to read the selected file.'))
    reader.readAsDataURL(file)
  })
}

export async function analyzeImageFromBase64(base64Image, analysisPrompt) {
  if (!hasUsableOpenAIKey()) {
    return {
      mainObjects: 'A hero subject framed prominently with supporting environmental details.',
      colorPalette: 'Deep teal, soft apricot highlights, charcoal shadows, and muted cream accents.',
      artisticStyle: 'Glossy campaign photography with cinematic contrast and editorial polish.',
      variationPrompt:
        'Create a fresh editorial variation of the uploaded scene with the same key subject, deep teal and apricot palette, cinematic lighting, refined textures, and a premium campaign feel.',
    }
  }

  const content = await callOpenAIChat([
    {
      role: 'system',
      content:
        'You are a vision analyst. Return only valid JSON with the requested keys and concise string values.',
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: analysisPrompt },
        {
          type: 'image_url',
          image_url: {
            url: base64Image,
          },
        },
      ],
    },
  ])

  const parsed = parseJsonSafely(content)
  if (!parsed) {
    throw new Error('The vision response was not valid JSON.')
  }

  return parsed
}

export async function generateVariationFromAnalysis(analysis) {
  const prompt = analysis?.variationPrompt
  if (!prompt) {
    throw new Error('Variation prompt missing from the analysis step.')
  }

  if (!hasUsableOpenAIKey()) {
    return {
      url: createSvgPlaceholder(
        'Style Lab Variation',
        prompt.slice(0, 120),
        '#0f766e',
        '#f97316',
      ),
      alt: prompt,
    }
  }

  return generateImageFromPrompt(prompt)
}
