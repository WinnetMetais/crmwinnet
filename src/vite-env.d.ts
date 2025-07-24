/// <reference types="vite/client" />

// Temporary fix for module resolution issues
declare module "*.tsx" {
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module "*.ts" {
  const content: any;
  export default content;
}
