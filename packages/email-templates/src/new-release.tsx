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

export const NewReleaseEmail = (props: Props) => {
  const {
    logoImage = `/static/dealo-logo-block.png`,
    name = 'John Doe',
  } = props;

  return (
    <Html>
      <Head />
      <Preview>
        Hi there, we have some new changes for you!
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#12b886] rounded my-[40px] mx-auto p-[20px] max-w-[700px] w-[700px]">
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
                    We have some new changes for you!
                  </Heading>
                  <Text className="text-gray-500 text-[14px] leading-[24px] my-0">
                    We hope these changes will help you grow your business.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section>
              <Text className="text-black text-[14px]">
                Hi <span className="font-bold">{name}</span>, we hope you are doing well.
                <br />
                Recently, we have made some changes to our platform, added some new features, fixed some bugs
                and we wanted to let you know about them.
              </Text>
            </Section>
            <Section>
              <NewFeature title="Seamless Integration with Stripe Connect">
                Goodbye API key hassle! Now, Dealo seamlessly integrates with your Stripe account using Stripe Connect.
                No more manual inputs—just a smoother experience for you.
              </NewFeature>
              <NewFeature title="Effortless Stripe Checkouts">
                Say hello to simplicity!
                {` We've`} implemented the Stripe Checkout flow,
                allowing you to generate a checkout link with just one redirect. The best part?
                {` We've`} been our own first customer, crafting a Dealo checkout page.
                This hands-on experience means {`we're`} even better equipped to guide you through the process.
              </NewFeature>
              <NewFeature title="Embrace Free Trials">
                Start enticing your audience! Dealo now supports free trials,
                giving you the power to create subscription plans with a trial period.
                {` It's`} the perfect way to attract and convert users without breaking a sweat.
              </NewFeature>
            </Section>
            <Section>
              <Text className="text-[14px]">
                Our goal is to make Dealo a valuable tool for your business growth,
                and these updates are just the beginning.
                We believe {`they'll`} elevate your experience,
                making it easier than ever for you to focus on what matters, scaling your business.
                <br />
                <br />
                Ready to explore the new possibilities?{' '}
                <Link href="https://dealo.app" className="text-[#12b886] font-bold">
                  Log in to Dealo
                </Link>
                {' '}now and see these enhancements in action!
                <br />
                <br />
                As always, {`we're`} here to support your journey. If you have any questions or need assistance,
                {` don't `} hesitate to reach out.
                <br />
                <br />
                {`Here's`} to your continued success!
                <br />
                <br />
                <span className="font-bold">The Dealo Team.</span>
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

interface NewFeatureProps {
  title: string;
  children: any;
}
const NewFeature = (props: NewFeatureProps) => (
  <Section className="mb-8">
    <Row className="mb-2">
      <Column className="w-[16px]">
        <div className="bg-slate-900 w-[8px] h-[8px] rounded" />
      </Column>
      <Column className="text-[14px] font-bold">{props.title}:</Column>
    </Row>
    <Row className="pl-4">
      <Column className="text-[14px]">
        {props.children}
      </Column>
    </Row>
  </Section>
);
