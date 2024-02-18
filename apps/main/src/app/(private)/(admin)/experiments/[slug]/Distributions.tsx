import { useRef, useState } from 'react';
import {
  Button, cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  InputWithLabel,
  Loader,
  RenderIf,
} from '@dealo/ui';
import type { Experiment } from '@dealo/models';

import { trpc } from 'utils/trpc';

interface Props {
  slug: string;
  experiment: Experiment;
}

export default function Distributions(props: Props) {
  const { slug, experiment } = props;

  const formRef = useRef<HTMLFormElement>(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentTotalDistribution, setCurrentTotalDistribution] = useState<number>(
    Object.values(experiment.distribution).reduce((acc, value) => acc + (value * 100), 0)
  );

  const utils = trpc.useContext();
  const { mutateAsync: updateDistributions } = trpc.experiments.updateDistributions.useMutation();

  const resolveCurrentTotalDistribution = () => {
    let total;
    if (!formRef.current) {
      total = Object.values(experiment.distribution).reduce((acc, value) => acc + (value * 100), 0);
    } else {
      total = experiment.variants.reduce((total, variant) => {
        const formValue = (formRef.current?.elements as any)[variant].value;
        const value = Number(formValue);
        return total + value;
      }, 0);
    }
    setCurrentTotalDistribution(total);
  };

  const handleClick = async () => {
    try {
      if (currentTotalDistribution > 100) {
        return;
      }
      setLoading(true);

      const values = experiment.variants.reduce((acc, variant) => {
        const formValue = (formRef.current?.elements as any)[variant].value;
        const value = Number(formValue);
        return { ...acc, [variant]: value / 100 };
      }, {} as Experiment['distribution']);

      await updateDistributions({ slug, experiment, newDistribution: values });
      const experimentData = utils.experiments.getExperiment.getData(slug)!;
      utils.experiments.getExperiment.setData(slug, { ...experimentData, experiment: { ...experiment, distribution: values } });
      setLoading(false);
      setShowModal(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button>Update Distributions</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Distributions</DialogTitle>
          <DialogDescription>
            Distribute how traffic will be directed to the different variants of your experiment.
            Click save when {`you're`} done.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onChange={resolveCurrentTotalDistribution}>
          <div className="flex flex-col gap-4 py-4">
            {experiment.variants.map((variant, index) => (
              <div key={variant} className="flex flex-col">
                <div className="flex items-end">
                  <InputWithLabel
                    className="flex-1"
                    inputClassName="rounded-r-none border-r-0"
                    label={index === 0 ? 'Variant' : ''}
                    value={variant}
                    readOnly
                  />
                  <InputWithLabel
                    id={variant}
                    name={variant}
                    type="number"
                    className="flex-1"
                    inputClassName="rounded-l-none"
                    autoFocus={index === 0}
                    label={index === 0 ? 'Distribution' : ''}
                    defaultValue={experiment.distribution[variant]! * 100}
                  />
                </div>
              </div>
            ))}
            <div className={cn({ 'text-red-500': currentTotalDistribution > 100 })}>
              <span>
                Current distribution:
              </span>
              <span className="ml-20">{currentTotalDistribution}%</span>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button disabled={loading} onClick={handleClick}>
            <RenderIf condition={loading}>
              <Loader color="white" size="xs" className="mr-2"/>
            </RenderIf>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
