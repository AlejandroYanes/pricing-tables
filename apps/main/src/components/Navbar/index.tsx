import Link from 'next/link';
import { Anchor, createStyles, Group, Header, HoverCard, Menu, Text, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import type { TablerIcon } from '@tabler/icons';
import { IconInfoCircle, IconLogout, IconSettings, IconTrash, IconUser } from '@tabler/icons';
import { signOut, useSession } from 'next-auth/react';
import { RenderIf } from 'ui';

import { trpc } from 'utils/trpc';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
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
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
      <Icon stroke={1.5} />
    </UnstyledButton>
  );
}

export function CustomNavbar() {
  const { classes } = useStyles();
  const { status } = useSession();

  const { mutate: deleteAccount } = trpc.user.deleteAccount.useMutation({
    onSuccess: () => handleLogout(),
  });

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleDeleteAccount = async () => {
    openConfirmModal({
      title: 'Delete account',
      children: (
        <Text>
          Are you sure you want to delete your account?
          We promise we {`won't`} keep any data about you but you will also loose everything {`you've`} created with us,
          and this action is irreversible.
        </Text>
      ),
      labels: { confirm: 'Delete it', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteAccount(),
    });
  };

  return (
    <Header height={64} className={classes.header} mb="xl" zIndex={1}>
      <Link href="/dashboard">
        <Title order={1} color="teal" style={{ cursor: 'pointer' }}>Pricing</Title>
      </Link>
      <RenderIf condition={status === 'authenticated'}>
        <Group>
          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
              <div>
                <NavbarLink icon={IconInfoCircle} />
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                This platform is still in beta, so if you find any bugs or have any suggestions,
                please let us know at <Anchor href="mailto:alejandro.yanes94@gmail.com">alejandro.yanes94@gmail.com</Anchor>!
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
          <Menu shadow="md" width={200} offset={18} position="bottom-end">
            <Menu.Target>
              <div>
                <NavbarLink icon={IconUser} />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
              <Menu.Item icon={<IconLogout size={14} />} onClick={handleLogout}>Logout</Menu.Item>
              <Menu.Divider />
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={handleDeleteAccount}>
                Delete my account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </RenderIf>
    </Header>
  );
}
