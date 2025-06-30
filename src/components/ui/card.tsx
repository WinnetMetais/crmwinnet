
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    style={{backgroundColor: 'white', color: 'rgb(15, 23, 42)'}}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 bg-slate-50", className)}
    style={{backgroundColor: 'rgb(248, 250, 252)', color: 'rgb(15, 23, 42)'}}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-slate-900",
      className
    )}
    style={{color: 'rgb(15, 23, 42)'}}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-600", className)}
    style={{color: 'rgb(71, 85, 105)'}}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0 bg-white", className)}
    style={{backgroundColor: 'white', color: 'rgb(51, 65, 85)'}}
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 bg-white", className)}
    style={{backgroundColor: 'white', color: 'rgb(51, 65, 85)'}}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
