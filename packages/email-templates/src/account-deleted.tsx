import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
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
}

export const AccountDeletedEmail = (props: Props) => {
  const {
    logoImage = `/static/dealo-logo-block.png`,
    name = 'John Doe',
  } = props;

  return (
    <Html>
      <Head />
      <Preview>
        We are sorry to see you go. If you have any feedback, please let us know.
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
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
                  <Heading className="text-black text-[24px] font-bold p-0 my-0 mx-0">
                    Account closed
                  </Heading>
                  <Text className="text-gray-500 text-[14px] leading-[24px] my-0">
                    We are sorry to see you go.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section>
              <Text className="text-black text-[14px]">
                Hi <span className="font-bold">{name}</span>, we are sorry to see you go.
                If you have any feedback on how we can improve our service, please let us know, we are always looking to improve
                and maybe we can win you back in the future.
                <br />
                Lastly, you can be sure that all your data has been deleted from our servers.
              </Text>
            </Section>
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
