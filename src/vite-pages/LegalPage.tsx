import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";

const content = {
  privacy: {
    badge: "Privacy policy",
    title: "Privacy Policy",
    intro: "This privacy policy explains how RankFinal.com, operated by KM TECH LABS in Kristiansand, Norway, handles personal data under GDPR.",
    sections: [
      ["Data controller", "KM TECH LABS, Kristiansand, Norway is the data controller for RankFinal.com. Privacy requests can be submitted through the contact form."],
      ["Data collection", "We collect only the data needed to operate the service, such as account details, billing status, support messages, search activity required for saved results, and technical security logs."],
      ["Cookies", "RankFinal uses essential cookies only. We do not use tracking cookies, advertising cookies, or third-party behavioral profiling cookies."],
      ["User rights", "You may request access, correction, deletion, restriction, portability, or objection to processing of your personal data. You may also contact your local data protection authority."],
      ["EU hosting", "RankFinal is designed to be hosted in the EU where possible. We apply appropriate safeguards when service providers process data outside the EU/EEA."],
      ["Retention", "We keep personal data only as long as required to provide the service, satisfy legal obligations, prevent abuse, and resolve disputes."],
    ],
  },
  terms: {
    badge: "Terms",
    title: "Terms of Service",
    intro: "These terms govern use of RankFinal.com, an independent information and ranking service operated by KM TECH LABS.",
    sections: [
      ["Service description", "RankFinal provides rankings, source summaries, score breakdowns, and independent information to help users compare products and services."],
      ["Free vs paid", "The free plan includes limited searches and basic results. Paid plans may include unlimited searches, source lists, export features, alerts, saved results, API access, and business features depending on the plan."],
      ["No liability for purchase decisions", "RankFinal provides information only. You are responsible for verifying details, prices, eligibility, terms, safety information, and suitability before making a purchase or financial decision."],
      ["Acceptable use", "You may not scrape, abuse, reverse engineer, overload, resell, or misuse RankFinal services without written permission."],
      ["Changes", "We may update features, plans, pricing, and these terms. Continued use means you accept the updated terms."],
      ["Governing law", "These terms are governed by Norwegian law, with KM TECH LABS based in Kristiansand, Norway."],
    ],
  },
  cookies: {
    badge: "Cookies",
    title: "Cookie Policy",
    intro: "RankFinal uses essential cookies only. No tracking or advertising cookies are used.",
    sections: [
      ["Essential cookies", "Essential cookies support core functions such as cookie consent, security, authentication, billing status, and saved preferences."],
      ["No tracking", "We do not use advertising cookies, retargeting pixels, behavioral analytics cookies, or third-party tracking cookies."],
      ["Managing cookies", "You can manage or delete cookies through your browser settings. Some essential features may stop working if essential cookies are blocked."],
      ["Consent", "On first visit, RankFinal asks you to accept or manage essential-cookie information. Because only essential cookies are used, there are no marketing categories to opt into."],
    ],
  },
  disclaimer: {
    badge: "Disclaimer",
    title: "Independent Information Disclaimer",
    intro: "RankFinal provides independent information only. Always verify with official sources before making financial, medical, or safety-critical decisions.",
    sections: [
      ["Information only", "RankFinal results are based on publicly available test data and independent sources. They are not professional financial, legal, medical, engineering, or safety advice."],
      ["Market changes", "Results are updated regularly but may not reflect the most recent market changes, price changes, policy updates, recalls, or availability changes."],
      ["Official verification", "Before making financial, medical, safety-critical, insurance, utility, or high-value purchase decisions, verify details directly with official providers, regulators, or qualified professionals."],
      ["Independence", "RankFinal does not accept payment from reviewed brands for recommendation placement."],
    ],
  },
};

type LegalKind = keyof typeof content;

export function LegalPage({ kind }: { kind: LegalKind }) {
  const page = content[kind];
  return (
    <PageWrapper className="py-10 lg:py-16">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4">
          <Badge variant="amber">{page.badge}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">{page.title}</h1>
          <p className="text-lg leading-8 text-text-secondary">{page.intro}</p>
        </header>
        <Card>
          <CardContent className="space-y-8 p-6 sm:p-8">
            {page.sections.map(([heading, body]) => (
              <section key={heading} className="space-y-3">
                <h2 className="text-2xl font-extrabold text-text-primary">{heading}</h2>
                <p className="text-base leading-8 text-text-secondary">{body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
        <p className="text-sm text-text-secondary">Questions? Contact <Link to="/contact" className="font-bold text-accent-amber hover:underline">KM TECH LABS</Link>.</p>
      </article>
    </PageWrapper>
  );
}
