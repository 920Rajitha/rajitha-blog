
export const metadata = {
  title: "Terms & Conditions | Rajitha Blog",
  description:
    "Read the terms and conditions for using Rajitha Blog.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-gray-200 px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <a
          href="/"
          className="text-blue-400 hover:underline"
        >
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mt-8 mb-3 text-white">
          Terms & Conditions
        </h1>

        <p className="text-gray-400 mb-8">
          Last Updated: November 1, 2026
        </p>

        <div className="space-y-8 leading-7">

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to Rajitha Blog (rajitha.blog).
              By accessing and using this website, you agree
              to these Terms and Conditions. If you do not
              agree, please discontinue using the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Website Content
            </h2>
            <p>
              Rajitha Blog provides articles, tutorials,
              software development tips, technology updates,
              programming resources, and educational content.
            </p>
            <p>
              Content is provided for general informational
              and educational purposes. We do not guarantee
              that all information is always complete,
              accurate, or up to date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, original content,
              website design, branding, and materials
              published on Rajitha Blog belong to their
              respective owners.
            </p>
            <p>
              You may not reproduce, redistribute, or
              commercially exploit our original content
              without prior permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the website for unlawful activities.</li>
              <li>Attempt to access restricted website areas.</li>
              <li>Disrupt or damage website functionality.</li>
              <li>Submit misleading, harmful, or abusive content.</li>
              <li>Attempt unauthorized access to user accounts.</li>
              <li>Manipulate advertising or website interactions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. User Accounts and Interactions
            </h2>
            <p>
              If account registration or interactive features
              are available, users are responsible for
              maintaining the confidentiality of their
              account credentials and for activities
              performed through their accounts.
            </p>
            <p>
              We reserve the right to restrict access to
              accounts involved in misuse, abuse, or
              violations of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party
              websites, services, or resources. We do not
              control or take responsibility for their
              content, availability, or privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              7. Advertising
            </h2>
            <p>
              Rajitha Blog may display advertisements
              provided by third-party advertising partners,
              including Google AdSense.
            </p>
            <p>
              Third-party advertisers may use cookies or
              similar technologies subject to their
              applicable policies and consent requirements.
            </p>
            <p>
              Users should review our
              {" "}
              <a href="/privacy-policy"
                className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
              {" "}for more information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              8. Disclaimer
            </h2>
            <p>
              The website and its content are provided
              on an "as is" and "as available" basis.
              We do not guarantee uninterrupted access
              or error-free operation.
            </p>
            <p>
              Technical tutorials and code examples should
              be tested and reviewed before being used
              in production environments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              9. Limitation of Liability
            </h2>
            <p>
              To the extent permitted by applicable law,
              Rajitha Blog shall not be responsible for
              indirect or consequential losses arising
              from the use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              10. Changes to These Terms
            </h2>
            <p>
              We may update these Terms and Conditions
              when necessary. Updated versions will be
              published on this page with a revised
              update date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              11. Contact Information
            </h2>
            <p>
              For questions regarding these Terms and
              Conditions, please contact:
            </p>
            <p className="mt-3">
              Email: rajitha.development@gmail.com
            </p>
            <p>
              Website: rajitha.blog
            </p>
          </section>

        </div>

        <div className="border-t border-gray-700 mt-12 pt-6">
          <a
            href="/"
            className="text-blue-400 hover:underline"
          >
            ← Return to Rajitha Blog
          </a>
        </div>

      </div>
    </main>
  );
}
