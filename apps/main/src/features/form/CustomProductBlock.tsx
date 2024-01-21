import { IconChevronDown, IconChevronsDown, IconChevronsUp, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import type { FormProduct } from '@dealo/models';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InputWithLabel,
  Separator,
  TextareaWithLabel,
} from '@dealo/ui';

interface Props {
  isFirst: boolean;
  isLast: boolean;
  value: FormProduct;
  onRemove: () => void;
  onCTANameChange: (nextName: string) => void;
  onCTALabelChange: (nextLabel: string) => void;
  onCTAUrlChange: (nextUrl: string) => void;
  onDescriptionChange: (nextDesc: string) => void;
  onMoveToTop: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToBottom: () => void;
}

export default function CustomProductBlock(props: Props) {
  const {
    isFirst,
    isLast,
    value,
    onRemove,
    onCTANameChange,
    onCTALabelChange,
    onCTAUrlChange,
    onDescriptionChange,
    onMoveToTop,
    onMoveUp,
    onMoveDown,
    onMoveToBottom,
  } = props;

  return (
    <div className="relative rounded-sm mb-4 border-solid border border-slate-300 dark:border-slate-700">
      <div className="absolute top-1 right-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button component="span" variant="ghost" size="sm" className="h-7 p-2">
              <IconDotsVertical size={14} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuItem disabled={isFirst} onClick={onMoveToTop}>
              <IconChevronsUp size={14} />
              Move to top
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isFirst} onClick={onMoveUp}>
              <IconChevronsUp size={14} />
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isLast} onClick={onMoveDown}>
              <IconChevronDown size={14} />
              Move down
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isLast} onClick={onMoveToBottom}>
              <IconChevronsDown size={14} />
              Move to bottom
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={onRemove}>
              <IconTrash size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">
        <InputWithLabel label="Name" value={value.name || ''} onChange={(e) => onCTANameChange(e.target.value)} />
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col p-4 gap-4">
        <InputWithLabel label="Button Label" value={value.ctaLabel || ''} onChange={(e) => onCTALabelChange(e.target.value)} />
        <InputWithLabel
          label="Button URL"
          placeholder="https://your.domain.com/get-quote"
          value={value.ctaUrl || ''}
          onChange={(e) => onCTAUrlChange(e.target.value)}
        />
        <TextareaWithLabel
          label="Description"
          rows={4}
          value={value.description!}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
}
