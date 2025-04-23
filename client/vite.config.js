import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      //eslint-disable-next-line
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 2100,
  },
})
