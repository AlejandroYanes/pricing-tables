import { cn } from './helpers';

interface Props {
  className?: string;
}

export function Loader(props: Props) {
  const { className } = props;
  return (
    <div className={cn('inline-block relative w-[80px] h-[80px]', 'lds-ring', className)}>
      <div className="box-border block absolute w-16 h-16 m-2 border-8 border-solid border-t-emerald-500"></div>
      <div className="box-border block absolute w-16 h-16 m-2 border-8 border-solid border-t-emerald-500"></div>
      <div className="box-border block absolute w-16 h-16 m-2 border-8 border-solid border-t-emerald-500"></div>
      <div className="box-border block absolute w-16 h-16 m-2 border-8 border-solid border-t-emerald-500"></div>
    </div>
  );
}
