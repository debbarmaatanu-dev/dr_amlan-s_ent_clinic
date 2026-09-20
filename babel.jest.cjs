module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-typescript'],
    ['@babel/preset-react', {runtime: 'automatic'}],
  ],
  plugins: [
    function viteImportMetaEnv() {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === 'import' &&
              path.node.property.name === 'meta'
            ) {
              path.replaceWithSourceString(
                `{env: {
                  VITE_API_BACKEND_URL: "http://backend.test",
                  VITE_FIREBASE_ADMIN_EMAIL1: "admin1@test.com",
                  VITE_FIREBASE_ADMIN_EMAIL2: "admin2@test.com",
                  DEV: true,
                  PROD: false
                }}`,
              );
            }
          },
        },
      };
    },
  ],
};
