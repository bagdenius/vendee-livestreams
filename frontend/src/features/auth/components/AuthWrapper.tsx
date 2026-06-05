import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface AuthWrapperProps {
  heading: string
  backButtonLabel?: string
  backButtonHref?: string
}

export function AuthWrapper({
  children,
  heading,
  backButtonLabel,
  backButtonHref,
}: PropsWithChildren<AuthWrapperProps>) {
  return (
    <div className='flex h-full items-center justify-center'>
      <Card className='w-120'>
        <CardHeader className='flex items-center justify-center gap-2'>
          <Image
            src='/images/logo.svg'
            alt='Vendee logo'
            width={35}
            height={35}
          />
          <CardTitle className='text-2xl'>{heading}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className='-mt-6 border-0 bg-transparent'>
          {backButtonLabel && backButtonHref && (
            <Button variant='ghost' className='text-primary h-10 w-full'>
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
