'use client'

import type { ReactElement, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import type { ProductWorkspacePanel } from './product-workspace.types'

type ProductWorkspaceContextValue = {
  readonly activePanel: ProductWorkspacePanel
  readonly panelOpen: boolean
  readonly selectPanel: (panel: ProductWorkspacePanel) => void
}

type ProductWorkspaceProviderProps = {
  readonly children: ReactNode
}

const ProductWorkspaceContext = createContext<ProductWorkspaceContextValue | null>(null)

/**
 * Provides workspace shell state for the rail and active panel.
 *
 * @param props - Provider props.
 * @returns Workspace context provider.
 */
export function ProductWorkspaceProvider(
  props: ProductWorkspaceProviderProps
): ReactElement {
  const { children } = props
  const [activePanel, setActivePanel] = useState<ProductWorkspacePanel>('pieces')
  const [panelOpen, setPanelOpen] = useState(true)

  const selectPanel = useCallback(
    (panel: ProductWorkspacePanel): void => {
      if (panel === activePanel) {
        setPanelOpen(current => !current)
        return
      }

      setActivePanel(panel)
      setPanelOpen(true)
    },
    [activePanel]
  )

  const value = useMemo<ProductWorkspaceContextValue>(
    () => ({
      activePanel,
      panelOpen,
      selectPanel
    }),
    [activePanel, panelOpen, selectPanel]
  )

  return (
    <ProductWorkspaceContext.Provider value={value}>
      {children}
    </ProductWorkspaceContext.Provider>
  )
}

/**
 * Reads the workspace shell state.
 *
 * @returns Workspace context value.
 */
export function useProductWorkspace(): ProductWorkspaceContextValue {
  const context = useContext(ProductWorkspaceContext)

  if (!context) {
    throw new Error('useProductWorkspace must be used inside ProductWorkspaceProvider')
  }

  return context
}
