/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DADATA_TOKEN: string
  readonly VITE_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
