import 'server-only'
import type { AppData } from '@/lib/app-context'
import seed from '@/data/app-data.json'
import {
  readJsonFile,
  writeJsonFile,
  isGitHubConfigured,
} from '@/lib/github-storage'

/**
 * ──────────────────────────────────────────────────────────────
 *  App data store
 * ──────────────────────────────────────────────────────────────
 *  High-level helpers for the main application data file. Built on
 *  top of the generic GitHub storage layer so the repo is the
 *  single source of truth. Falls back to the bundled seed JSON when
 *  GitHub is not configured (e.g. local preview before env setup).
 */

/** Path of the data file inside the repository. */
export const DATA_PATH = process.env.GITHUB_DATA_PATH || 'data/app-data.json'

/** The bundled default data, used as a fallback. */
export const defaultAppData = seed as unknown as AppData

export interface LoadResult {
  data: AppData
  /** Whether the data came from GitHub (true) or the local seed (false). */
  fromGitHub: boolean
}

/** Loads the application data from GitHub, falling back to the seed file. */
export async function loadAppData(): Promise<LoadResult> {
  if (!isGitHubConfigured()) {
    return { data: defaultAppData, fromGitHub: false }
  }
  const { data } = await readJsonFile<AppData>(DATA_PATH, defaultAppData)
  return { data, fromGitHub: true }
}

/**
 * Saves the application data to GitHub (creating an automatic commit).
 * Reads the current SHA first so the update targets the latest version.
 */
export async function saveAppData(data: AppData, commitMessage?: string): Promise<void> {
  const { sha } = await readJsonFile<AppData>(DATA_PATH, defaultAppData)
  await writeJsonFile(
    DATA_PATH,
    data,
    commitMessage || `chore(data): update app data via admin panel`,
    sha,
  )
}
