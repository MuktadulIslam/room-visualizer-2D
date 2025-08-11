# Room Visualizer 2D

A Next.js-based 2D room visualization application with 3D capabilities using Three.js. This project allows users to visualize and design room layouts with interactive furniture placement and texture customization.

## Features

- 2D room layout visualization
- Interactive furniture placement
- Custom texture uploads and management
- Responsive design with Tailwind CSS
- Built with Next.js 15 and React 19
- 3D graphics powered by Three.js and React Three Fiber

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager

### Local Development

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker Deployment

This project is fully dockerized for easy deployment and development. See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

### Quick Docker Commands

```bash
# Development mode
./docker-run.sh dev          # Linux/Mac
docker-run.bat dev           # Windows

# Production mode
./docker-run.sh prod         # Linux/Mac
docker-run.bat prod          # Windows

# Stop containers
./docker-run.sh stop         # Linux/Mac
docker-run.bat stop          # Windows
```

### Docker Compose

```bash
# Development
docker-compose --profile dev up --build

# Production
docker-compose --profile prod up --build -d
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Main page component
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/          # React components
│   ├── Room.tsx        # Room visualization component
│   ├── Furnitures.tsx  # Furniture management
│   ├── Sidebar.tsx     # Control panel
│   └── CustomTextureUpload.tsx # Texture upload
└── context/            # React context
    └── TextureContext.tsx # Texture state management
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Three.js Documentation](https://threejs.org/docs/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker Deployment

For production deployment using Docker, see [DOCKER.md](./DOCKER.md) for comprehensive instructions.
