"use client"

import { useEffect } from "react"
import Script from "next/script"
import { attachFrictionDetector } from "@/lib/analytics/clarity-bridge"

interface MicrosoftClarityProps {
  projectId?: string
}

export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  const clarityId = projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  useEffect(() => {
    // Attach passive friction listeners (rage click & dead click detection)
    const cleanup = attachFrictionDetector()
    return () => {
      cleanup()
    }
  }, [])

  if (!clarityId) {
    return null
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  )
}
