import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { Anchor, createStyles, Group, Header, HoverCard, Menu, Text, Title, UnstyledButton } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import type { TablerIcon } from '@tabler/icons';
import { IconArrowLeft, IconInfoCircle, IconLogout, IconSettings, IconTrash, IconUser, IconUsers } from '@tabler/icons';
import { RenderIf } from 'ui';
import { ROLES } from 'models';

import { trpc } from 'utils/trpc';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
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
	onClick?(): void;
}

function NavbarLink({ icon: Icon, onClick }: NavbarLinkProps) {
  const { classes } = useStyles();
  return (
    <UnstyledButton onClick={onClick} className={classes.link}>
      <Icon stroke={1.5} />
    </UnstyledButton>
  );
}

interface Props {
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
}

export function CustomNavbar(props: Props) {
  const { showBackButton = false, title, backRoute } = props;
  const { classes } = useStyles();
  const { status, data } = useSession();
  const router = useRouter();

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

  if (status === 'unauthenticated') return <div style={{ height: '88px' }} />;
  if (!data) return <div style={{ height: '88px' }} />;

  const { user } = data;

  return (
    <Header height={64} className={classes.header} mb="xl" zIndex={1}>
      <RenderIf condition={showBackButton}>
        <NavbarLink icon={IconArrowLeft} onClick={() => backRoute ? router.push(backRoute) : router.back()}  />
      </RenderIf>
      <Title ml="md">{title}</Title>
      <Group ml="auto">
        <HoverCard width={280} shadow="md" position="bottom-end">
          <HoverCard.Target>
            <div>
              <NavbarLink icon={IconInfoCircle} />
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">
              This platform is still an alpha version, so if you find any bugs or have any suggestions,
              please let me know at <Anchor href="mailto:support@dealo.app">support@dealo.app</Anchor>!
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
            <RenderIf condition={user?.role === ROLES.ADMIN}>
              <Menu.Label>Management</Menu.Label>
              <Menu.Item
                onClick={() => router.push('/users')}
                icon={<IconUsers size={14} />}
              >
                Manage Users
              </Menu.Item>
              <Menu.Divider />
            </RenderIf>
            <Menu.Label>{user?.name}</Menu.Label>
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
    </Header>
  );
}
