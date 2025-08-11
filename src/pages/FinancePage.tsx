import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import FinanceCalculator from "@/components/home/FinanceCalculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FinancePage() {
  return (
    <div>
      <Helmet>
        <title>Finance | EMI Calculator, Documents & Partners</title>
        <meta name="description" content="Flexible finance options with leading banks & NBFCs. Use our EMI calculator and learn required documents for quick approvals." />
        <link rel="canonical" href="/finance" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is the minimum down payment?", acceptedAnswer: { "@type": "Answer", text: "Down payment typically starts from 10% depending on profile and vehicle." } },
              { "@type": "Question", name: "How long does approval take?", acceptedAnswer: { "@type": "Answer", text: "Approvals can be as quick as 24-48 hours with complete documents." } }
            ]
          })}
        </script>
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold">Finance</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">We partner with leading banks and NBFCs to offer attractive ROI, quick approvals, and flexible tenures tailored to your business cash flows.</p>

        <section className="mt-6">
          <FinanceCalculator />
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-10">
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Partners</h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>State Bank of India</li>
              <li>HDFC Bank</li>
              <li>ICICI Bank</li>
              <li>Tata Motors Finance</li>
            </ul>
          </article>
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Documents</h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>KYC: Aadhaar, PAN</li>
              <li>Bank statements (6 months)</li>
              <li>Income proof / ITR</li>
              <li>Business proof (if applicable)</li>
            </ul>
          </article>
          <article className="p-6 rounded border">
            <h2 className="font-semibold mb-2">Benefits</h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Low down payment schemes</li>
              <li>Attractive ROI</li>
              <li>Tenure up to 60 months</li>
              <li>Fast-track disbursals</li>
            </ul>
          </article>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the minimum down payment?</AccordionTrigger>
              <AccordionContent>Down payment typically starts from 10% depending on the customer profile and vehicle model.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long does approval take?</AccordionTrigger>
              <AccordionContent>With complete documentation, approvals can be as quick as 24–48 hours.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I foreclose the loan?</AccordionTrigger>
              <AccordionContent>Yes, foreclosure is possible as per lender policy. Foreclosure charges may apply.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <Footer />
    </div>
  );
}
