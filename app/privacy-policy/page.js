
export const metadata = {
  title: "Privacy Policy | Rajitha Blog",
  description:
    "Read the Privacy Policy of Rajitha Blog to understand how information is collected and used.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-gray-200 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mt-8 mb-3 text-white">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-8">
          Last Updated: November 1, 2026
        </p>

        <section className="space-y-7 leading-7">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to Rajitha Blog (rajitha.blog).
              Your privacy is important to us. This Privacy
              Policy explains how we collect, use, and
              protect information when you visit our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Information We Collect
            </h2>
            <p>
              We may collect information that you
              voluntarily provide, including your name,
              email address, and messages submitted through
              our contact form or account features.
            </p>
            <p>
              We may also collect technical information
              such as browser type, device information,
              IP address, and website usage data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. How We Use Your Information
            </h2>
            <p>We may use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operate and maintain our website.</li>
              <li>Respond to messages and inquiries.</li>
              <li>Manage user accounts and interactions.</li>
              <li>Improve website performance and content.</li>
              <li>Protect our website against misuse.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Cookies and Similar Technologies
            </h2>
            <p>
              Our website may use cookies and similar
              technologies to support website functionality,
              remember preferences, and understand how
              visitors use our website.
            </p>
            <p>
              You can manage or disable cookies through
              your browser settings. Some website features
              may not work properly if cookies are disabled.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Google AdSense and Advertising
            </h2>
            <p>
              We may display advertisements through
              third-party advertising services such as
              Google AdSense.
            </p>
            <p>
              If advertising services are enabled, Google
              and its partners may use cookies or similar
              technologies to display advertisements based
              on users' visits to this website or other
              websites, subject to applicable settings
              and consent requirements.
            </p>
            <p>
              For more information, visit Google's
              advertising privacy information:
              {" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google Advertising Policies
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Third-Party Services
            </h2>
            <p>
              Our website may use third-party services
              for hosting, website functionality, analytics,
              and advertising. These services may process
              information according to their own privacy
              policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              7. Data Security
            </h2>
            <p>
              We take reasonable measures to protect
              information handled through our website.
              However, no online system can guarantee
              complete security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              8. Your Privacy Choices
            </h2>
            <p>
              You can contact us with questions about
              personal information you have submitted
              through our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time
              to time. Any changes will be published on
              this page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              10. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy
              Policy, please contact us:
            </p>
            <p className="mt-2">
              Email: rajitha.development@gmail.com
            </p>
            <p>
              Website: rajitha.blog
            </p>
          </div>
        </section>

        <div className="border-t border-gray-700 mt-12 pt-6">
          <a href="/" className="text-blue-400 hover:underline">
            ← Return to Rajitha Blog
          </a>
        </div>
      </div>
    </main>
  );
}
