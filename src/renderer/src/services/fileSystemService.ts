export const fileSystemService = {
  getDirectory: (dirPath: string) => {
    return window.api.fs.getDirectory(dirPath)
  },
  delete: (targetPath: string) => {
    return window.api.fs.delete(targetPath)
  },
  createFolder: (targetPath: string, name: string) => {
    return window.api.fs.createFolder(targetPath, name)
  },
  createFile: (targetPath: string, name: string) => {
    return window.api.fs.createFile(targetPath, name)
  },
  rename: (targetPath: string, name: string) => {
    return window.api.fs.rename(targetPath, name)
  },
  saveFile: (filePath: string, content: string) => {
    return window.api.fs.saveFile(filePath, content)
  },
  getFileInfo: (filePath: string) => {
    return window.api.fs.getFileInfo(filePath)
  },

  getPathForFile: (file: File) => {
    return window.api.fs.getPathForFile(file)
  }
}
