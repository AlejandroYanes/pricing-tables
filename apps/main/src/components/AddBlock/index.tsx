import { createStyles, Text, UnstyledButton } from '@mantine/core';
import { IconNewSection } from '@tabler/icons';

interface Props {
  label: string;
  onClick?: () => void;
}

const useStyles = createStyles((theme) => ({
  block: {
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    border: `1px dashed ${theme.colors.gray[1]}`,
  },
}));

export default function AddBlock(props: Props) {
  const { label, onClick } = props;
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.block} onClick={onClick}>
      <IconNewSection size={60} />
      <Text size="xl">{label}</Text>
    </UnstyledButton>
  );
}
