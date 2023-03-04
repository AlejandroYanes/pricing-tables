import { createStyles, Group, Header, Title, Tooltip, UnstyledButton } from '@mantine/core';
import type { TablerIcon } from '@tabler/icons';
import { IconSettings, IconUser, IconLayout2 } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media print': {
      display: 'none',
    },
  },
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface NavbarLinkProps {
	icon: TablerIcon;
	label: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="bottom" offset={16}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function CustomNavbar() {
  const { classes } = useStyles();
  return (
    <Header height={64} className={classes.header} mb="xl">
      <Title order={1} color="blue" style={{ cursor: 'pointer' }}>CV</Title>
      <Group>
        <NavbarLink icon={IconLayout2} label="Resumes" />
        <NavbarLink icon={IconSettings} label="Settings" />
        <NavbarLink icon={IconUser} label="Profile" />
      </Group>
    </Header>
  );
}
