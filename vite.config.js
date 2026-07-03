import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    port: 5174,
    strictPort: true,
    watch: {
      usePolling: true, // تفعيل الاقتراع بدلاً من مراقبة نظام التشغيل
      interval: 1000 // فحص التغييرات كل ثانية (يمكن تقليله لـ 500 إذا أردت أسرع)
    }
  }
});
