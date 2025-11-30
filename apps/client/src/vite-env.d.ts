/* eslint-disable @typescript-eslint/consistent-type-imports */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

type ImportMetaEnvAugmented =
  import('@julr/vite-plugin-validate-env').ImportMetaEnvAugmented<
    typeof import('@/env/config').default
  >;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv extends ImportMetaEnvAugmented {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
