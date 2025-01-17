# AI Assistant Platform

## Overview
The **AI Assistant Platform** is a comprehensive web application that integrates multiple AI-powered features into a single, user-friendly interface. It is designed to simplify user experience by providing a unified solution for common AI functionalities. 

### Key Features
1. **Chat Assistant**: An intelligent chatbot for answering general queries.
2. **Document Analysis**: Processes and analyzes PDF documents.
3. **Video Summaries**: Summarizes YouTube videos by processing video transcripts.

---

## Inspiration
The project was inspired by the fragmented nature of existing AI tools. Users often need to switch between multiple platforms for different tasks. The AI Assistant Platform brings these functionalities together, making AI tools more accessible and convenient.

---

## Tech Stack

### Frontend
- **Next.js 13.5**
- **React 18**
- **TypeScript**

### UI Components
- **Shadcn UI**
- **Radix UI**
- **Tailwind CSS**

### Backend
- **FastAPI (Python)**
- **Groq AI**

### Additional Tools
- **YouTube Transcript API**
- **phi-tools**

---

## Architecture
- **Client-Side Routing**: Ensures smooth navigation using Next.js App Router.
- **Server Components**: Utilizes Next.js 13 server components for improved performance.
- **API Integration**: RESTful APIs enable seamless communication between frontend and backend.
- **Responsive Design**: Follows a mobile-first design approach using Tailwind CSS.

---

## Challenges and Solutions

### 1. YouTube Video Processing
- **Challenge**: Managing long video transcripts exceeding token limits.
- **Solution**: Implemented a chunking system to split, process, and recombine transcripts.

### 2. Real-time Chat Updates
- **Challenge**: Managing state and UI responsiveness during chat interactions.
- **Solution**: Integrated a robust state management system with proper loading states and error handling.

### 3. PDF Processing
- **Challenge**: Extracting meaningful content from large PDFs.
- **Solution**: Added file size/type validation, progress indicators, and chunk processing for large files.

### 4. Cross-Origin Resource Sharing (CORS)
- **Challenge**: Resolving CORS issues between frontend and backend.
- **Solution**: Configured CORS middleware in FastAPI.

### 5. Performance Optimization
- **Challenge**: Maintaining fast load times with multiple features.
- **Solution**: Applied code splitting, optimized bundle sizes, used Next.js image optimization, and configured caching strategies.

---

## Current Issues and Future Improvements

### Current Issues
1. **API Rate Limiting**: Needs to be implemented to prevent abuse.
2. **Error Handling**: Better edge-case handling required for video processing.
3. **State Management**: May need a scalable solution like Redux or Zustand as the application grows.
4. **Testing**: Comprehensive testing coverage is still required.
   - Unit tests for components
   - Integration tests for APIs
   - End-to-end testing
5. **Accessibility**: Improvements needed for keyboard navigation, screen reader compatibility, and ARIA roles.

### Future Plans
- Add user authentication and history tracking.
- Support additional document types beyond PDFs.
- Integrate more AI models for specialized tasks.
- Introduce collaborative features for team usage.
- Implement a caching system for frequently accessed content.

---

## What I Learned
- **AI Integration**: Gained a deep understanding of working with AI APIs and managing token limits.
- **Performance Optimization**: Learned techniques for optimizing Next.js applications and managing large-scale data processing.
- **Error Handling**: Improved strategies for handling errors across the full stack.
- **UI/UX Design**: Enhanced skills in creating intuitive interfaces and seamless user experiences.
- **TypeScript**: Strengthened understanding of its type system and benefits in large projects.

---

## Getting Started

### Prerequisites
- Node.js
- Python 3.9+

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Meetpatel006/educationXai
   ```
2. Navigate to the project directory:
   ```bash
   cd educationXai
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the backend:
   - Navigate to the `backend` folder.
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

### Usage
- Open the application in your browser at `http://localhost:3000`.
- Interact with the Chat Assistant, Document Analysis, or Video Summarization features.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## Acknowledgements
- **Next.js**: For providing a powerful frontend framework.
- **FastAPI**: For its ease of use in building APIs.
- **YouTube Transcript API**: For simplifying video transcript retrieval.
- **Tailwind CSS**: For rapid UI development.

---

## Contact
For questions or feedback, please reach out via:
- Email: [work.meetpatel221@gmail.com](mailto:work.meetpatel221@gmail.com)
- LinkedIn: [Meet Patel](https://bit.ly/3NELCvd)

---

Thank you for checking out the AI Assistant Platform! Feel free to explore, contribute, and share your thoughts.
