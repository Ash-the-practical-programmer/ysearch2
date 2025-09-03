import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Symphonic Search",
  description: "A portal to augmented human intelligence.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Background watermark emblem */}
      <body className="font-sans bg-[var(--bg)] text-[var(--fg)] relative min-h-dvh">
        <div aria-hidden className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[var(--bg)]" />
          <div className="absolute inset-0 bg-[url('/images/cloud-emblem.png')] bg-center bg-no-repeat bg-contain opacity-10" />
        </div>
        {children}
      </body>
    </html>
  )
}