import Link from 'next/link';
import { cn } from '@dealo/ui';

interface CardProps {
  active?: boolean;
  title: string;
  text: string;
  to: string;
  icon: JSX.Element;
  className?: string;
}

const Card = ({ active, title, text, icon, to, className }: CardProps) => {
  return (
    <Link href={to}>
      <div
        data-active={active}
        className={cn(
          'flex flex-col flex-grow-0 gap-4 p-6 flex-1 rounded-sm md:w-[320px]',
          'border border-gray-200 dark:border-gray-600',
          'bg-white dark:bg-gray-950',
          'data-[active=true]:border-emerald-500 dark:data-[active=true]:border-emerald-400',
          className,
        )}
      >
        <div className="flex gap-2">
          {icon}
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <span>{text}</span>
      </div>
    </Link>
  );
};

export default Card;
