# DocRes AI Hub - Frontend

This is the Next.js frontend for the **Digital Image Processing (DIP) Project: Document Image Restoration & Auto Translation**.

## Features
- Modern, glassmorphism-inspired UI
- Drag & Drop image upload
- Dynamic AI Task selection (Dewarping, Deshadowing, End-to-End, etc.)
- Connects directly to Google Colab GPU backend via Ngrok
- Displays restored image, extracted English text (OCR), and translated Urdu text side-by-side.

## Tech Stack
- Next.js (React)
- Vanilla CSS (CSS Modules)

## Setup Instructions
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Make sure the Colab Backend API is running and paste the `ngrok` URL into the UI.
