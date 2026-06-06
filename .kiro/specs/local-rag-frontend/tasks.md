# Implementation Plan: Local RAG Frontend

## Overview

This implementation plan breaks down the Local RAG Frontend into discrete coding tasks. The frontend is a Next.js application with TypeScript, Tailwind CSS, and Axios for API communication with a FastAPI backend on port 8000 and an Express docs server on port 3001.

## Tasks

- [ ] 1. Set up project structure and configuration
  - Initialize Next.js project with TypeScript and required dependencies
  - Configure Tailwind CSS and postcss
  - Set up TypeScript configuration with strict mode
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 2. Create type definitions
  - [ ] 2.1 Create chat types (`types/chat.ts`)
    - Define `ChatRequest`, `ChatResponse`, `Source`, and `ConversationItem` interfaces
    - _Requirements: 2.1, 2.2, 7.1_
  
  - [ ] 2.2 Create document types (`types/document.ts`)
    - Define `DocumentMetadata` and `DocumentChunk` interfaces
    - _Requirements: 3.1_

- [ ] 3. Set up API utilities
  - [ ] 3.1 Create API client configuration (`utils/api.ts`)
    - Configure Axios clients for FastAPI backend (port 8000) and docs server (port 3001)
    - Set appropriate timeouts (30s for API, 10s for docs)
    - _Requirements: 1.2, 3.3, 5.2_

- [ ] 4. Create custom hooks
  - [ ] 4.1 Implement `useChat` hook (`hooks/useChat.ts`)
    - Manage chat state (question, answer, sources, loading, error)
    - Implement `askQuestion` function with API integration
    - Handle error cases (network failure, timeout, API errors)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 8.2_
  
  - [ ] 4.2 Implement `useDocument` hook (`hooks/useDocument.ts`)
    - Fetch document metadata from docs server
    - Handle document not found errors
    - _Requirements: 3.1, 3.4, 5.3_

  - [ ] 4.3 Implement `useConversationHistory` hook
    - Manage conversation history in localStorage
    - Persist last 10 question-answer pairs
    - Load history on page load
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Create UI components
  - [ ] 5.1 Create `SourceList` component (`components/SourceList.tsx`)
    - Render numbered list of source citations
    - Display filename and snippet for each source
    - Handle empty sources with appropriate message
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 5.2 Create `AnswerDisplay` component (`components/AnswerDisplay.tsx`)
    - Display answer text with markdown rendering
    - Render source list below answer
    - Show loading state during API calls
    - _Requirements: 1.5, 2.1, 8.2_
  
  - [ ] 5.3 Create `DocumentViewer` component (`components/DocumentViewer.tsx`)
    - Display document link with filename
    - Open document in new tab when clicked
    - Handle document not found errors
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 5.4 Create `ConversationHistory` component (`components/ConversationHistory.tsx`)
    - Display past question-answer pairs
    - Show timestamp for each interaction
    - Limit display to 10 items
    - _Requirements: 7.1, 7.3_
  
  - [ ] 5.5 Create `ChatInterface` component (`components/ChatInterface.tsx`)
    - Main container component orchestrating chat experience
    - Integrate all sub-components
    - Handle question submission
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 3.1, 7.1_

- [ ] 6. Implement main page
  - [ ] 6.1 Create main page (`app/page.tsx`)
    - Integrate `ChatInterface` component
    - Implement responsive layout wrapper
    - Add error boundary for component errors
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 6.2 Create root layout (`app/layout.tsx`)
    - Configure metadata
    - Add global styles
    - Set up context providers if needed
    - _Requirements: 10.1_

- [ ] 7. Implement document ingestion status check
  - [ ] 7.1 Create document status check logic
    - Check if ChromaDB collection is empty on page load
    - Display ingestion message if no documents found
    - Include instructions for adding documents
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. Add accessibility features
  - [ ] 8.1 Implement keyboard navigation
    - Add Tab, Enter, Escape support for all interactive elements
    - _Requirements: 9.1_
  
  - [ ] 8.2 Add ARIA labels
    - Add appropriate ARIA labels for screen readers
    - Add ARIA attributes to error messages
    - _Requirements: 9.2, 9.3, 9.4_

- [ ] 9. Implement responsive design
  - [ ] 9.1 Mobile layout (320px - 767px)
    - Stack input field and buttons vertically
    - Single column layout
    - Ensure minimum touch target size of 44x44 pixels
    - _Requirements: 4.2, 4.4_
  
  - [ ] 9.2 Desktop layout (1200px+)
    - Center content area with appropriate margins
    - Two column layout (chat area + source list)
    - Expanded conversation history
    - _Requirements: 4.3_

- [ ] 10. Write tests
  - [ ]* 10.1 Write unit tests for API utilities
    - Test API client configuration
    - Test timeout handling
    - _Requirements: 5.2_
  
  - [ ]* 10.2 Write unit tests for `useChat` hook
    - Test question submission flow
    - Test error handling scenarios
    - Test loading state transitions
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2_
  
  - [ ]* 10.3 Write unit tests for `useConversationHistory` hook
    - Test history persistence
    - Test history loading
    - Test maximum item limit
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 10.4 Write unit tests for `SourceList` component
    - Test rendering with multiple sources
    - Test empty sources handling
    - Test link generation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 10.5 Write unit tests for `AnswerDisplay` component
    - Test answer rendering
    - Test loading state
    - Test error display
    - _Requirements: 1.5, 2.1, 8.2_
  
  - [ ]* 10.6 Write unit tests for `DocumentViewer` component
    - Test link generation
    - Test new tab opening
    - Test error handling
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 10.7 Write unit tests for `ConversationHistory` component
    - Test history display
    - Test timestamp formatting
    - Test item limiting
    - _Requirements: 7.1, 7.3_
  
  - [ ]* 10.8 Write property test for question submission
    - **Property 1: Question submission sends correct API request**
    - **Validates: Requirements 1.2**
  
  - [ ]* 10.9 Write property test for loading indicator
    - **Property 2: Loading indicator appears during API calls**
    - **Validates: Requirements 1.3, 8.2**
  
  - [ ]* 10.10 Write property test for error messages
    - **Property 3: Error messages include actionable guidance**
    - **Validates: Requirements 1.4, 5.1, 5.2, 5.3, 5.4**
  
  - [ ]* 10.11 Write property test for answer display
    - **Property 4: Answer display shows all sources**
    - **Validates: Requirements 2.1, 2.3**
  
  - [ ]* 10.12 Write property test for source citations
    - **Property 5: Source citations include required information**
    - **Validates: Requirements 2.2**
  
  - [ ]* 10.13 Write property test for empty sources handling
    - **Property 6: Empty sources handled gracefully**
    - **Validates: Requirements 2.4**
  
  - [ ]* 10.14 Write property test for document links
    - **Property 7: Document links point to correct server**
    - **Validates: Requirements 3.1, 3.3**
  
  - [ ]* 10.15 Write property test for document link behavior
    - **Property 8: Document links open in new tab**
    - **Validates: Requirements 3.2**
  
  - [ ]* 10.16 Write property test for responsive layout
    - **Property 9: Responsive layout adapts to viewport sizes**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  
  - [ ]* 10.17 Write property test for accessibility
    - **Property 10: Interactive elements meet accessibility requirements**
    - **Validates: Requirements 4.4, 9.1, 9.2, 9.3, 9.4**
  
  - [ ]* 10.18 Write property test for conversation history
    - **Property 11: Conversation history persists during session**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
  
  - [ ]* 10.19 Write property test for empty document collection
    - **Property 12: Empty document collection handled gracefully**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ]* 10.20 Write property test for performance
    - **Property 13: Performance meets response time requirements**
    - **Validates: Requirements 8.1, 8.3, 8.4**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Integration and finalization
  - [ ] 12.1 Wire components together
    - Connect all components in the main page
    - Integrate hooks with components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 3.1, 6.1, 7.1_
  
  - [ ]* 12.2 Write integration tests
    - Test complete user flows
    - Test API integration with FastAPI backend
    - Test document fetching from docs server
    - _Requirements: 1.1, 1.2, 2.1, 3.1_

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation assumes the FastAPI backend is running on port 8000 and the Express docs server is running on port 3001
- All code will be written in TypeScript with Next.js App Router
- Tailwind CSS will be used for responsive styling

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2"] },
    { "id": 1, "tasks": ["3.1", "4.1", "4.2", "4.3"] },
    { "id": 2, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 3, "tasks": ["6.1", "6.2", "7.1"] },
    { "id": 4, "tasks": ["8.1", "8.2", "9.1", "9.2"] },
    { "id": 5, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7"] },
    { "id": 6, "tasks": ["10.8", "10.9", "10.10", "10.11", "10.12", "10.13", "10.14", "10.15", "10.16", "10.17", "10.18", "10.19", "10.20"] },
    { "id": 7, "tasks": ["12.1", "12.2"] }
  ]
}
```
