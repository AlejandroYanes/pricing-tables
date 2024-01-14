import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface Props {
  logoImage?: string;
  name?: string;
}

export const FailedPaymentEmail = (props: Props) => {
  const {
    logoImage = `/static/dealo-logo-block.png`,
    name = 'John Doe',
  } = props;

  return (
    <Html>
      <Head />
      <Preview>
        Something went wrong and we were unable to collect payment for your subscription.
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#12b886] rounded my-[40px] mx-auto p-[20px] w-[700px]">
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
                    Failed payment.
                  </Heading>
                  <Text className="text-gray-500 text-[14px] leading-[24px] my-0">
                    We were unable to collect payment.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section>
              <Text className="text-black text-[14px]">
                Hi <span className="font-bold">{name}</span>, something went wrong with the payment for your subscription.
                This is not a fatal error and you will be able continue using Dealo.
                If you have any questions, please reach out to us.
              </Text>
            </Section>
            <Container className="flex flex-row items-center justify-center">
              <Link
                className="text-white text-[14px] text-center bg-[#12b886] rounded-[4px] py-[10px] px-[20px] mt-[20px] mb-[20px] block"
                href="https://dealo.app"
              >
                Go to Dealo
              </Link>
            </Container>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This email was intended for{' '}
              <span className="text-black">{name} </span>. If you
              were not expecting this email, you can ignore it or reply back to us and {`we'll`} figure out what happened.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
