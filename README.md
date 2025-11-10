# 🔍 Webhook Inspector

A complete tool for testing and understanding webhooks in real-time. Intercept, analyze, and debug HTTP requests while developing integrations with services like Stripe, GitHub, video platforms, and more—all in a secure environment with a modern interface.

## ✨ Features

- 📡 **Real-time Webhook Capture**: Automatically capture and store all incoming webhook requests
- 🔎 **Detailed Request Inspection**: View complete request details including headers, query parameters, body, and metadata
- 🤖 **Smart Handler Generation**: AI-powered TypeScript + Zod handler generation based on captured webhook examples
- 🎨 **Modern UI**: Clean, dark-themed interface built with Tailwind CSS and Radix UI
- 🔒 **Type-Safe API**: Full TypeScript support with Zod validation throughout the stack
- ♾️ **Infinite Scroll**: Efficiently browse through large numbers of captured webhooks
- 🔍 **Search & Filter**: Quickly find specific webhooks in your history

## 🛠️ Tech Stack

### Backend
- ⚡ **[Fastify](https://fastify.dev/)**: Fast and low overhead web framework
- 🗄️ **[Drizzle ORM](https://orm.drizzle.team/)**: TypeScript ORM with PostgreSQL
- ✅ **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- 🐘 **[PostgreSQL](https://www.postgresql.org/)**: Reliable relational database
- 🤖 **[@ai-sdk/google](https://sdk.vercel.ai/docs)**: AI integration for handler generation

### Frontend
- ⚛️ **[React 19](https://react.dev/)**: Modern UI library
- 🧭 **[TanStack Router](https://tanstack.com/router)**: Type-safe routing
- 🔄 **[TanStack Query](https://tanstack.com/query)**: Powerful data synchronization
- 🎨 **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework
- 🧩 **[Radix UI](https://www.radix-ui.com/)**: Accessible component primitives
- ⚡ **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling

## 📦 Installation

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose (for PostgreSQL)
- Google AI API key (for handler generation feature)

### Setup

**1. Clone the repository**
```bash
git clone git@github.com:isaqu3d/webhook-inspector.git
cd webhook-inspector
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Start PostgreSQL database**

Navigate to the `api` folder and start the database:
```bash
cd api
docker-compose up -d
```

**4. Configure environment variables**

Create a `.env` file in the `api` directory:
```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/webhooks"
PORT=3333
NODE_ENV=development
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
```

**5. Run database migrations**

In the `api` folder, run:
```bash
pnpm run db:migrate
```

**6. Seed the database** (optional - adds sample webhook data)

In the `api` folder, run:
```bash
pnpm run db:seed
```

**7. Start the development servers**

In separate terminal windows:

```bash
# Terminal 1 - API Server
# In the api folder, run:
cd api
pnpm run dev

# Terminal 2 - Web Frontend
# In the web folder, run:
cd web
pnpm run dev
```

The API will be available at `http://localhost:3333` and the web interface at `http://localhost:5173`.

## 🚀 Usage

### Capturing Webhooks

Send any HTTP request to your Webhook Inspector instance and it will automatically capture and store the details:

```bash
# Example: Capture a POST request
curl -X POST http://localhost:3333/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"event": "payment_intent.succeeded", "amount": 1000}'
```

All captured webhooks will appear in the sidebar and can be clicked to view full details.

### Generating Handlers

1. ✅ Select multiple webhooks by clicking the checkboxes
2. 🪄 Click the "Gerar handler" (Generate handler) button
3. 🤖 The AI will analyze the webhook patterns and generate a type-safe TypeScript handler with:
   - Zod schemas for validation
   - Type definitions for each event
   - Individual handler functions
   - Main routing function

### Database Management

In the `api` folder, run:

```bash
# Open Drizzle Studio (database GUI)
pnpm run db:studio

# Generate new migration
pnpm run db:generate

# Apply migrations
pnpm run db:migrate
```

## 📚 API Documentation

Interactive API documentation is available at `http://localhost:3333/docs` when the server is running.

### Main Endpoints

- `GET /api/webhooks` - List captured webhooks with pagination
- `GET /api/webhooks/:id` - Get specific webhook details
- `DELETE /api/webhooks/:id` - Delete a webhook
- `POST /api/generate` - Generate TypeScript handler from webhook examples
- `ALL /*` - Catch-all route that captures incoming webhooks

## 📁 Project Structure

This project follows professional architectural patterns for scalability and maintainability.

### Backend (Clean Architecture)

```
api/
├── src/
│   ├── domain/                          # Business logic
│   │   ├── entities/                    # Core entities
│   │   └── value-objects/               # Value objects
│   │
│   ├── infrastructure/                  # Technical implementations
│   │   ├── database/
│   │   │   └── drizzle/
│   │   │       ├── migrations/          # Database migrations
│   │   │       ├── schemas/             # Drizzle ORM schemas
│   │   │       ├── index.ts             # Database connection
│   │   │       └── seed.ts              # Database seeding
│   │   ├── ai/                          # AI service integrations
│   │   └── http/
│   │       └── fastify/
│   │           ├── plugins/             # Fastify plugins
│   │           └── server.ts            # Server configuration
│   │
│   ├── presentation/                    # API layer
│   │   ├── routes/                      # API route handlers
│   │   ├── controllers/                 # Controllers
│   │   └── validators/                  # Request validators
│   │
│   ├── shared/                          # Shared code
│   │   ├── config/                      # Configuration (env)
│   │   ├── errors/                      # Error handlers
│   │   ├── types/                       # TypeScript types
│   │   └── utils/                       # Utility functions
│   │
│   └── main.ts                          # Application entry point
│
├── drizzle.config.ts
└── package.json
```

### Frontend (Feature-based Architecture)

```
web/
├── src/
│   ├── app/                             # Application setup
│   │   ├── providers/                   # React providers
│   │   └── routes/                      # TanStack Router routes
│   │
│   ├── features/                        # Feature modules
│   │   ├── webhooks/
│   │   │   ├── api/                     # API schemas & queries
│   │   │   ├── components/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── webhook-details/
│   │   │   │   └── webhook-list/
│   │   │   ├── hooks/                   # Feature-specific hooks
│   │   │   └── types/                   # Feature types
│   │   │
│   │   └── handler-generation/
│   │       ├── api/
│   │       ├── components/
│   │       └── hooks/
│   │
│   ├── shared/                          # Shared resources
│   │   ├── components/
│   │   │   ├── ui/                      # Reusable UI components
│   │   │   └── layout/                  # Layout components
│   │   ├── hooks/                       # Shared hooks
│   │   ├── lib/                         # Utilities & configs
│   │   ├── types/                       # Global types
│   │   └── constants/                   # Constants
│   │
│   ├── styles/                          # Global styles
│   │   └── themes/                      # Theme files
│   │
│   └── main.tsx                         # Application entry point
│
└── package.json
```

### 🎯 Architecture Benefits

**Backend (Clean Architecture)**
- ✅ **Separation of Concerns**: Business logic isolated from infrastructure
- ✅ **Testability**: Easy to write unit tests for each layer
- ✅ **Flexibility**: Switch databases or frameworks without affecting business logic
- ✅ **Scalability**: Add new features without modifying existing code

**Frontend (Feature-based)**
- ✅ **Modularity**: Each feature is self-contained and independent
- ✅ **Colocation**: Related code lives together (components, hooks, types)
- ✅ **Maintainability**: Easy to find and modify code
- ✅ **Reusability**: Shared components and utilities are centralized

### 📝 Adding New Features

**Backend - Adding a new route:**
1. Create route file in `api/src/presentation/routes/`
2. Import and register in `api/src/infrastructure/http/fastify/server.ts`
3. Add database operations in `api/src/infrastructure/database/drizzle/`

**Frontend - Adding a new feature:**
1. Create feature folder in `web/src/features/your-feature/`
2. Add components in `your-feature/components/`
3. Add API schemas in `your-feature/api/`
4. Add hooks in `your-feature/hooks/`
5. Create routes in `web/src/app/routes/` if needed

## 🎨 Code Formatting

Both packages use Biome for consistent code formatting.

In the `api` folder, run:
```bash
pnpm run format
```

In the `web` folder, run:
```bash
pnpm run format
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

Built with modern web technologies and professional architectural patterns:
- **Clean Architecture** on the backend for maintainability and testability
- **Feature-based Architecture** on the frontend for scalability
- **Type-safety** throughout the entire stack with TypeScript and Zod
- **Best practices** for a seamless developer experience

---

**Made with ❤️ by developers, for developers**
