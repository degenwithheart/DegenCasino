#!/usr/bin/env node
/**
 * DegenCasino exhaustive changelog generator (tag-aware)
 *
 * Features:
 * - Enumerates ALL commits via GitHub API pagination.
 * - Tag-aware mode: builds one section per tag (Keep a Changelog style),
 *   plus an Unreleased section from the latest tag to HEAD.
 * - Single-range mode: generate for a specific from..to range or entire default branch.
 * - Categorizes commits by heuristics (Features, Fixes, Security, CI, Docs, etc.) using both message and file paths.
 * - Improves "generic" commit titles by inferring areas and diff stats (no rewriting history).
 *
 * Usage examples:
 *   export GH_TOKEN=ghp_...   # recommended to avoid rate limits
 *
 *   # All tags from v1.0.0 onward, with Unreleased at top:
 *   node scripts/generate-changelog.mjs --owner degenwithheart --repo DegenCasino --all-tags --from-tag v1.0.0 > CHANGELOG.md
 *
 *   # Only the latest release section (last tag -> HEAD):
 *   node scripts/generate-changelog.mjs --owner degenwithheart --repo DegenCasino --latest-only --title "2.1.0" > CHANGELOG.md
 *
 *   # Specific range:
 *   node scripts/generate-changelog.mjs --owner degenwithheart --repo DegenCasino --from v2.0.0 --to v2.1.0 --title "2.1.0" > CHANGELOG.md
 *
 * Options:
 *   --owner <owner>        GitHub owner (default: env REPO_OWNER or "degenwithheart")
 *   --repo <repo>          GitHub repo  (default: env REPO_NAME or "DegenCasino")
 *   --branch <name>        Branch/ref for Unreleased (default: default branch)
 *   --from <ref>           Base ref for single-range mode
 *   --to <ref>             Head ref for single-range mode (default: branch)
 *   --title <string>       Section title to emit for single-range mode (default: "Unreleased")
 *   --out <path>           Write output to a file
 *   --max-details <n>      Limit number of per-commit detail fetches (debug; default: unlimited)
 *   --concurrency <n>      Parallel API calls (default: 6)
 *
 * Tag-aware options:
 *   --all-tags             Generate one section per tag (sorted semver), plus Unreleased
 *   --from-tag <tag>       Start from this tag (inclusive) when using --all-tags
 *   --latest-only          Only generate the latest section (last tag -> HEAD), skip older tags
 *   --no-unreleased        Skip Unreleased section (by default it is included with --all-tags)
 *
 * Notes:
 * - To start at your Gamba baseline, tag that commit as v1.0.0, then use --all-tags --from-tag v1.0.0
 * - If you wiped and force-pushed an unrelated history, older commits will only appear if they’re still reachable via tags/branches.
 */

import fs from 'node:fs/promises'
import process from 'node:process'
import { Octokit } from 'octokit'

/* ------------------------ CLI ARGS ------------------------ */
function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    const next = argv[i + 1]
    if (a === '--owner') args.owner = next, i++
    else if (a === '--repo') args.repo = next, i++
    else if (a === '--branch') args.branch = next, i++
    else if (a === '--from') args.from = next, i++
    else if (a === '--to') args.to = next, i++
    else if (a === '--title') args.title = next, i++
    else if (a === '--out') args.out = next, i++
    else if (a === '--max-details') args.maxDetails = parseInt(next, 10), i++
    else if (a === '--concurrency') args.concurrency = parseInt(next, 10), i++
    else if (a === '--all-tags') args.allTags = true
    else if (a === '--from-tag') args.fromTag = next, i++
    else if (a === '--latest-only') args.latestOnly = true
    else if (a === '--no-unreleased') args.noUnreleased = true
    else if (a === '--help' || a === '-h') args.help = true
  }
  return args
}

const ARGS = parseArgs(process.argv)
if (ARGS.help) {
  console.error('See file header for usage examples.')
  process.exit(0)
}

const OWNER = ARGS.owner || process.env.REPO_OWNER || 'degenwithheart'
const REPO = ARGS.repo || process.env.REPO_NAME || 'DegenCasino'
const TOKEN = process.env.GH_TOKEN
const CONCURRENCY = Number.isFinite(ARGS.concurrency) ? ARGS.concurrency : 6
const MAX_DETAILS = Number.isFinite(ARGS.maxDetails) ? ARGS.maxDetails : Infinity

const octokit = new Octokit(TOKEN ? { auth: TOKEN } : {})

/* ------------------------ HELPERS ------------------------ */
const GENERIC_RX = [
  /^update(s)?\b/i, /^updates?\b.*$/i, /^change(s)?\b/i, /^misc\b/i, /^wip\b/i,
  /^tweak(s)?\b/i, /^commit\b/i, /^chore\b$/i, /^refactor\b$/i, /^fix\b$/i,
  /^adjust(ments)?\b/i, /^minor\b/i, /^cleanup\b$/i, /^sync\b$/i, /^bump\b$/i,
  /^edit(s)?\b$/i, /^work\b$/i,
]

function isGenericTitle(title) {
  if (!title) return true
  const t = title.trim()
  if (t.length <= 2) return true
  return GENERIC_RX.some(rx => rx.test(t))
}

const GROUP_RX = [
  { name: 'Features', rx: /(^feat(\(|:|\s)|\bfeat\b|\bfeature(s)?\b|\badd(ed)?\b|\bintroduc(e|ed|es)\b)/i },
  { name: 'Fixes', rx: /(^fix(\(|:|\s)|\bfix(e[ds])?\b|\bbug(s)?\b|\bhotfix\b|\bpatch\b)/i },
  { name: 'Performance', rx: /(^perf(\(|:|\s)|\bperf\b|\boptim(ize|ise|ization|isation)\b|\bspeed\b)/i },
  { name: 'Security', rx: /(^sec(urity)?(\(|:|\s)|\bcve\b|\bxss\b|\bcsrf\b|\bcsp\b|\bhsts\b|\bheader(s)?\b|\bsecurity\b)/i },
  { name: 'Docs', rx: /(^doc(s)?(\(|:|\s)|\breadme\b|\bchangelog\b|\blicense\b|\bdocs?\b)/i },
  { name: 'CI', rx: /(^ci(\(|:|\s)|\bworkflow(s)?\b|\bgithub\s*actions\b|\bci\b)/i },
  { name: 'Refactors', rx: /(^refactor(\(|:|\s)|\brefactor\b|\bcleanup\b|\brestructure\b|\brewrite\b)/i },
  { name: 'Chores / Deps', rx: /(^chore(\(|:|\s)|\bchore\b|\bdeps?\b|\bdependenc(y|ies)\b|\bbump\b|\bupdate\b)/i },
  { name: 'Style', rx: /(^style(\(|:|\s)|\bstyle\b|\bprettier\b|\beslint\b|\blint\b|\bformat\b)/i },
  { name: 'Tests', rx: /(^test(\(|:|\s)|\btest(s|ing)?\b|\bjest\b|\bvitest\b|\bcoverage\b)/i },
  { name: 'Build / Release', rx: /(^build(\(|:|\s)|^release(\(|:|\s)|^version(\(|:|\s)|\bbuild\b|\brelease\b|\bversion\b|\btag\b)/i },
  { name: 'Reverts', rx: /^revert(\(|:|\s)/i },
]

const AREA_MAP = [
  { rx: /^public\/sw\.js$/i, area: 'Service Worker' },
  { rx: /^public\/(?!sw\.js).*$/i, area: 'Static Assets' },
  { rx: /^\.github\/workflows\//i, area: 'CI' },
  { rx: /^docs?\//i, area: 'Docs' },
  { rx: /^readme\.md$/i, area: 'Docs' },
  { rx: /^security\.md$/i, area: 'Security Docs' },
  { rx: /^\.well-known\/security\.txt$/i, area: 'Security Docs' },
  { rx: /^vercel\.json$/i, area: 'Deploy / Headers' },
  { rx: /^netlify\.toml$/i, area: 'Deploy / Headers' },
  { rx: /^src\/components\//i, area: 'UI Components' },
  { rx: /^src\/pages\//i, area: 'Pages / Routing' },
  { rx: /^src\/routes?\//i, area: 'Pages / Routing' },
  { rx: /^src\/utils?\//i, area: 'Utils / Lib' },
  { rx: /^src\/lib\//i, area: 'Utils / Lib' },
  { rx: /^src\/constants\//i, area: 'Constants' },
  { rx: /^api\//i, area: 'API' },
  { rx: /^scripts?\//i, area: 'Build Scripts' },
  { rx: /^manifest\.webmanifest$/i, area: 'PWA / Manifest' },
  { rx: /^public\/manifest\.webmanifest$/i, area: 'PWA / Manifest' },
  { rx: /^(tailwind|postcss|vite|tsconfig|eslint|prettier)\./i, area: 'Build / Config' },
  { rx: /^package(-lock)?\.json$/i, area: 'Dependencies' },
  { rx: /^(pnpm-lock|yarn\.lock)$/i, area: 'Dependencies' },
]

function deriveAreas(files) {
  const areas = new Set()
  for (const f of files || []) {
    const path = f.filename || ''
    const found = AREA_MAP.find(m => m.rx.test(path))
    if (found) areas.add(found.area)
    else {
      const m = path.split('/')[0]
      if (m) areas.add(m)
    }
  }
  return Array.from(areas)
}

function categorizeByFiles(message, files) {
  const msg = message || ''
  const has = (rx) => (files || []).some(f => rx.test(f.filename || ''))
  if (has(/^\.github\/workflows\//i)) return 'CI'
  if (has(/^readme\.md$/i) || has(/^docs?\//i)) return 'Docs'
  if (has(/^vercel\.json$/i) || has(/^security\.md$/i) || has(/^\.well-known\/security\.txt$/i)) return 'Security'
  if (has(/^public\/sw\.js$/i)) return 'Security'
  if (has(/^package(-lock)?\.json$/i) || has(/^(pnpm-lock|yarn\.lock)$/i)) return 'Chores / Deps'
  if (has(/^src\/.*\.(test|spec)\./i) || has(/^tests?\//i)) return 'Tests'
  if (has(/^src\/.*\.(css|scss|sass)$/i) || has(/^styles?\//i)) return 'Style'
  for (const g of GROUP_RX) if (g.rx.test(msg)) return g.name
  return 'Other'
}

function categorize(message, files) {
  for (const g of GROUP_RX) if (g.rx.test(message || '')) return g.name
  return categorizeByFiles(message || '', files)
}

function formatStats(stats, files) {
  let add = stats?.additions ?? 0
  let del = stats?.deletions ?? 0
  if (!stats && Array.isArray(files)) {
    for (const f of files) {
      add += f.additions || 0
      del += f.deletions || 0
    }
  }
  const fc = Array.isArray(files) ? files.length : 0
  return { add, del, fc }
}

function deriveMessageIfGeneric(originalTitle, areas, stats) {
  const title = (originalTitle || '').trim()
  if (!isGenericTitle(title)) return title
  const parts = []
  if (areas.length) parts.push(areas.slice(0, 3).join(', '))
  else parts.push('Repository')
  const details = []
  if (typeof stats.fc === 'number') details.push(`${stats.fc} files`)
  if (typeof stats.add === 'number' || typeof stats.del === 'number') details.push(`+${stats.add} −${stats.del}`)
  const detailStr = details.length ? ` — ${details.join(', ')}` : ''
  return `Update ${parts.join(' / ')}${detailStr}`
}

function pLimit(n) {
  let running = 0
  const queue = []
  const next = () => {
    if (running >= n || queue.length === 0) return
    running++
    const { fn, resolve, reject } = queue.shift()
    fn().then(
      (v) => { running--; resolve(v); next() },
      (e) => { running--; reject(e); next() }
    )
  }
  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject }); next()
  })
}

function parseSemver(tag) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(tag)
  if (!m) return null
  return { major: +m[1], minor: +m[2], patch: +m[3] }
}
function compareSemver(a, b) {
  if (!a.sem && !b.sem) return 0
  if (!a.sem) return 1
  if (!b.sem) return -1
  if (a.sem.major !== b.sem.major) return a.sem.major - b.sem.major
  if (a.sem.minor !== b.sem.minor) return a.sem.minor - b.sem.minor
  return a.sem.patch - b.sem.patch
}

/* ------------------------ FETCHERS ------------------------ */
async function getDefaultBranch() {
  const { data } = await octokit.rest.repos.get({ owner: OWNER, repo: REPO })
  return data.default_branch || 'main'
}

async function fetchCommitsAll(ref) {
  return octokit.paginate(octokit.rest.repos.listCommits, {
    owner: OWNER, repo: REPO, sha: ref, per_page: 100,
  })
}

async function fetchCommitsBetween(base, head, page = 1) {
  const out = []
  while (true) {
    const { data } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner: OWNER, repo: REPO, basehead: `${base}...${head}`, per_page: 100, page,
    })
    const items = data?.commits || []
    out.push(...items)
    if (items.length < 100) break
    page++
  }
  return out
}

async function fetchCommitDetails(sha) {
  const { data } = await octokit.rest.repos.getCommit({ owner: OWNER, repo: REPO, ref: sha })
  return data
}

async function fetchAllTags() {
  const tags = await octokit.paginate(octokit.rest.repos.listTags, {
    owner: OWNER, repo: REPO, per_page: 100,
  })
  // Enrich with commit date and semver
  const limit = pLimit(CONCURRENCY)
  const enriched = await Promise.all(tags.map(t => limit(async () => {
    let date = '1970-01-01'
    try {
      const c = await fetchCommitDetails(t.commit.sha)
      date = new Date(c.commit.author?.date || c.commit.committer?.date || Date.now())
        .toISOString().slice(0, 10)
    } catch {}
    return { name: t.name, sha: t.commit.sha, date, sem: parseSemver(t.name) }
  })))
  // Sort primarily by semver if available, else by date
  enriched.sort((a, b) => {
    const sv = compareSemver(a, b)
    if (sv !== 0) return sv
    return a.date.localeCompare(b.date)
  })
  return enriched
}

/* ------------------------ CORE FORMATTERS ------------------------ */
function formatEntryMarkdown(entry) {
  const fileMeta = []
  if (typeof entry.fc === 'number') fileMeta.push(`${entry.fc} files`)
  if (typeof entry.add === 'number' || typeof entry.del === 'number') fileMeta.push(`+${entry.add} −${entry.del}`)
  const metaStr = fileMeta.length ? ` [${fileMeta.join(', ')}]` : ''
  return `- ${entry.message} (${entry.sha}) by ${entry.author} on ${entry.date}${metaStr}`
}

async function detailifyCommits(commits) {
  const limit = pLimit(CONCURRENCY)
  const limited = commits.slice(0, MAX_DETAILS).map((c) => limit(async () => {
    const sha = c.sha
    const summaryLine = (c.commit?.message || '').split('\n')[0]
    const author = c.commit?.author?.name || c.author?.login || 'unknown'
    const date = new Date(c.commit?.author?.date || c.commit?.committer?.date || Date.now())
      .toISOString().slice(0, 10)

    let files = []
    let stats = null
    try {
      const detail = await fetchCommitDetails(sha)
      files = detail.files || []
      stats = detail.stats || null
    } catch {
      files = []; stats = null
    }

    const areas = deriveAreas(files)
    const { add, del, fc } = formatStats(stats, files)
    const displayMsg = deriveMessageIfGeneric(summaryLine, areas, { add, del, fc })
    const group = categorize(summaryLine, files)

    return {
      sha: sha.slice(0, 10),
      message: displayMsg,
      author,
      date,
      add,
      del,
      fc,
      group,
    }
  }))
  return Promise.all(limited)
}

function groupAndSort(entries) {
  const GROUP_ORDER = [...GROUP_RX.map(g => g.name), 'Other']
  const grouped = new Map()
  for (const e of entries) {
    const k = e.group || 'Other'
    if (!grouped.has(k)) grouped.set(k, [])
    grouped.get(k).push(e)
  }
  for (const [k, arr] of grouped.entries()) {
    arr.sort((a, b) => (a.date < b.date ? 1 : -1))
  }
  const existing = new Set(grouped.keys())
  const ordered = GROUP_ORDER.filter(g => existing.has(g))
    .concat(Array.from(existing).filter(g => !GROUP_ORDER.includes(g)))
  return { grouped, ordered }
}

/* ------------------------ EMIT SECTIONS ------------------------ */
async function emitSingleSection({ title, base, head }) {
  let commits = []
  if (base) commits = await fetchCommitsBetween(base, head)
  else commits = await fetchCommitsAll(head)

  const entries = await detailifyCommits(commits)
  const { grouped, ordered } = groupAndSort(entries)

  let out = ''
  out += `## [${title || 'Unreleased'}]\n`
  for (const g of ordered) {
    const list = grouped.get(g)
    if (!list || list.length === 0) continue
    out += `\n### ${g}\n`
    for (const e of list) out += `${formatEntryMarkdown(e)}\n`
  }
  out += '\n'
  return out
}

async function emitTagSections({ fromTag, includeUnreleased = true, latestOnly = false, branchRef }) {
  const tags = await fetchAllTags()
  const branch = branchRef || await getDefaultBranch()
  const filtered = fromTag ? tags.filter(t => t.name === fromTag || compareSemver({ sem: parseSemver(t.name) }, { sem: parseSemver(fromTag) }) >= 0) : tags
  if (filtered.length === 0) throw new Error('No tags found (check --from-tag or create tags).')

  // Sections to build: for each adjacent pair prev -> curr, plus initial section for the very first tag (optional policy)
  const pairs = []
  for (let i = 0; i < filtered.length; i++) {
    const prev = filtered[i - 1]
    const curr = filtered[i]
    if (prev) {
      pairs.push({ base: prev.name, head: curr.name, title: curr.name, date: curr.date })
    } else {
      // Initial release: commits reachable from first tag
      pairs.push({ base: null, head: curr.name, title: curr.name, date: curr.date, initial: true })
    }
  }

  // Latest-only mode: just last tag -> HEAD
  if (latestOnly) {
    const last = filtered[filtered.length - 1]
    const unreleased = await emitSingleSection({ title: 'Unreleased', base: last.name, head: branch })
    return `## [${last.name}] - ${last.date}\n\n` + (await emitSingleSection({ title: last.name, base: filtered[filtered.length - 2]?.name, head: last.name })) + (includeUnreleased ? unreleased : '')
  }

  let out = ''
  // Unreleased on top (latestTag -> HEAD)
  if (includeUnreleased && filtered.length > 0) {
    const latest = filtered[filtered.length - 1]
    out += await emitSingleSection({ title: 'Unreleased', base: latest.name, head: branch })
  }

  // Emit each tag section from newest to oldest for readability
  for (let i = filtered.length - 1; i >= 0; i--) {
    const prev = filtered[i - 1]
    const curr = filtered[i]
    const title = curr.name
    const header = `## [${title}] - ${curr.date}\n\n`
    const body = await emitSingleSection({ title, base: prev ? prev.name : null, head: curr.name })
    out += header + body
  }
  return out
}

/* ------------------------ MAIN ------------------------ */
async function main() {
  const branch = ARGS.branch || await getDefaultBranch()
  let output = ''
  output += '# Changelog\n'
  output += 'All notable changes to this project are documented here.\n\n'
  output += 'This project follows Keep a Changelog and uses Semantic Versioning.\n\n'

  if (ARGS.allTags || ARGS.latestOnly) {
    const sections = await emitTagSections({
      fromTag: ARGS.fromTag,
      includeUnreleased: !ARGS.noUnreleased,
      latestOnly: !!ARGS.latestOnly,
      branchRef: branch,
    })
    output += sections
  } else {
    const title = ARGS.title || 'Unreleased'
    const head = ARGS.to || branch
    const base = ARGS.from || null
    output += await emitSingleSection({ title, base, head })
  }

  if (ARGS.out) {
    await fs.writeFile(ARGS.out, output, 'utf8')
    process.stderr.write(`Wrote changelog to ${ARGS.out}\n`)
  } else {
    process.stdout.write(output)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})