/**
 * Prebuild script: fetches latest CMS content & settings from the API
 * and writes them to src/generated/cached-cms-data.json.
 *
 * This JSON is imported by cms.ts as the default content, so every
 * Vercel deploy bakes the latest data into the bundle — all users
 * on any device see up-to-date content instantly.
 *
 * Usage: node scripts/prefetch-content.mjs
 * (called automatically by "npm run build")
 */

const API_BASE = process.env.VITE_CMS_API_URL || 'https://andrian-be-services-v1.vercel.app/api'

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = resolve(__dirname, '..', 'src', 'generated', 'cached-cms-data.json')

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} responded with ${res.status}`)
  const json = await res.json()
  return json?.data ?? json
}

async function main() {
  console.log(`[prefetch] Fetching CMS data from ${API_BASE} ...`)

  let content = null
  let settings = null

  try {
    const [c, s] = await Promise.all([
      fetchJson(`${API_BASE}/content`),
      fetchJson(`${API_BASE}/settings`),
    ])
    content = c
    settings = s
    console.log('[prefetch] ✓ CMS data fetched successfully')
  } catch (err) {
    console.warn('[prefetch] ⚠ Could not fetch CMS data, build will use hardcoded defaults')
    console.warn('[prefetch]  ', err.message)
  }

  const output = { content, settings, fetchedAt: new Date().toISOString() }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')

  console.log(`[prefetch] ✓ Wrote cached data to src/generated/cached-cms-data.json`)
}

main()
