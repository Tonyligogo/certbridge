
import type { Metadata } from "next";
import { LegalDocumentLayout, LegalSectionLink } from "../components/legal/legal-document-layout";
import { LegalSection } from "../components/legal/legal-section";

export const metadata: Metadata = {
  title: "Privacy Policy | CertBridge Global",
  description:
    "Learn how CertBridge Global collects, uses, protects, and manages your personal information.",
};

const sections: LegalSectionLink[] = [
  { id: "who-we-are", title: "Who We Are" },
  {
    id: "information-we-collect",
    title: "Personal Information We Collect",
  },
  {
    id: "how-we-use-information",
    title: "How We Use Personal Information",
  },
  { id: "lawful-basis", title: "Lawful Basis for Processing" },
  {
    id: "sharing-information",
    title: "How We Share Personal Information",
  },
  {
    id: "international-transfers",
    title: "International Transfers",
  },
  { id: "data-retention", title: "Data Retention" },
  { id: "security", title: "Security" },
  { id: "your-rights", title: "Your Data Protection Rights" },
  { id: "marketing", title: "Marketing Communications" },
  { id: "cookies", title: "Cookies and Similar Technologies" },
  { id: "children", title: "Children's Information" },
  { id: "third-party-websites", title: "Third-Party Websites" },
  { id: "recordings", title: "Training Recordings" },
  { id: "contact-us", title: "Contact Us and Complaints" },
  { id: "policy-changes", title: "Changes to This Policy" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how CertBridge Global collects, uses, protects, and manages your personal information when you visit our website, submit an enquiry, request training, participate in a programme, or otherwise interact with our services."
      lastUpdated="17 November 2026"
      sections={sections}
    >
      {/* 01 — WHO WE ARE */}
      <LegalSection
        id="who-we-are"
        title="1. Who We Are"
      >
        <p>
          CERTBRIDGE GLOBAL is a registered business that
          facilitates corporate training services for organisations
          and professionals.
        </p>

        <p>
          For the purposes of applicable data protection laws,
          CERTBRIDGE GLOBAL acts as a data controller where it
          determines the purposes and means of processing personal
          information.
        </p>

        <p>
          In this Policy, &quot;CertBridge&quot;, &quot;we&quot;,
          &quot;us&quot; and &quot;our&quot; refer to CERTBRIDGE
          GLOBAL.
        </p>

        <div className="rounded-lg border bg-muted/30 p-5">
          <p className="font-semibold text-foreground">
            CERTBRIDGE GLOBAL
          </p>

          <p className="mt-2">
            Email:{" "}
            <a
              href="mailto:info@certbridgeglobal.com"
              className="font-medium text-primary hover:underline"
            >
              info@certbridgeglobal.com
            </a>
          </p>

          <p>
            Telephone:{" "}
            <a
              href="tel:+254710507872"
              className="font-medium text-primary hover:underline"
            >
              +254 710 507 872
            </a>
          </p>
        </div>
      </LegalSection>

      {/* 02 — INFORMATION WE COLLECT */}
      <LegalSection
        id="information-we-collect"
        title="2. Personal Information We Collect"
      >
        <p>
          The personal information we collect depends on how you
          interact with our services.
        </p>

        <div className="space-y-7">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              2.1 Client and Booking Information
            </h3>

            <p>
              When an organisation or individual makes an enquiry
              or requests a training service, we may collect:
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Name of the organisation.</li>
              <li>Name of the booking contact.</li>
              <li>Business or contact email address.</li>
              <li>Telephone number.</li>
              <li>Billing information.</li>
              <li>Requested course or training programme.</li>
              <li>Preferred training dates.</li>
              <li>Number of participants.</li>
              <li>Preferred training delivery method.</li>
              <li>Training location.</li>
              <li>Special requirements or instructions.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              2.2 Participant Information
            </h3>

            <p>
              Where a Client registers participants for a training
              programme, we may collect:
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Participant names.</li>
              <li>Email addresses.</li>
              <li>Telephone numbers, where required.</li>
              <li>Organisation or department information.</li>
              <li>Course registration details.</li>
              <li>Attendance information.</li>
              <li>Training completion information.</li>
              <li>Certificate details.</li>
            </ul>

            <p className="mt-3">
              The Client should ensure that it is authorised to
              provide participant information to us and that
              participants receive any notices required by
              applicable law.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              2.3 Payment and Financial Information
            </h3>

            <p>
              We may collect information relating to quotations,
              invoices, payments, refunds, and financial
              transactions.
            </p>

            <p>This may include:</p>

            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Invoice references.</li>
              <li>Amounts payable.</li>
              <li>Payment status.</li>
              <li>Payment dates.</li>
              <li>Transaction references.</li>
              <li>Billing details.</li>
              <li>Records of refunds or adjustments.</li>
            </ul>

            <p className="mt-3">
              Payment information is used for financial
              administration and record-keeping. Where payments
              are processed through an external payment provider,
              that provider may separately collect and process
              information in accordance with its own privacy
              policy.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              2.4 Trainer and Service Provider Information
            </h3>

            <p>
              Where necessary to arrange training, we may collect
              information about trainers, venues, and other service
              providers, including:
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Names and contact details.</li>
              <li>Professional profiles.</li>
              <li>Qualifications and experience.</li>
              <li>Areas of expertise.</li>
              <li>Availability.</li>
              <li>Agreed service fees.</li>
              <li>Assignment and booking information.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              2.5 Technical and Website Information
            </h3>

            <p>
              When you visit our website, certain technical
              information may be collected automatically,
              depending on the website features and technologies
              in use.
            </p>

            <p>This may include:</p>

            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>IP address.</li>
              <li>Browser type and version.</li>
              <li>Device information.</li>
              <li>Operating system.</li>
              <li>Pages visited.</li>
              <li>Date and time of visits.</li>
              <li>Referring website or page.</li>
              <li>Basic usage and diagnostic information.</li>
            </ul>

            <p className="mt-3">
              Where cookies or similar technologies are used,
              additional information about them will be provided
              in the Cookies section of this Policy or through an
              appropriate cookie notice.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              2.6 Communication Information
            </h3>

            <p>
              We may retain information contained in communications
              you send to us, including enquiries, booking
              discussions, support requests, feedback, and
              complaints.
            </p>

            <p>
              This may include the content of emails, messages,
              and other correspondence, together with relevant
              dates and contact details.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 03 — HOW WE USE INFORMATION */}
      <LegalSection
        id="how-we-use-information"
        title="3. How We Use Personal Information"
      >
        <p>
          We use personal information for purposes connected with
          providing and administering our services.
        </p>

        <p>These purposes may include:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Responding to training enquiries.</li>
          <li>Preparing quotations and proposals.</li>
          <li>Creating and managing bookings.</li>
          <li>Coordinating trainers, venues, and training schedules.</li>
          <li>Communicating with Clients and participants.</li>
          <li>Issuing invoices and administering payments.</li>
          <li>Confirming attendance and training completion.</li>
          <li>Preparing and issuing certificates.</li>
          <li>Responding to complaints and support requests.</li>
          <li>Maintaining business, financial, and administrative records.</li>
          <li>Improving our website and services.</li>
          <li>Protecting our systems and preventing fraud or misuse.</li>
          <li>Meeting legal and regulatory obligations.</li>
          <li>
            Sending relevant information about our services to
            existing Clients, where permitted by law.
          </li>
        </ul>

        <p>
          We will not use personal information for purposes that
          are incompatible with the purposes for which it was
          collected unless we have an appropriate legal basis or
          have otherwise complied with applicable legal
          requirements.
        </p>
      </LegalSection>

      {/* 04 — LAWFUL BASIS */}
      <LegalSection
        id="lawful-basis"
        title="4. Lawful Basis for Processing"
      >
        <p>
          We process personal information only where we have a
          lawful basis to do so under applicable data protection
          law.
        </p>

        <p>
          Depending on the circumstances, these bases may include:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              4.1 Performance of a Contract
            </h3>

            <p>
              We may process personal information where it is
              necessary to respond to a request, prepare a
              quotation, enter into a training arrangement, or
              perform our obligations under an agreement with you.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              4.2 Legal Obligation
            </h3>

            <p>
              We may process and retain information where necessary
              to comply with legal, tax, accounting, regulatory,
              or other statutory obligations.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              4.3 Legitimate Interests
            </h3>

            <p>
              We may process information where necessary for
              legitimate business interests, provided those
              interests are not overridden by the rights and
              freedoms of the individuals concerned.
            </p>

            <p>Examples may include:</p>

            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Managing and improving our services.</li>
              <li>Maintaining business records.</li>
              <li>Protecting our systems.</li>
              <li>Managing relationships with existing Clients.</li>
              <li>
                Communicating relevant service information to
                existing Clients where permitted by law.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              4.4 Consent
            </h3>

            <p>
              Where consent is required by law, we will seek it
              before processing the relevant personal information.
            </p>

            <p>
              You may withdraw consent at any time. Withdrawal
              does not affect the lawfulness of processing carried
              out before the withdrawal.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 05 — SHARING INFORMATION */}
      <LegalSection
        id="sharing-information"
        title="5. How We Share Personal Information"
      >
        <p>
          We do not sell personal information to third parties.
        </p>

        <p>
          We may share personal information where reasonably
          necessary for the purposes explained in this Policy.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              5.1 Trainers
            </h3>

            <p>
              We may share relevant participant or booking
              information with assigned trainers so that they can
              prepare for and deliver the agreed training
              programme.
            </p>

            <p>
              Only information reasonably necessary for the
              training arrangement should be shared.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              5.2 Venues and Training Facilities
            </h3>

            <p>
              Where a training venue is arranged, we may share
              relevant information with the venue to coordinate
              reservations, access, attendance, and other
              operational arrangements.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              5.3 Payment and Financial Service Providers
            </h3>

            <p>
              We may share relevant financial and transaction
              information with banks, payment processors,
              financial institutions, and other providers involved
              in processing or verifying payments.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              5.4 Technology and Service Providers
            </h3>

            <p>
              We may use third-party providers to support our
              website, hosting, databases, file storage, email
              delivery, communication systems, and other business
              operations.
            </p>

            <p>
              These providers may process personal information on
              our behalf where necessary to provide their services.
            </p>

            <p>
              Where applicable, we take reasonable steps to ensure
              that such providers are subject to appropriate
              contractual and security obligations.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              5.5 Corporate Clients and Employers
            </h3>

            <p>
              Where an organisation arranges training for its
              employees or representatives, we may share relevant
              information with the organisation&apos;s authorised
              booking contact or designated representative.
            </p>

            <p>
              This may include registration details, attendance
              information, completion status, and certificate
              information where relevant to the training
              arrangement.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              5.6 Legal and Regulatory Authorities
            </h3>

            <p>
              We may disclose personal information where required
              by law, court order, regulatory request, or other
              lawful process.
            </p>

            <p>
              We may also disclose information where reasonably
              necessary to establish, exercise, or defend legal
              claims.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 06 — INTERNATIONAL TRANSFERS */}
      <LegalSection
        id="international-transfers"
        title="6. International Transfers of Personal Information"
      >
        <p>
          Some of our technology providers or service providers
          may process or store personal information outside Kenya.
        </p>

        <p>
          Where personal information is transferred outside Kenya,
          we will take steps required by applicable data protection
          law to ensure that the transfer is lawful and that
          appropriate safeguards are in place.
        </p>

        <p>
          Depending on the circumstances, safeguards may include
          contractual protections, recognised transfer mechanisms,
          or other measures required by law.
        </p>
      </LegalSection>

      {/* 07 — DATA RETENTION */}
      <LegalSection
        id="data-retention"
        title="7. Data Retention"
      >
        <p>
          We retain personal information only for as long as
          reasonably necessary for the purposes for which it was
          collected, including providing services, maintaining
          business records, resolving disputes, and complying
          with legal obligations.
        </p>

        <p>
          Retention periods may vary depending on the type of
          information and the reason for processing.
        </p>

        <p>For example:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>
            Enquiry and booking information may be retained for
            the administration and history of the Client
            relationship.
          </li>
          <li>
            Invoices, payment records, and related financial
            information may be retained for the periods required
            by applicable tax and accounting laws.
          </li>
          <li>
            Participant attendance and certificate records may
            be retained where necessary to verify training
            completion.
          </li>
          <li>
            Communication records may be retained where necessary
            to manage enquiries, bookings, complaints, or disputes.
          </li>
          <li>
            Technical information may be retained according to
            the operational and security requirements of the
            relevant systems.
          </li>
        </ul>

        <p>
          When personal information is no longer required, we will
          take reasonable steps to delete, anonymise, or securely
          dispose of it, subject to applicable legal requirements.
        </p>
      </LegalSection>

      {/* 08 — SECURITY */}
      <LegalSection
        id="security"
        title="8. Security of Personal Information"
      >
        <p>
          We take reasonable technical and organisational measures
          to protect personal information against unauthorised
          access, disclosure, alteration, loss, or destruction.
        </p>

        <p>These measures may include:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Access controls and role-based permissions.</li>
          <li>Authentication and account security measures.</li>
          <li>Secure data transmission where supported.</li>
          <li>
            Restricted access to business and administrative
            systems.
          </li>
          <li>
            Appropriate use of third-party service providers.
          </li>
          <li>
            Reasonable internal procedures for handling personal
            information.
          </li>
        </ul>

        <p>
          No method of electronic transmission or storage is
          completely secure. While we take reasonable steps to
          protect personal information, we cannot guarantee
          absolute security.
        </p>

        <p>
          Where a personal data breach occurs, we will take
          appropriate steps in accordance with applicable legal
          requirements.
        </p>
      </LegalSection>

      {/* 09 — YOUR RIGHTS */}
      <LegalSection
        id="your-rights"
        title="9. Your Data Protection Rights"
      >
        <p>
          Under applicable data protection law, including the
          Kenya Data Protection Act, 2019, you may have the right to:
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>
            Be informed about how your personal information is used.
          </li>
          <li>
            Request access to personal information we hold about you.
          </li>
          <li>
            Request correction of inaccurate, incomplete, or
            outdated information.
          </li>
          <li>
            Request deletion of personal information where the law
            permits.
          </li>
          <li>
            Object to the processing of your personal information
            in certain circumstances.
          </li>
          <li>
            Request restriction of processing in circumstances
            provided by law.
          </li>
          <li>
            Request portability of personal information where
            applicable.
          </li>
          <li>
            Withdraw consent where processing is based on consent.
          </li>
          <li>
            Lodge a complaint with the relevant data protection
            authority.
          </li>
        </ul>

        <p>
          These rights are subject to applicable legal conditions
          and exceptions. For example, we may need to retain
          certain information to comply with legal obligations or
          establish, exercise, or defend legal claims.
        </p>

        <p>
          To exercise your rights, contact us using the details
          provided in the Contact Us section.
        </p>

        <p>
          We may need to verify your identity before responding
          to a request.
        </p>
      </LegalSection>

      {/* 10 — MARKETING */}
      <LegalSection
        id="marketing"
        title="10. Marketing Communications"
      >
        <p>
          CERTBRIDGE GLOBAL may use relevant contact information
          to send existing Clients information about our training
          programmes, upcoming courses, corporate training
          opportunities, service updates, and other offerings
          that may be relevant to their previous engagement with us.
        </p>

        <p>
          We will do so only where permitted by applicable law
          and subject to any required conditions or consent
          requirements.
        </p>

        <p>
          Marketing communications may be sent through email,
          telephone, or other communication channels for which
          we have an appropriate legal basis.
        </p>

        <p>You may opt out of marketing communications at any time by:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>
            Using the unsubscribe option included in an email,
            where available.
          </li>
          <li>
            Contacting us and requesting that you no longer receive
            marketing communications.
          </li>
        </ul>

        <p>
          Opting out of marketing communications will not prevent
          us from sending essential service-related messages,
          such as booking confirmations, payment notices, invoices,
          or other communications necessary to administer an
          existing arrangement.
        </p>
      </LegalSection>

      {/* 11 — COOKIES */}
      <LegalSection
        id="cookies"
        title="11. Cookies and Similar Technologies"
      >
        <p>
          Our website may use cookies or similar technologies to
          support its operation and improve the user experience.
        </p>

        <p>Cookies may be used for purposes such as:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Enabling essential website functionality.</li>
          <li>Remembering user preferences.</li>
          <li>Understanding website usage.</li>
          <li>Improving website performance and security.</li>
        </ul>

        <p>
          Where non-essential cookies require consent under
          applicable law, we will seek the necessary consent
          before using them.
        </p>

        <p>
          You may also be able to control cookies through your
          browser settings. Disabling certain cookies may affect
          the functionality of parts of the website.
        </p>
      </LegalSection>

      {/* 12 — CHILDREN */}
      <LegalSection
        id="children"
        title="12. Children's Personal Information"
      >
        <p>
          CERTBRIDGE GLOBAL&apos;s services are primarily intended for
          organisations, professionals, and adult participants.
        </p>

        <p>
          We do not knowingly seek to collect children&apos;s personal
          information unless it is necessary for a specific
          programme and there is an appropriate legal basis and
          any required authorisation.
        </p>

        <p>
          Where information relating to a child is required, we
          will take steps appropriate to the circumstances and
          applicable law.
        </p>

        <p>
          If you believe that a child has provided personal
          information to us without the required authorisation,
          please contact us.
        </p>
      </LegalSection>

      {/* 13 — THIRD-PARTY WEBSITES */}
      <LegalSection
        id="third-party-websites"
        title="13. Third-Party Websites and Services"
      >
        <p>
          Our website may contain links to third-party websites
          or services.
        </p>

        <p>
          Those websites and services operate independently and
          may have their own privacy policies and practices.
        </p>

        <p>
          CERTBRIDGE GLOBAL is not responsible for the privacy
          practices, content, or security of third-party websites.
          We encourage you to review their privacy policies before
          providing personal information.
        </p>
      </LegalSection>

      {/* 14 — TRAINING RECORDINGS */}
      <LegalSection
        id="recordings"
        title="14. Training Sessions and Recordings"
      >
        <p>
          CERTBRIDGE GLOBAL does not routinely record training
          sessions.
        </p>

        <p>
          We do not create or retain audio, video, or screen
          recordings of training sessions as part of our standard
          training delivery.
        </p>

        <p>
          Participants and Clients should not record training
          sessions without prior written agreement from
          CERTBRIDGE GLOBAL and any other relevant parties.
        </p>

        <p>
          This does not prevent us from processing ordinary
          administrative information relating to a training
          programme, such as registration, attendance,
          communication, and completion records.
        </p>
      </LegalSection>

      {/* 15 — CONTACT */}
      <LegalSection
        id="contact-us"
        title="15. Contact Us and Complaints"
      >
        <p>
          If you have questions about this Privacy Policy, wish
          to exercise your data protection rights, or have a
          concern about how we handle personal information,
          please contact us.
        </p>

        <div className="rounded-xl border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground">
            CERTBRIDGE GLOBAL
          </h3>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </p>

              <a
                href="mailto:info@certbridgeglobal.com"
                className="text-sm font-medium text-primary hover:underline"
              >
                info@certbridgeglobal.com
              </a>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Telephone
              </p>

              <a
                href="tel:+254710507872"
                className="text-sm font-medium text-foreground hover:text-primary"
              >
                +254 710 507 872
              </a>
            </div>
          </div>
        </div>

        <p>
          If you are not satisfied with how we handle your
          concern, you may also lodge a complaint with the
          Office of the Data Protection Commissioner (ODPC)
          in Kenya, subject to the applicable procedures.
        </p>
      </LegalSection>

      {/* 16 — POLICY CHANGES */}
      <LegalSection
        id="policy-changes"
        title="16. Changes to This Privacy Policy"
      >
        <p>
          We may update this Privacy Policy from time to time
          to reflect changes in our services, business operations,
          technology, or legal requirements.
        </p>

        <p>
          Any updated version will be published on our website
          with a revised &quot;Last updated&quot; date.
        </p>

        <p>
          We encourage you to review this Policy periodically
          to remain informed about how we handle personal
          information.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
