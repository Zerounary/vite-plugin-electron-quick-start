
export { }

type AppModules = {
  mainWindow: BrowserWindow | null,
}

declare global {
  interface Window {
    removeLoading: () => void
    router: Router
    modules: AppModules
  }
}
