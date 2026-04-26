import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";

const subjects = ["General question", "Technical issue", "Billing & subscription", "Business & API inquiry", "Press & media", "Other"];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name must be less than 100 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(255, "Email must be less than 255 characters."),
  subject: z.enum(["General question", "Technical issue", "Billing & subscription", "Business & API inquiry", "Press & media", "Other"]),
  message: z.string().trim().min(20, "Message must be at least 20 characters.").max(1000, "Message must be less than 1000 characters."),
});

type ContactFields = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export default function Contact() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as ContactFields;
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      event.preventDefault();
      setSent(false);
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as ContactErrors);
      return;
    }

    event.preventDefault();
    setErrors({});
    setSent(true);
    form.reset();
  };

  return (
    <PageWrapper className="py-10 lg:py-16">
      <section className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4 text-center">
          <Badge variant="amber">Contact</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">Send us a message</h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-text-secondary">Questions, support requests, partnerships, and press inquiries go straight to the RankFinal team at KM TECH LABS in Kristiansand, Norway.</p>
        </header>

        <Card className="border-accent-amber/60 shadow-amber">
          <CardHeader>
            <div className="flex size-12 items-center justify-center rounded-card bg-accent-amber/15 text-accent-amber"><Send className="size-6" aria-hidden="true" /></div>
            <CardTitle>Contact form</CardTitle>
            <CardDescription>Your email is used for replies only and is never displayed publicly.</CardDescription>
          </CardHeader>
          <CardContent>
            {sent && (
              <div className="mb-6 flex gap-3 rounded-card border border-success/40 bg-success/10 p-4 text-sm font-bold text-text-primary" role="status">
                <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
                <span>Message sent! We'll get back to you within 24 hours. Pro users: within 4 hours.</span>
              </div>
            )}

            <form action="https://formspree.io/f/kjmersland@gmail.com" method="POST" onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" error={errors.name}><Input name="name" autoComplete="name" required maxLength={100} className="h-12 bg-surface focus-visible:border-accent-amber" /></Field>
                <Field label="Email" error={errors.email}><Input name="email" type="email" autoComplete="email" required maxLength={255} className="h-12 bg-surface focus-visible:border-accent-amber" /></Field>
              </div>
              <Field label="Subject" error={errors.subject}>
                <select name="subject" required defaultValue="General question" className="flex h-12 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-text-primary outline-none ring-offset-background focus-visible:border-accent-amber focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {subjects.map((subject) => <option key={subject}>{subject}</option>)}
                </select>
              </Field>
              <Field label="Message" error={errors.message}><Textarea name="message" required minLength={20} maxLength={1000} className="min-h-40 bg-surface focus-visible:border-accent-amber" /></Field>
              <Button type="submit" variant="amber" size="lg" className="w-full sm:w-auto">Send message <ArrowRight className="size-4" aria-hidden="true" /></Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PageWrapper>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block space-y-2 text-sm font-bold text-text-primary"><span>{label}</span>{children}{error && <span className="block text-sm font-semibold text-destructive">{error}</span>}</label>;
}