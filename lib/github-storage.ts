import 'server-only'

/**
 * ──────────────────────────────────────────────────────────────
 *  GitHub Storage Layer
 * ──────────────────────────────────────────────────────────────
 *  A small, reusable wrapper around the GitHub Contents API that
 *  lets us read & write JSON files directly inside the project's
 *  GitHub repository. Every write creates an automatic commit, so
 *  the repo itself becomes the persistent data source.
 *
 *  Reuse it for any future data file (lectures, books, news, ...):
 *
 *    const { data, sha } = await readJsonFile<MyType>('data/news.json')
 *    await writeJsonFile('data/news.json', newData, 'chore: update news', sha)
 *
 *  Required environment variables:
 *    - GITHUB_TOKEN   : a Personal Access Token with `repo` (contents) write access
 *    - GITHUB_REPO    : the repository in "owner/name" form (e.g. mohmaed-hack/university-system)
 *    - GITHUB_BRANCH  : the branch to commit to (e.g. main / master)
 *
 *  Sensitive values live ONLY on the server and are never exposed to the client.
 */

const GITHUB_API = 'https://api.github.com'

export interface GitHubConfig {
  token: string
  owner: string
  repo: string
  branch: string
}

export interface ReadResult<T> {
  data: T
  /** The blob SHA, required when updating an existing file. */
  sha: string | null
}

/** Thrown for any GitHub-related failure so callers can react gracefully. */
export class GitHubStorageError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'GitHubStorageError'
    this.status = status
  }
}

/**
 * Reads & validates the GitHub configuration from environment variables.
 * Returns `null` when the integration is not configured, so the app can
 * fall back to local/default data instead of crashing.
 */
export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !repo || !repo.includes('/')) return null

  const [owner, name] = repo.split('/')
  if (!owner || !name) return null

  return { token, owner, repo: name, branch }
}

/** Whether the GitHub storage layer is fully configured. */
export function isGitHubConfigured(): boolean {
  return getGitHubConfig() !== null
}

function authHeaders(config: GitHubConfig): HeadersInit {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

function contentsUrl(config: GitHubConfig, path: string): string {
  const cleanPath = path.replace(/^\/+/, '')
  return `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${cleanPath}`
}

// base64 helpers that work in the Node/Edge runtimes
function decodeBase64(content: string): string {
  return Buffer.from(content, 'base64').toString('utf-8')
}

function encodeBase64(content: string): string {
  return Buffer.from(content, 'utf-8').toString('base64')
}

/**
 * Reads a JSON file from the repository.
 * Returns the parsed data plus the blob SHA (needed for subsequent writes).
 * If the file does not exist yet, `sha` is `null` and `data` is `fallback`.
 */
export async function readJsonFile<T>(path: string, fallback: T): Promise<ReadResult<T>> {
  const config = getGitHubConfig()
  if (!config) throw new GitHubStorageError('GitHub storage is not configured')

  const res = await fetch(`${contentsUrl(config, path)}?ref=${encodeURIComponent(config.branch)}`, {
    headers: authHeaders(config),
    cache: 'no-store',
  })

  if (res.status === 404) {
    return { data: fallback, sha: null }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new GitHubStorageError(`Failed to read "${path}": ${res.status} ${text}`, res.status)
  }

  const json = (await res.json()) as { content?: string; sha: string }
  if (!json.content) {
    return { data: fallback, sha: json.sha ?? null }
  }

  try {
    const decoded = decodeBase64(json.content)
    return { data: JSON.parse(decoded) as T, sha: json.sha }
  } catch {
    throw new GitHubStorageError(`File "${path}" does not contain valid JSON`)
  }
}

/**
 * Writes (creates or updates) a JSON file in the repository, producing
 * an automatic commit. Pass the current `sha` when updating an existing
 * file; omit it (or pass null) to create a new file.
 */
export async function writeJsonFile<T>(
  path: string,
  data: T,
  message: string,
  sha?: string | null,
): Promise<{ sha: string }> {
  const config = getGitHubConfig()
  if (!config) throw new GitHubStorageError('GitHub storage is not configured')

  const body: Record<string, unknown> = {
    message,
    content: encodeBase64(JSON.stringify(data, null, 2) + '\n'),
    branch: config.branch,
  }
  if (sha) body.sha = sha

  const res = await fetch(contentsUrl(config, path), {
    method: 'PUT',
    headers: authHeaders(config),
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new GitHubStorageError(`Failed to write "${path}": ${res.status} ${text}`, res.status)
  }

  const json = (await res.json()) as { content?: { sha: string } }
  return { sha: json.content?.sha ?? '' }
}
