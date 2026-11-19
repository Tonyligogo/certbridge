
import type { Metadata } from "next";
import { LegalDocumentLayout, LegalSectionLink } from "../components/legal/legal-document-layout";
import { LegalSection } from "../components/legal/legal-section";

export const metadata: Metadata = {
  title: "Terms & Conditions | CertBridge Global",
  description:
    "Read the terms and conditions governing training enquiries, bookings, payments, delivery and other services provided by CertBridge Global.",
};

const sections: LegalSectionLink[] = [
  { id: "about-certbridge", title: "About CertBridge Global" },
  { id: "enquiries-registration", title: "Training Enquiries and Registration" },
  { id: "quotations-fees", title: "Quotations and Training Fees" },
  { id: "booking-confirmation", title: "Booking Confirmation and Scheduling" },
  { id: "payments", title: "Invoices and Payments" },
  { id: "client-cancellations", title: "Changes and Cancellations by Clients" },
  { id: "certbridge-cancellations", title: "Changes and Cancellations by CertBridge" },
  { id: "training-delivery", title: "Trainers and Training Delivery" },
  { id: "venues", title: "Training Venues and Arrangements" },
  { id: "participant-conduct", title: "Participant Responsibilities" },
  { id: "attendance-certificates", title: "Attendance and Certificates" },
  { id: "intellectual-property", title: "Training Materials and Intellectual Property" },
  { id: "online-training", title: "Online Training and Technology" },
  { id: "recordings", title: "Training Recordings" },
  { id: "confidentiality", title: "Confidentiality" },
  { id: "privacy", title: "Personal Data and Privacy" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "complaints-disputes", title: "Complaints and Dispute Resolution" },
  { id: "changes-to-terms", title: "Changes to These Terms" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact-us", title: "Contact Us" },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalDocumentLayout
      title="Terms & Conditions"
      description="Please read these terms carefully before making a training enquiry, booking a programme or using our services."
      lastUpdated="18 November 2026"
      sections={sections}
    >
      <div className="legal-document">
        <p>
          These Terms and Conditions govern the provision of training,
          professional development and related services by CERTBRIDGE GLOBAL.
          By submitting an enquiry, requesting a quotation, making a booking
          or using our services, you agree to be bound by these terms.
        </p>

        <p>
          If you are making a booking on behalf of an organisation, you
          confirm that you are authorised to act on its behalf and that
          the organisation accepts these terms.
        </p>

        <LegalSection id="about-certbridge" title="1. About CertBridge Global">
          <p>
            CERTBRIDGE GLOBAL is a registered business providing access to
            corporate training, professional development programmes and
            related training arrangements.
          </p>
          <p>
            Depending on the requirements of a client, we may coordinate
            trainers, training venues, learning materials and other services
            necessary to deliver a training programme.
          </p>
        </LegalSection>

        <LegalSection
          id="enquiries-registration"
          title="2. Training Enquiries and Registration"
        >
          <p>
            Clients may submit training enquiries through our website,
            email, telephone or other official communication channels.
          </p>
          <p>
            An enquiry does not constitute a confirmed booking or create
            an obligation for CertBridge Global to provide a training
            programme.
          </p>
          <p>
            Clients are responsible for providing accurate and complete
            information, including the requested course, participant
            numbers, preferred dates, delivery arrangements and any
            relevant organisational requirements.
          </p>
          <p>
            We may request additional information or clarification before
            preparing a quotation or confirming a booking.
          </p>
        </LegalSection>

        <LegalSection
          id="quotations-fees"
          title="3. Quotations and Training Fees"
        >
          <p>
            Following an enquiry, CertBridge Global may provide a quotation
            outlining the proposed training programme, fees, delivery
            arrangements and other relevant details.
          </p>
          <p>
            Quotations are based on the information provided by the client
            and may take into account:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>The selected course and its duration.</li>
            <li>The number of participants.</li>
            <li>The required trainer or specialist expertise.</li>
            <li>The training delivery mode and location.</li>
            <li>Venue, travel, accommodation and other logistical costs.</li>
            <li>Any additional services requested by the client.</li>
          </ul>
          <p>
            If the client&apos;s requirements change after a quotation has been
            issued, the quotation may need to be revised.
          </p>
          <p>
            Unless expressly stated otherwise, quotations are valid only
            for the period indicated in the quotation document.
          </p>
        </LegalSection>

        <LegalSection
          id="booking-confirmation"
          title="4. Booking Confirmation and Scheduling"
        >
          <p>
            A training booking is confirmed only when CertBridge Global
            has accepted the booking and communicated confirmation to
            the client.
          </p>
          <p>
            A booking may be subject to trainer availability, venue
            availability, receipt of the required advance payment and
            agreement on the training schedule.
          </p>
          <p>
            Preferred training dates submitted during an enquiry are
            requests and are not guaranteed until confirmed in writing.
          </p>
          <p>
            Where a booking involves several parties, including trainers
            and venue providers, CertBridge Global will coordinate the
            arrangements and communicate relevant confirmations to
            the client.
          </p>
        </LegalSection>

        <LegalSection id="payments" title="5. Invoices and Payments">
          <p>
            CertBridge Global operates an advance-payment arrangement
            for confirmed training bookings. The applicable payment
            amount, currency, payment deadline and payment instructions
            will be communicated through the quotation or invoice.
          </p>
          <p>
            Clients are expected to make the required payment within
            the stated period to secure the training arrangements.
          </p>
          <p>
            Unless otherwise agreed in writing, training services will
            not be considered fully secured until the required advance
            payment has been received and the booking has been confirmed.
          </p>
          <p>
            Any additional costs arising from changes to the agreed
            programme may be communicated separately and may require
            additional payment.
          </p>
          <p>
            Clients should retain payment confirmations and promptly
            notify CertBridge Global of any payment discrepancies.
          </p>
        </LegalSection>

        <LegalSection
          id="client-cancellations"
          title="6. Changes, Rescheduling and Cancellation by Clients"
        >
          <p>
            Clients should notify CertBridge Global as soon as possible
            if they need to change, reschedule or cancel a confirmed
            training booking.
          </p>
          <p>
            Requests to change training dates, participant numbers,
            locations, delivery modes or other agreed arrangements
            are subject to availability and may require a revised
            quotation.
          </p>
          <p>
            Where a client cancels a confirmed booking, CertBridge Global
            may recover costs that have already been committed or
            reasonably incurred in preparing for and arranging the
            training programme.
          </p>
          <p>
            Such costs may include trainer commitments, venue deposits,
            travel arrangements, accommodation, materials preparation
            and other non-recoverable expenses directly related to
            the booking.
          </p>
          <p>
            Any applicable cancellation charges or recoverable costs
            will be communicated to the client. The amount will depend
            on the circumstances and commitments already made.
          </p>
        </LegalSection>

        <LegalSection
          id="certbridge-cancellations"
          title="7. Changes or Cancellation by CertBridge Global"
        >
          <p>
            Although we make reasonable efforts to deliver confirmed
            programmes as scheduled, circumstances may occasionally
            require us to change or cancel a training arrangement.
          </p>
          <p>
            This may arise from trainer unavailability, venue issues,
            operational constraints, insufficient attendance or
            circumstances beyond our reasonable control.
          </p>
          <p>
            Where reasonably possible, we will notify the client and
            discuss suitable alternatives, which may include rescheduling,
            appointing an alternative qualified trainer or making
            alternative delivery arrangements.
          </p>
          <p>
            Where CertBridge Global cancels a programme and no suitable
            alternative arrangement is agreed, the parties will discuss
            an appropriate resolution, including any applicable refund
            of payments received for services not delivered.
          </p>
        </LegalSection>

        <LegalSection
          id="training-delivery"
          title="8. Trainers and Training Delivery"
        >
          <p>
            CertBridge Global works with trainers and subject-matter
            specialists to support the delivery of training programmes.
          </p>
          <p>
            We make reasonable efforts to engage trainers with relevant
            qualifications, knowledge and experience for the requested
            programme.
          </p>
          <p>
            Where necessary, we may propose a replacement trainer with
            reasonably comparable expertise. Any material changes to
            the agreed delivery arrangements will be communicated to
            the client.
          </p>
          <p>
            Training delivery may be online, at the client&apos;s premises
            or at an arranged venue, depending on the agreed booking.
          </p>
        </LegalSection>

        <LegalSection
          id="venues"
          title="9. Training Venues and Delivery Arrangements"
        >
          <p>
            Where venue arrangements are included in a booking,
            CertBridge Global may coordinate the identification,
            reservation and preparation of a suitable training venue.
          </p>
          <p>
            The client is responsible for communicating any special
            venue requirements, accessibility needs or logistical
            considerations before the booking is finalised.
          </p>
          <p>
            Changes to venue requirements after confirmation may
            result in additional costs or scheduling adjustments.
          </p>
        </LegalSection>

        <LegalSection
          id="participant-conduct"
          title="10. Participant Responsibilities and Conduct"
        >
          <p>
            Clients are responsible for ensuring that participants
            receive the information necessary to attend and take part
            in the training programme.
          </p>
          <p>Participants are expected to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Attend sessions punctually and participate appropriately.</li>
            <li>Follow reasonable instructions provided by trainers.</li>
            <li>Respect trainers, other participants and venue personnel.</li>
            <li>Use training materials and facilities responsibly.</li>
            <li>Observe applicable health, safety and venue requirements.</li>
          </ul>
          <p>
            CertBridge Global may take reasonable steps to address
            disruptive, abusive or unsafe conduct during a training
            programme.
          </p>
        </LegalSection>

        <LegalSection
          id="attendance-certificates"
          title="11. Attendance and Certificates"
        >
          <p>
            Attendance requirements and certificate eligibility may
            vary depending on the course, trainer, awarding body or
            applicable programme requirements.
          </p>
          <p>
            Where certificates are included, they will be issued subject
            to the relevant attendance, participation and assessment
            requirements.
          </p>
          <p>
            A certificate will not be guaranteed solely because a
            participant has been registered for a training programme.
          </p>
          <p>
            Clients are responsible for ensuring that participant
            names and other certificate details are accurate and
            submitted within the required timelines.
          </p>
        </LegalSection>

        <LegalSection
          id="intellectual-property"
          title="12. Training Materials and Intellectual Property"
        >
          <p>
            Training materials, presentations, documents, course
            content and other resources supplied by CertBridge Global
            or its trainers may be protected by intellectual property
            rights.
          </p>
          <p>
            Unless expressly authorised, clients and participants
            may use these materials for their own internal learning
            and reference purposes only.
          </p>
          <p>
            Materials must not be reproduced, distributed, sold,
            published, modified or used for commercial training
            purposes without prior permission from the relevant
            rights holder.
          </p>
          <p>
            Nothing in these terms transfers ownership of intellectual
            property belonging to CertBridge Global, its trainers
            or third-party content providers.
          </p>
        </LegalSection>

        <LegalSection
          id="online-training"
          title="13. Online Training and Technology"
        >
          <p>
            Where training is delivered online, participants may be
            required to access specified platforms, applications
            or communication tools.
          </p>
          <p>
            Clients and participants are responsible for having
            suitable devices, internet connectivity and access to
            the required platforms, unless otherwise agreed.
          </p>
          <p>
            CertBridge Global will make reasonable efforts to
            coordinate online sessions but cannot guarantee
            uninterrupted access where disruptions arise from
            internet service providers, third-party platforms
            or participant equipment.
          </p>
        </LegalSection>

        <LegalSection
          id="recordings"
          title="14. Training Recordings"
        >
          <p>
            Training sessions are not routinely recorded by
            CertBridge Global.
          </p>
          <p>
            If a particular programme requires recording for an
            agreed purpose, the relevant parties will be informed
            in advance and appropriate arrangements will be made.
          </p>
          <p>
            Participants must not record, photograph, livestream
            or otherwise capture training sessions without prior
            written permission from CertBridge Global and any
            other relevant parties.
          </p>
        </LegalSection>

        <LegalSection
          id="confidentiality"
          title="15. Confidentiality"
        >
          <p>
            Each party may receive confidential or commercially
            sensitive information in connection with a training
            engagement.
          </p>
          <p>
            The parties agree to take reasonable steps to protect
            such information and not disclose it to unauthorised
            third parties, except where disclosure is required
            by law or is necessary for the proper delivery of
            the agreed services.
          </p>
          <p>
            Confidential information does not include information
            that is already publicly available through no breach
            of these terms, or information lawfully obtained
            from another source without a confidentiality
            obligation.
          </p>
        </LegalSection>

        <LegalSection
          id="privacy"
          title="16. Personal Data and Privacy"
        >
          <p>
            CertBridge Global may collect and process personal
            information relating to clients, participants,
            trainers and other individuals involved in the
            provision of its services.
          </p>
          <p>
            Personal information will be handled in accordance
            with applicable data protection laws in Kenya,
            including the Data Protection Act, 2019.
          </p>
          <p>
            Further information about the personal information
            we collect, how we use it, when we share it and
            the rights available to individuals is provided
            in our{" "}
            <a
              href="/privacy-policy"
              className="font-medium text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>.
          </p>
        </LegalSection>

        <LegalSection
          id="liability"
          title="17. Limitation of Liability"
        >
          <p>
            CertBridge Global will exercise reasonable care and
            skill in coordinating and providing the agreed
            training services.
          </p>
          <p>
            Training programmes are intended to support learning
            and professional development. We do not guarantee
            any particular business outcome, employment result,
            promotion, examination result or professional
            certification unless expressly stated in writing.
          </p>
          <p>
            To the extent permitted by applicable law,
            CertBridge Global will not be liable for indirect
            or consequential losses arising from the use of
            our services.
          </p>
          <p>
            Nothing in these terms excludes or limits liability
            where doing so would be unlawful, including liability
            that cannot legally be excluded or limited.
          </p>
        </LegalSection>

        <LegalSection
          id="force-majeure"
          title="18. Force Majeure"
        >
          <p>
            Neither party will be held responsible for a failure
            or delay in performing its obligations where that
            failure or delay results from circumstances beyond
            its reasonable control.
          </p>
          <p>
            Such circumstances may include natural disasters,
            public emergencies, government restrictions,
            civil unrest, strikes, widespread service
            interruptions or other events that make
            performance impracticable or impossible.
          </p>
          <p>
            The affected party should notify the other party
            as soon as reasonably practicable and discuss
            appropriate steps to minimise disruption.
          </p>
        </LegalSection>

        <LegalSection
          id="complaints-disputes"
          title="19. Complaints and Dispute Resolution"
        >
          <p>
            Clients who have concerns about a training programme,
            booking or service should contact CertBridge Global
            using the contact details provided below.
          </p>
          <p>
            We will make reasonable efforts to review complaints
            and work towards a fair and practical resolution.
          </p>
          <p>
            Where a dispute cannot be resolved through direct
            communication, the parties may pursue the remedies
            available under applicable Kenyan law.
          </p>
        </LegalSection>

        <LegalSection
          id="changes-to-terms"
          title="20. Changes to These Terms"
        >
          <p>
            CertBridge Global may update these Terms and Conditions
            from time to time to reflect changes in its services,
            business practices or applicable legal requirements.
          </p>
          <p>
            The latest version will be published on our website
            together with its effective or last-updated date.
          </p>
          <p>
            Where a change materially affects an existing confirmed
            booking, we will communicate with the affected client
            as appropriate.
          </p>
        </LegalSection>

        <LegalSection
          id="governing-law"
          title="21. Governing Law"
        >
          <p>
            These Terms and Conditions are governed by the laws
            of the Republic of Kenya.
          </p>
          <p>
            Any dispute arising in connection with these terms
            will be subject to the jurisdiction of the
            competent courts of Kenya, subject to any
            applicable legal requirements.
          </p>
        </LegalSection>

        <LegalSection
          id="contact-us"
          title="22. Contact Us"
        >
          <p>
            If you have questions about these Terms and Conditions
            or need clarification about a booking, quotation
            or training arrangement, please contact us:
          </p>

          <div className="rounded-xl border border-border/70 p-5">
            <p className="font-semibold text-foreground">
              CERTBRIDGE GLOBAL
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@certbridgeglobal.com"
                className="text-primary underline underline-offset-4"
              >
                info@certbridgeglobal.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+254710507872"
                className="text-primary underline underline-offset-4"
              >
                +254 710 507 872
              </a>
            </p>
          </div>
        </LegalSection>
      </div>
    </LegalDocumentLayout>
  );
}
