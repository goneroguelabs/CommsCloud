"use client";

import { useState } from "react";

type Faq = {
  question: string;
  answer: string;
};

export function FaqShowcase({ faqs }: { faqs: Faq[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div className="faq-showcase" data-reveal="right">
      {faqs.map((faq, index) => {
        const isOpen = index === activeIndex;

        return (
          <article
            key={faq.question}
            className={`faq-accordion-item ${isOpen ? "is-open" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
            onFocus={() => setActiveIndex(index)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setActiveIndex(-1);
              }
            }}
          >
            <button
              type="button"
              className="faq-accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => setActiveIndex(isOpen ? -1 : index)}
            >
              <span>{faq.question}</span>
              <span className="faq-chevron" aria-hidden="true" />
            </button>
            <div className="faq-accordion-panel" aria-hidden={!isOpen}>
              <p>{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
