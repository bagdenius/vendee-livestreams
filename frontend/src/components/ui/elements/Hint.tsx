import type { ReactElement } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../common/Tooltip'

interface HintProps {
  children: ReactElement
  label: string
  side: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

export function Hint({ children, label, side, align }: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side} align={align}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
