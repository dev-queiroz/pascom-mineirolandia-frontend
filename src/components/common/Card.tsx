import { Card as ShadcnCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

export function Card({ title, description, children, className, headerClassName, contentClassName }: CardProps) {
    return (
        <ShadcnCard className={cn('overflow-hidden', className)}>
            {(title || description) && (
                <CardHeader className={cn('pb-4', headerClassName)}>
                    {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className={cn('pt-0', contentClassName)}>{children}</CardContent>
        </ShadcnCard>
    );
}