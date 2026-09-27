import type { PropsWithChildren, ReactNode } from 'react'
import { Card } from '../common'
import type { LucideIcon } from 'lucide-react'
import type { IconType } from 'react-icons'
import { cn } from 'cn'

interface CartContainerProps {
  heading: string
  description?: string
  Icon?: IconType | LucideIcon
  rightContent?: ReactNode
  isFullRightContent?: boolean
}

export function CardContainer({
  children,
  heading,
  description,
  Icon,
  rightContent,
  isFullRightContent,
}: PropsWithChildren<CartContainerProps>) {
  return (
    <Card className='p-4'>
      <div className='flex items-center justify-between'>
        <div
          className={cn(
            'flex flex-row items-center gap-x-4',
            isFullRightContent && 'min-w-36 shrink-0',
          )}
        >
          {Icon && (
            <div className='bg-foreground rounded-full p-2.5'>
              <Icon className='text-secondary size-7' />
            </div>
          )}
          <div className='space-y-1'>
            <h2
              className={cn(
                'font-semibold tracking-wide',
                isFullRightContent && 'whitespace-nowrap',
              )}
            >
              {heading}
            </h2>
            {description && (
              <p className='text-muted-foreground max-w-4xl text-sm'>
                {description}
              </p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className={cn(isFullRightContent && 'ml-6 w-full')}>
            {rightContent}
          </div>
        )}
      </div>
      {children && <div className='mt-4'>{children}</div>}
    </Card>
  )
}
