# React + Vite

## Vercel deployment

Set the project root directory to `Frontend/agrinext-client` in Vercel and add this
environment variable for Production (and Preview if needed):

```env
VITE_API_URL=https://agrinex-ov8y.onrender.com/api
```

Vite embeds `VITE_` variables at build time, so redeploy after changing them.
If location suggestions are needed, also set `VITE_GEOAPIFY_API_KEY` in Vercel.

For local development, copy `.env.example` to `.env` and add your Geoapify API key.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
