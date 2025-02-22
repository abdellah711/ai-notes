# AI Notes App

AI Notes App is a simple note-taking application that helps you organize your notes and find related insights or answers.

## Features

- **AI Assistance**: Ask the AI any questions related to your notes and receive contextually relevant responses.
- **Organized Note Management**: Create, update, and delete notes with ease.
- **Rich Text Editing**: Leverage the power of PlateJS for a seamless editing experience.
- **User Authentication**: Secure login and session management.

## Tech Stack

- **Next.js**: A popular React framework for building fast and user-friendly web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **PlateJS**: A framework for building rich text editors with React.
- **NextUI**: A modern React UI library for creating beautiful and responsive interfaces.
- **ShadCN**: A design system and component library for consistent UI/UX.
- **Drizzle ORM**: A lightweight ORM for managing database interactions.
- **AI SDK**: Vercel's AI SDK for integrating LLMs.
- **Gemini API**: Integrates with AI services for providing generative AI capabilities.

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/abdellah711/ai-notes-app.git
   cd ai-notes-app
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables as specified in `.env.example`. Here's a brief explanation of each variable:

   - `GOOGLE_API_KEY`: Your API key for accessing Google services, used for AI capabilities.
   - `DATABASE_URL`: Connection string for the database, used by Drizzle ORM to interact with your database.
   - `NEXT_PUBLIC_API_URL`: The base URL for your API, used in client-side requests.
   - `SESSION_SECRET`: A secret key for encrypting session data, essential for user authentication security.
   - `NEXT_PUBLIC_ANALYTICS_ID`: An identifier for analytics services, used to track usage and performance metrics.

4. **Run the development server**:

   ```bash
   pnpm dev
   ```

5. **Open the app in your browser**:
   Navigate to `http://localhost:3000` to start using the AI Notes App.

## Usage

- **Create Notes**: Use the provided editor to create and manage notes.
- **Ask the AI**: Enter your questions related to your notes in the chat interface to receive AI-generated responses.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
