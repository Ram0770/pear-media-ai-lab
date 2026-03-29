# Pear Media AI Prototype

A responsive React + Vite web app for the Pear Media assignment. It includes two guided workflows:

- `Creative Studio`: turns a short text idea into an enhanced prompt, lets the user approve or edit it, then generates an image.
- `Style Lab`: uploads an image, analyzes its subjects, palette, and style, then generates a stylistic variation.

## Tech Stack

- React 19
- Vite 8
- Lucide React
- OpenAI Chat Completions API for text and vision analysis
- OpenAI Images API for image generation

## Features

- Responsive tabbed interface with a shared loading state
- Human-in-the-loop approval step before final image generation
- Image upload with Base64 conversion using `FileReader`
- Structured vision analysis for object, palette, and style extraction
- Graceful demo-mode fallbacks when API keys are missing
- Ready for Vercel deployment with environment variables

## Project Structure

```text
pear-media-ai-lab/
├── .env.example
├── README.md
├── package.json
└── src/
    ├── App.jsx
    ├── App.css
    ├── components/
    │   ├── ImageCard.jsx
    │   ├── Navbar.jsx
    │   ├── WorkflowImage.jsx
    │   └── WorkflowText.jsx
    └── utils/
        ├── apiHelpers.js
        └── constants.js
```

## How To Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and add your keys:

   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-4o-mini
   VITE_OPENAI_IMAGE_MODEL=gpt-image-1
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## Deployment Notes

- Import the repo into Vercel.
- Add the same `VITE_*` environment variables in the Vercel dashboard.
- If you want a backend proxy later, the current helper structure makes that swap straightforward.

## Submission Checklist

- GitHub repository
- Deployed URL
- Screen recording link

## Notes

- Without an OpenAI key, the app still works in a visual demo mode using generated placeholder images and mocked analysis output.
- For production use, move API calls behind a backend service so secrets are not exposed to the browser.
