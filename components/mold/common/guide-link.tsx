'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { buildGuideUrl } from '@/lib/navigation/guide-url'

interface GuideLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  children?: React.ReactNode
  source?: string
  href?: string
}

/**
 * Autonomous, zero-prop Guide Link component.
 * Automatically captures the ambient route & query parameters (e.g. `/?subject=...`, `/subjects`)
 * and constructs the contextual `/guide` URL with return metadata.
 */
export function GuideLink({ children, source, href, ...rest }: GuideLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const targetHref = useMemo(() => {
    if (href) return href
    const qs = searchParams?.toString()
    const currentUrl = qs ? `${pathname}?${qs}` : pathname
    return buildGuideUrl({
      fromUrl: currentUrl || '/',
      utmSource: source || 'app_link',
    })
  }, [pathname, searchParams, href, source])

  return (
    <Link href={targetHref} {...rest}>
      {children}
    </Link>
  )
}
