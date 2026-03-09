This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Chennai Chatbot

This app now includes a Chennai-focused health chatbot built with:

- `@langchain/langgraph` for the agent loop
- `@langchain/groq` for the LLM
- local tools for:
	- Chennai health news briefings
	- Chennai hospital and emergency guidance
	- event medical planning
	- prototype appointment booking

### Environment

Add these values in `.env`:

```bash
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

### Routes

- `POST /api/chat`
- `POST /api/book-appointment`
- `POST /api/groq`

### Quick local test

```bash
curl -X POST http://localhost:3000/api/chat \
	-H "Content-Type: application/json" \
	-d '{"message":"Give me today\'s Chennai health highlights."}'

curl -X POST http://localhost:3000/api/book-appointment \
	-H "Content-Type: application/json" \
	-d '{"name":"Asha","date":"2026-03-12","time":"10:30 AM","clinic":"Chennai Community Clinic","department":"General Medicine"}'
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
