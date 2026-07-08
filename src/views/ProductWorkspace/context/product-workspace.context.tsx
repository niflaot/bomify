'use client'

import type { ReactElement, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import type { ProductWorkspacePanel, ProductWorkspaceView } from '../types/product-workspace.types'

type ProductWorkspaceContextValue = {
  readonly activeCombinationId: string | null
  readonly activePanel: ProductWorkspacePanel
  readonly activeView: ProductWorkspaceView
  readonly panelOpen: boolean
  readonly productionUnits: number
  readonly selectCombination: (combinationId: string) => void
  readonly selectPanel: (panel: ProductWorkspacePanel) => void
  readonly selectView: (view: ProductWorkspaceView) => void
  readonly setProductionUnits: (units: number) => void
}

type ProductWorkspaceProviderProps = {
  readonly children: ReactNode
  readonly defaultCombinationId?: string | null
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
  const { children, defaultCombinationId = null } = props
  const [activeCombinationId, setActiveCombinationId] = useState<string | null>(
    defaultCombinationId
  )
  const [activePanel, setActivePanel] = useState<ProductWorkspacePanel>('combinations')
  const [activeView, setActiveView] = useState<ProductWorkspaceView>('despiece')
  const [panelOpen, setPanelOpen] = useState(true)
  const [productionUnits, setProductionUnitState] = useState(1)

  const selectCombination = useCallback((combinationId: string): void => {
    setActiveCombinationId(combinationId)
  }, [])

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

  const selectView = useCallback((view: ProductWorkspaceView): void => {
    setActiveView(view)
  }, [])

  const setProductionUnits = useCallback((units: number): void => {
    setProductionUnitState(Math.max(1, Math.floor(units)))
  }, [])

  const value = useMemo<ProductWorkspaceContextValue>(
    () => ({
      activeCombinationId,
      activePanel,
      activeView,
      panelOpen,
      productionUnits,
      selectCombination,
      selectPanel,
      selectView,
      setProductionUnits
    }),
    [
      activeCombinationId,
      activePanel,
      activeView,
      panelOpen,
      productionUnits,
      selectCombination,
      selectPanel,
      selectView,
      setProductionUnits
    ]
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
