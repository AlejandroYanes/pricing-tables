/* eslint-disable max-len */
'use client'

import { useState } from 'react';
import { skeletonMap, templatesList } from '@dealo/templates';
import { RenderIf } from '@dealo/ui';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

interface Props {
  opened: boolean;
  loading: boolean;
  onSelect: (values: { name: string; template: string }) => any;
  onClose: () => void;
}

function TemplatesModal(props: Props) {
  const { loading, onSelect, onClose } = props;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);

  const Skeleton = selectedTemplate ? skeletonMap[selectedTemplate] : () => null;

  const handleSelect = () => {
    if (!name) {
      setShowError(true);
      return;
    }
    onSelect({ name, template: selectedTemplate! });
  };

  return (
    <Dialog open modal onOpenChange={onClose}>
      <DialogContent className="w-4/5">
        <DialogHeader>
          <DialogTitle>Choose template</DialogTitle>
        </DialogHeader>
        <div className="flex items-stretch h-[600px]">
          <div className="flex flex-col w-[220px] min-h-[220px] flex-shrink-0">
            <Input placeholder="Search" className="mb-2" />
            {templatesList.map((template) => (
              <Button
                variant="ghost"
                className="justify-start"
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <span>{template.name}</span>
              </Button>
            ))}
          </div>
          <Separator orientation="vertical" className="mx-4" />
          <div className="flex flex-col flex-1">
            <RenderIf condition={selectedTemplate !== null}>
              <div className="mx-auto">
                {/* @ts-ignore */}
                <Skeleton scale={0.8} />
              </div>
            </RenderIf>
            <div className="flex items-end justify-end mt-auto w-full gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="stripe-api-key">Name</Label>
                <Input
                  id="stripe-api-key"
                  className={showError ? 'border-destructive' : ''}
                  value={name}
                  disabled={!selectedTemplate || loading}
                  onChange={(e) => {
                    setName(e.target.value);
                    setShowError(false);
                  }}
                />
              </div>
              <Button
                disabled={!selectedTemplate}
                onClick={handleSelect}
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Wrapper(props: Props) {
  if (props.opened) {
    return <TemplatesModal {...props} />;
  }

  return null;
}
