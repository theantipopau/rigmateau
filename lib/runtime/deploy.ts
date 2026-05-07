export type DeployTarget = 'github-pages' | 'cloudflare'

const RAW_TARGET = process.env.NEXT_PUBLIC_DEPLOY_TARGET

export const DEPLOY_TARGET: DeployTarget =
  RAW_TARGET === 'github-pages' ? 'github-pages' : 'cloudflare'

export const IS_GITHUB_PAGES = DEPLOY_TARGET === 'github-pages'
export const IS_BUILD_TIME = process.env.NEXT_PHASE === 'phase-production-build'
export const USE_STATIC_DATA = IS_GITHUB_PAGES || IS_BUILD_TIME

const RAW_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH

export const BASE_PATH = RAW_BASE_PATH
  ? RAW_BASE_PATH.startsWith('/')
    ? RAW_BASE_PATH
    : `/${RAW_BASE_PATH}`
  : IS_GITHUB_PAGES
    ? '/rigmateau'
    : ''

export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!BASE_PATH) {
    return normalized
  }
  if (normalized.startsWith(BASE_PATH + '/')) {
    return normalized
  }
  if (normalized === BASE_PATH) {
    return normalized
  }
  return `${BASE_PATH}${normalized}`
}

export function toAbsoluteUrl(path: string): string {
  if (typeof window === 'undefined') {
    return withBasePath(path)
  }
  return `${window.location.origin}${withBasePath(path)}`
}
