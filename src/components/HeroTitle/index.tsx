/* eslint-disable max-len */
import { Container, createStyles, Text } from '@mantine/core';

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
  inner: {
    position: 'relative',
    paddingTop: 80,
    paddingBottom: 120,
    paddingLeft: 0,
    paddingRight: 0,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export default function HeroTitle() {
  const { classes } = useStyles();

  return (
    <Container className={classes.inner}>
      <h1 className={classes.title}>
        Want to get a nice clean {' '}
        <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
          CV
        </Text>{' '}
        ?
      </h1>
    </Container>
  );
}
