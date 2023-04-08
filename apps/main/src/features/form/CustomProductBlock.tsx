import { ActionIcon, createStyles, Divider, Stack, Text, Textarea, TextInput, } from '@mantine/core';
import { IconX } from '@tabler/icons';
import type { FormProduct } from 'models';

interface Props {
  value: FormProduct;
  onRemove: () => void;
  onCTANameChange: (nextName: string) => void;
  onCTALabelChange: (nextLabel: string) => void;
  onCTAUrlChange: (nextUrl: string) => void;
  onDescriptionChange: (nextDesc: string) => void;
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
    value,
    onRemove,
    onCTALabelChange,
    onCTAUrlChange,
    onDescriptionChange,
  } = props;
  const { classes } = useStyles();

  return (
    <div className={classes.productBlock}>
      <div className={classes.deleteBtn}>
        <ActionIcon radius="xl" variant="filled" size="xs" onClick={onRemove}>
          <IconX size={14} />
        </ActionIcon>
      </div>
      <TextInput label="Name" value={value.name || ''} onChange={(e) => onCTALabelChange(e.target.value)} />
      <Divider orientation="horizontal" />
      <Stack p={16}>
        <TextInput label="Button Label" value={value.ctaLabel || ''} onChange={(e) => onCTALabelChange(e.target.value)} />
        <TextInput
          label="Button URL"
          placeholder="https://your.domain.com/get-quote"
          value={value.ctaUrl || ''}
          onChange={(e) => onCTAUrlChange(e.target.value)}
        />
        <Textarea label="Description" value={value.description!} onChange={(e) => onDescriptionChange(e.target.value)} />
      </Stack>
    </div>
  );
}
