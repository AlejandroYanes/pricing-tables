import { Button, createStyles, SimpleGrid, Stack, Text } from '@mantine/core';

const useStyles = createStyles((theme, color: string) => ({
  productCard: {
    boxSizing: 'border-box',
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
    padding: '48px 32px 24px',
    borderRadius: '4px',
    width: '300px',
  },
  activeProductCard: {
    border: `1px solid ${theme.colors![color]![5]}`,
    width: '320px',
  },
  wideCard: {
    width: 'auto',
  },
}));

export default function BasicMiniature() {
  const { classes, cx } = useStyles('teal');
  return (
    <Stack align="center">
      <SimpleGrid cols={3}>
        <Stack
          align="center"
          className={cx(classes.productCard)}
        >
          <Text style={{ fontSize: '18px' }} weight="bold">
            Basic Plan
          </Text>
          <Text
            weight="bold"
            align="center"
            style={{ fontSize: '32px' }}
          >
            £10.00 /mo
          </Text>
          <Text align="center">description</Text>
          <Button color="teal" variant="outline">
            Subscribe
          </Button>
        </Stack>

        <Stack
          align="center"
          className={cx(classes.productCard, { [classes.activeProductCard]: true })}
        >
          <Text style={{ fontSize: '18px' }} weight="bold">
            Premium Plan
          </Text>
          <Text
            weight="bold"
            align="center"
            color="teal"
            style={{ fontSize: '32px' }}
          >
            £25.00 /mo
          </Text>
          <Text align="center">Premium plan description</Text>
          <Button color="teal" variant="outline">
            Subscribe
          </Button>
        </Stack>

        <Stack
          align="center"
          className={cx(classes.productCard)}
        >
          <Text style={{ fontSize: '18px' }} weight="bold">
            Enterprise Plan
          </Text>
          <Text
            weight="bold"
            align="center"
            style={{ fontSize: '32px' }}
          >
            £50.00 /mo
          </Text>
          <Text align="center">description</Text>
          <Button color="teal" variant="outline">
            Subscribe
          </Button>
        </Stack>

        <ul>
          <li>feature 1</li>
        </ul>

        <ul>
          <li>feature 1</li>
          <li>feature 2</li>
        </ul>

        <ul>
          <li>feature 1</li>
          <li>feature 2</li>
          <li>feature 3</li>
          <li>feature 4</li>
        </ul>

      </SimpleGrid>
    </Stack>
  );
}
