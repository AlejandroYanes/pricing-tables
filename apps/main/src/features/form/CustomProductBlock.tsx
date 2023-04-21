import { ActionIcon, createStyles, Divider, Menu, Stack, Textarea, TextInput, } from '@mantine/core';
import { IconChevronDown, IconChevronsDown, IconChevronsUp, IconDotsVertical, IconTrash } from '@tabler/icons';
import type { FormProduct } from 'models';

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

const useStyles = createStyles((theme) => ({
  productBlock: {
    position: 'relative',
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
    borderRadius: '4px',
    marginBottom: '16px',
  },
  deleteBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px'
  },
}));

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
  const { classes } = useStyles();

  return (
    <div className={classes.productBlock}>
      <div className={classes.deleteBtn}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="filled" size="xs">
              <IconDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item disabled={isFirst} onClick={onMoveToTop} icon={<IconChevronsUp size={14} />}>Move to top</Menu.Item>
            <Menu.Item disabled={isFirst} onClick={onMoveUp} icon={<IconChevronsUp size={14} />}>Move up</Menu.Item>
            <Menu.Item disabled={isLast} onClick={onMoveDown} icon={<IconChevronDown size={14} />}>Move down</Menu.Item>
            <Menu.Item disabled={isLast} onClick={onMoveToBottom} icon={<IconChevronsDown size={14} />}>Move to bottom</Menu.Item>

            <Menu.Divider />
            <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={onRemove}>Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <TextInput m={16} label="Name" value={value.name || ''} onChange={(e) => onCTANameChange(e.target.value)} />
      <Divider orientation="horizontal" />
      <Stack p={16}>
        <TextInput label="Button Label" value={value.ctaLabel || ''} onChange={(e) => onCTALabelChange(e.target.value)} />
        <TextInput
          label="Button URL"
          placeholder="https://your.domain.com/get-quote"
          value={value.ctaUrl || ''}
          onChange={(e) => onCTAUrlChange(e.target.value)}
        />
        <Textarea
          label="Description"
          autosize
          minRows={2}
          maxRows={4}
          value={value.description!}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </Stack>
    </div>
  );
}
