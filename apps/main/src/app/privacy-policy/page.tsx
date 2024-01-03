import BaseLayout from 'components/BaseLayout';

const PrivacyPolicyPage = () => {
  return (
    <BaseLayout showBackButton hideUserControls>

      <div className="flex flex-col max-w-[700px] mx-auto">
        <div className="flex flex-col mb-12">
          <h1 className="text text-3xl">Privacy Policy for Dealo</h1>
          <span className="text">Last Updated: Friday, 29 Dec, 2023</span>
        </div>
        <span className="text">
          This Privacy Policy describes how Dealo ({`"we", "us", or "our"`}) collects, uses,
          and shares information when you use our SaaS platform and related services.
          By accessing or using Dealo, you agree to the terms outlined in this Privacy Policy.
        </span>

        <h3 className="text text-xl font-bold mb-4 mt-8">Information We Collect</h3>
        <span className="text">
          <strong>1. Account Information</strong>
          <br/>
          When you sign up for Dealo, we collect information such as your name, email address,
          and other relevant contact details to create
          and manage your account.

          <br/>
          <br/>
          <strong>2. Payment Information</strong>
          <br/>
          To facilitate transactions through our platform, we integrate with Stripe to process payments.
          We do not store or process any credit card information on our servers.
          {`Stripe's`} privacy policy is applicable to the collection and processing of payment information.

          <br/>
          <br/>
          <strong>3. Usage Information</strong>
          <br/>
          We may collect information about how you interact with Dealo, including your usage patterns,
          preferences, and the features you access.

          <br/>
          <br/>
          <strong>4. Log Data</strong>
          <br/>
          When you use Dealo, our servers automatically record information that your browser or device sends.
          This may include your IP address, browser type, device type, and the pages you visit.

          {/*TODO: need to check which cookies we use and weather we need to show the cookies consent form */}
          {/*<br/>*/}
          {/*<br/>*/}
          {/*<strong>5. Cookies and Similar Technologies</strong>*/}
          {/*<br/>*/}
          {/*We use cookies and similar technologies to collect and store information when you access Dealo.*/}
          {/*This helps us enhance your experience, analyze trends, and improve our services.*/}
        </span>

        <h3 className="text text-xl font-bold mb-4 mt-8">How We Use Your Information</h3>
        <span className="text">
          <strong>1. Provide and Improve Services</strong>
          <br/>
          We use your information to operate and maintain Dealo, including processing transactions, improving features,
          and personalizing your experience.

          <br/>
          <br/>
          <strong>2. Communications</strong>
          <br/>
          We may use your email address to send important updates, announcements, and marketing communications.
          You can opt out of promotional emails at any time.

          <br/>
          <br/>
          <strong>3. Analytics</strong>
          <br/>
          We analyze usage patterns to understand how users interact with our platform.
          This helps us make informed decisions to improve and optimize Dealo.
        </span>

        <h3 className="text text-xl font-bold mt-8">How We Share Your Information</h3>
        <span className="text">
          We do not sell, trade, or rent your personal information to third parties.
          We may share your information with third-party service providers, such as Stripe,
          to facilitate payments and other essential services.
        </span>

        <h3 className="text text-xl font-bold mt-8">Data Retention</h3>
        <span className="text">
          We retain your information for as long as necessary to provide our services and
          fulfill the purposes outlined in this Privacy Policy.
          When you delete your account, we will delete your information within 30 days.
        </span>

        <h3 className="text text-xl font-bold mt-8">Security</h3>
        <span className="text">
          We take reasonable measures to protect your information from unauthorized access, disclosure, or destruction.
          However, no method of transmission over the Internet or electronic storage is 100% secure.
          Therefore, we cannot guarantee its absolute security.
        </span>

        <h3 className="text text-xl font-bold mt-8">Changes to this Privacy Policy</h3>
        <span className="text">
          We may update this Privacy Policy to reflect changes in our practices or for other
          operational, legal, or regulatory reasons.
          We will notify you of any material changes by posting the updated Privacy Policy on Dealo.
        </span>

        <h3 className="text text-xl font-bold mt-8">Contact Us</h3>
        <span className="text">
          If you have any questions or concerns about this Privacy Policy, please contact us at
          <a href="mailto:support@dealo.app">support@dealo.app</a>.
        </span>

        <div className="flex flex-col mt-20">
          <span className="text font-bold">Dealo</span>
          <a href="mailto:support@dealo.app">support@dealo.app</a>
        </div>
      </div>
    </BaseLayout>
  );
}

export default PrivacyPolicyPage;
