import React from 'react'

export interface PageLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  topNav?: React.ReactNode
  mobileNav?: React.ReactNode
  footer?: React.ReactNode
}

export interface PageLayoutMetadata {
  id: string
  name: string
  label: string
  description: string
  iconName: string
}

export interface PageLayoutSpec extends PageLayoutMetadata {
  Component: React.ComponentType<PageLayoutProps>
}
