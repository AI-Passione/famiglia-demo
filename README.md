# 💎 AI Passione: The Demo Showcase

Welcome to the official demo repository of **La Passione Inc.** This is where we showcase the elite, autonomous power of the Famiglia in a premium web environment.

---

## 🌊 The Vibe
This isn't just a repo; it's a performance. We prioritize:
- **Premium Aesthetics**: Glassmorphism, smooth gradients, and elite typography.
- **Autonomous Intelligence**: Designed for AI agents to build, maintain, and scale with minimal human overhead.
- **Milano Flair**: High-fashion tech, sharp interactions, and a "WOW" factor in every component.

## 🏛 Architecture
- **Frontend**: A high-performance showcase built for visual impact.
- **Backend**: Powered by **Supabase** for real-time agility and reliable persistence.
- **Core Link**: For the heavy lifting and business logic, we refer to the [famiglia-core](https://github.com/AI-Passione/famiglia-core) ecosystem.

## 🤖 AI Interaction
If you are an AI agent working in this repo:
1. Read the **[AI_MANIFESTO.md](AI_MANIFESTO.md)**.
2. Follow the model-specific instructions in **[GEMINI.md](GEMINI.md)** (for Gemini) or the **[.cursorrules](.cursorrules)** (for Cursor).
3. Always verify your UI changes visually. "Good enough" is not an option for **Don Jimmy**.

---

## 🚀 Getting Started
1. **Clone** the repo.
2. **Install** dependencies: `npm install`.
3. **Configure** your `.env` with Supabase credentials.
4. **Run** the demo: `npm run dev`.

---

## 🐳 Docker Quickstart (Full Stack)
Run the entire Famiglia ecosystem locally using production images from GHCR.

1. **Prerequisites**: Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
2. **Setup**: Copy `.env.example` to `.env` and configure your API keys.
3. **Fetch Images**: 
   ```bash
   make pull
   ```
4. **Launch**:
   ```bash
   make up
   ```
5. **Monitor**:
   ```bash
   make logs
   ```

> [!NOTE]
> This stack uses local Postgres and Redis instances. Ensure your `.env` is properly configured to point to these services within the Docker network.

---

*Keep the vibes high. Welcome to the Family.*
