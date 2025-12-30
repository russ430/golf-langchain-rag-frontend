# PDF Management Dashboard

A modern React dashboard for uploading and managing PDF documents that will be processed by a Python API for embedding and vectorization.

## Features

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Multiple File Support**: Upload multiple PDFs simultaneously
- **Real-time Status**: Track upload and processing status
- **File Management**: View, remove, and manage uploaded files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error reporting and user feedback

## Tech Stack

- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Lucide React** for icons
- **React Dropzone** for file uploads
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create environment file:

   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your Python API URL:

   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

6. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## API Integration

The dashboard expects a Python API with the following endpoints:

### POST /upload

Upload a PDF file for processing.

**Request:** `multipart/form-data` with a `file` field

**Response:**

```json
{
  "success": true,
  "fileId": "unique-file-id",
  "message": "File uploaded successfully"
}
```

### GET /status/{fileId}

Check the processing status of a file.

**Response:**

```json
{
  "id": "file-id",
  "name": "document.pdf",
  "size": 1024000,
  "uploadDate": "2023-12-01T10:00:00Z",
  "status": "completed"
}
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main dashboard component
│   └── PDFUploader.tsx    # File upload component
├── services/
│   └── pdfService.ts      # API service functions
├── types/
│   └── pdf.ts            # TypeScript type definitions
├── App.tsx               # Main app component
└── index.css             # TailwindCSS styles
```

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner.

### `npm run build`

Builds the app for production to the `build` folder.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` directory.
