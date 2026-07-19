import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../common'

interface CartContainerProps {
  heading: string
  description: string
  rightContent?: ReactNode
}

export function CardContainer({
  children,
  heading,
  description,
  rightContent,
}: PropsWithChildren<CartContainerProps>) {
  return (
    <Card className='p-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='font-semibold tracking-wide'>{heading}</h2>
          <p className='text-muted-foreground max-w-4xl text-sm'>
            {description}
          </p>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
      {children && <div className='mt-4'>{children}</div>}
    </Card>
  )
}
