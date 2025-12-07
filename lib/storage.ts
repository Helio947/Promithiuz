import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export type StoredFile = { url: string; key: string; localPath?: string }

export interface StorageProvider {
  saveFile(file: Buffer, filename: string, mimetype: string): Promise<StoredFile>
  deleteFile(key: string): Promise<void>
}

class LocalStorageProvider implements StorageProvider {
  basePath: string
  constructor(basePath = process.env.STORAGE_LOCAL_PATH || path.join(process.cwd(), 'public', 'uploads')) {
    this.basePath = basePath
    if (!fs.existsSync(this.basePath)) fs.mkdirSync(this.basePath, { recursive: true })
  }

  async saveFile(file: Buffer, filename: string): Promise<StoredFile> {
    const key = `${randomUUID()}-${filename}`
    const filePath = path.join(this.basePath, key)
    await fs.promises.writeFile(filePath, file)
    return { url: `/uploads/${key}`, key, localPath: filePath }
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key)
    if (fs.existsSync(filePath)) await fs.promises.unlink(filePath)
  }
}

class S3LikeStorageProvider implements StorageProvider {
  // Placeholder for real S3 implementation; replace with SDK of choice.
  async saveFile(): Promise<StoredFile> {
    throw new Error('S3 storage not implemented. Plug in your provider here.')
  }

  async deleteFile(): Promise<void> {
    return
  }
}

export function getStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER || 'local'
  if (driver === 's3') {
    return new S3LikeStorageProvider()
  }
  return new LocalStorageProvider()
}
