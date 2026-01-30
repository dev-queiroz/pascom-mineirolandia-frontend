'use client';

import * as React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<typeof ShadcnInput> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, containerClassName, className, id: providedId, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = providedId || generatedId;

        return (
            <div className={cn('space-y-2', containerClassName)}>
                {label && (
                    <Label htmlFor={inputId} className="text-sm font-medium">
                        {label}
                    </Label>
                )}

                <ShadcnInput
                    id={inputId}
                    ref={ref}
                    className={cn(
                        error ? 'border-red-500 focus-visible:ring-red-500' : '',
                        className
                    )}
                    {...props}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };