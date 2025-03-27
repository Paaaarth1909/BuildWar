import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I report a traffic violation?</AccordionTrigger>
            <AccordionContent>
              To report a traffic violation, create an account or sign in, then click on "Report Violation" in the
              navigation menu. Fill out the form with details about the violation, including location, time, and type.
              Upload photos or videos as evidence, and submit your report.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is my personal information kept private?</AccordionTrigger>
            <AccordionContent>
              Yes, your personal information is kept confidential. Only authorized traffic authorities can access your
              contact details, and your identity is never shared with the public or the reported violators.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What happens after I submit a report?</AccordionTrigger>
            <AccordionContent>
              After submission, your report is reviewed by local traffic authorities. If they find sufficient evidence,
              they will take appropriate action against the violator. You can track the status of your report in your
              dashboard.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>What types of violations can I report?</AccordionTrigger>
            <AccordionContent>
              You can report various traffic violations, including signal jumping, wrong-side driving, illegal parking,
              speeding, driving without a helmet/seatbelt, using a mobile phone while driving, and other dangerous
              driving behaviors.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>How can I check the status of my reports?</AccordionTrigger>
            <AccordionContent>
              You can view the status of all your submitted reports in your dashboard. Each report will show its current
              status (pending, in progress, resolved, or rejected) and any updates from the authorities.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Can I report a violation anonymously?</AccordionTrigger>
            <AccordionContent>
              While you need to create an account to submit reports, your identity is kept confidential from the public
              and the reported violators. Only authorized traffic authorities can access your information if needed for
              investigation purposes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>What evidence should I include in my report?</AccordionTrigger>
            <AccordionContent>
              Include clear photos or videos that show the violation, the vehicle's license plate (if possible), and the
              surrounding area for context. The more evidence you provide, the easier it is for authorities to take
              action.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>How long does it take for authorities to respond?</AccordionTrigger>
            <AccordionContent>
              Response times vary depending on the severity of the violation and the workload of local traffic
              authorities. Most reports are reviewed within 1-2 weeks, but serious violations may be addressed more
              quickly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger>Is this service available in multiple languages?</AccordionTrigger>
            <AccordionContent>
              Yes, our platform supports multiple languages to make it accessible to a wider audience. You can change
              the language using the language selector in the header.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger>Can I edit my report after submission?</AccordionTrigger>
            <AccordionContent>
              Once submitted, reports cannot be edited to maintain the integrity of the evidence. If you need to provide
              additional information, please contact support with your report ID.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

