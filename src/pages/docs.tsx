import { title } from "@/components/primitives";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
        </div>
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              subtitle="Press to expand"
              title="Accordion 1"
            >
              {defaultContent}
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Accordion 2"
              subtitle={
                <span>
                  Press to expand <strong>key 2</strong>
                </span>
              }
              title="Accordion 2"
            >
              {defaultContent}
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Accordion 3"
              subtitle="Press to expand"
              title="Accordion 3"
            >
              {defaultContent}
            </AccordionItem>
          </Accordion>
      </section>
    </DefaultLayout>
  );
}
