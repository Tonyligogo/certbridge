import { FaqsContent } from "../components/faqs/faq-content";


export default function FAQsPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Help Centre
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Find answers to common questions about our training programmes,
            booking process, payment arrangements and delivery options.
            If you need further assistance, our team is happy to help.
          </p>
        </div>
      </section>

      <FaqsContent />
    </main>
  );
}
