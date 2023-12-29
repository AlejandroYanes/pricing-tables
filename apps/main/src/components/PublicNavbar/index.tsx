import { useRouter } from 'next/router';
import Link from 'next/link';
import { createStyles, Group, Header, Text, UnstyledButton } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import { RenderIf } from 'ui';
import Image from 'next/image';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: 'none',
    marginBottom: '0 !important',
  },
  link: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
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
  banner: {
    marginBottom: '86px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    padding: `4px ${theme.spacing.md}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.orange[9] : theme.colors.orange[4],
  },
  bannerCloseBtn: {
    position: 'absolute',
    right: 0,
    top: 'auto',
    bottom: 'auto',
    borderRadius: 0,
    height: 32,
  },
}));

interface NavbarLinkProps {
	label: string;
  link: string;
}

function NavbarLink({ label, link }: NavbarLinkProps) {
  const { classes } = useStyles();
  return (
    <Link href={link} className={classes.link}>
      <Text>{label}</Text>
    </Link>
  );
}

interface Props {
  showLogo?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
}

export default function PublicNavbar(props: Props) {
  const { showLogo = false, showBackButton = false, backRoute } = props;
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Header height={64} className={classes.header} mb="xl" zIndex={1}>
      <RenderIf condition={showBackButton}>
        <UnstyledButton mr="16px" onClick={() => backRoute ? router.push(backRoute) : router.back()} className={classes.link}>
          <IconArrowLeft stroke={1.5} />
        </UnstyledButton>
      </RenderIf>
      <RenderIf condition={showLogo}>
        <Link href="/">
          <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={32} height={32} />
        </Link>
      </RenderIf>
      <Group ml="auto">
        <NavbarLink label="Pricing" link="/pricing" />
        <NavbarLink label="Sign in" link="/signin" />
      </Group>
    </Header>
  );
}
