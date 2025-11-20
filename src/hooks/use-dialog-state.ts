import * as React from 'react'

interface UseDialogStateProps {
  controlledOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useDialogState({ controlledOpen, onOpenChange }: UseDialogStateProps = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined

  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen)
      } else {
        setInternalOpen(newOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  return { open, setOpen }
}
