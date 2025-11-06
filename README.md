<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gemini Super App

A comprehensive productivity and AI-powered application featuring multiple tools and capabilities powered by Google's Gemini API.

**Built with AI Assistance**: This application was developed with the help of Claude (Anthropic) and powered by Google's Gemini API.

View your app in AI Studio: https://ai.studio/apps/drive/10AEt8diPgZzSP099IQeFjV2g4FSFbtJH

## Features

### AI-Powered Features
- **Story Weaver**: Generate creative short stories from prompts with real-time streaming
- **Image Spark**: Create images using Imagen-4.0 with customizable aspect ratios
- **Code Companion**: AI assistant for code generation and explanation
- **Travel Planner**: Generate structured travel itineraries with day-by-day plans
- **Knowledge Seeker**: Grounded search with Google Search integration and source citations

### Productivity Tools
- **Word Processor**: Full-featured text editor with AI-powered writing assistance
  - Improve text grammar and clarity
  - Summarize documents
  - Rewrite text in different styles
  - Word and character count
  - Export to text files

- **Spreadsheet**: Interactive spreadsheet with formula support
  - 15x10 grid with cell editing
  - Formula support: SUM, AVERAGE, cell references
  - AI-powered data analysis
  - CSV export

- **Presentation Maker**: Create professional presentations
  - Slide-based editor with title, content, and speaker notes
  - AI-powered presentation generation from topics
  - Slide navigation and management
  - Export to JSON

- **Calculator**: Advanced calculator with AI math solver
  - Standard and scientific functions
  - Calculation history
  - AI-powered step-by-step math problem solving
  - Support for algebra, calculus, and unit conversions

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Generative AI (@google/genai)
- **Models**: Gemini 2.5-flash, Imagen-4.0

## Development Credits

This application was built with the collaborative power of AI:

- **Claude (Anthropic)**: Used for application development, code generation, and architecture design
- **Google Gemini API**: Powers all AI features within the application including text generation, image creation, code assistance, data analysis, and problem solving

The combination of Claude's development capabilities and Gemini's runtime AI features demonstrates the potential of AI-assisted development and AI-powered user experiences.
