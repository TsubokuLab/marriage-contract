import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Actions では GITHUB_REPOSITORY="owner/repo-name" が自動セットされる
// → base を "/repo-name/" に設定して GitHub Pages の URL に合わせる
// ローカルでは未定義なので "./" のまま
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repoName ? `/${repoName}/` : './'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
  },
})
