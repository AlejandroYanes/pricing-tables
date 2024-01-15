import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface Props {
  logoImage?: string;
  name?: string;
  email?: string;
}

export const SubscriptionCreatedEmail = (props: Props) => {
  const {
    logoImage = `/static/dealo-logo-block.png`,
    name = 'John Doe',
    email = 'john.doe@gmail.com'
  } = props;

  return (
    <Html>
      <Head />
      <Preview>
        We got a new subscription! 🎉
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#12b886] rounded my-[40px] mx-auto p-[20px] w-[700px] max-w-[700px]">
            <Section>
              <Row>
                <Column valign="top" className="w-[64px]">
                  <Img
                    src={logoImage}
                    width="48"
                    height="48"
                    alt="Dealo"
                  />
                </Column>
                <Column>
                  <Heading className="text-[#12b886] text-[24px] font-bold p-0 my-0 mx-0">
                    New Subscription!!! 🎉
                  </Heading>
                  <Text className="text-gray-500 text-[14px] leading-[24px] my-0">
                    {name} just subscribed to Dealo!
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section>
              <Text className="text-black text-[14px]">
                We just got a new subscription from{' '}<span className="font-bold">{name}</span> ({email}).
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
