import { ArrowRightIcon, Layers3Icon, PanelsTopLeftIcon, PlugZapIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

const foundations = [
  {
    title: "Clear boundaries",
    description:
      "Pages own their work. Shared code stays neutral. Add more layers only when reuse earns them.",
    icon: Layers3Icon,
  },
  {
    title: "Useful defaults",
    description:
      "Typed routes, query caching, validation, accessible controls, and practical checks are ready.",
    icon: PanelsTopLeftIcon,
  },
  {
    title: "Replaceable transport",
    description:
      "Local mocks demonstrate the API seam. Connect a service without rewriting your screens.",
    icon: PlugZapIcon,
  },
] as const;

export function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="max-w-3xl pt-8 sm:pt-14">
        <p className="text-primary text-sm font-semibold tracking-[0.14em] uppercase">
          Bulletproof React
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Build from a solid foundation
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed">
          A small, production-minded frontend shell. Keep the infrastructure; replace the examples
          with your own idea.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="/records">
              Explore sample records <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/feature-sliced/" target="_blank" rel="noreferrer">
              Architecture guidance
            </a>
          </Button>
        </div>
      </section>

      <section aria-labelledby="foundation-heading" className="flex flex-col gap-5">
        <div>
          <h2 id="foundation-heading" className="text-2xl font-semibold tracking-tight">
            What is included
          </h2>
          <p className="text-muted-foreground mt-1">
            The pieces you need to start, without a product you need to undo.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {foundations.map(({ title, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <Icon aria-hidden="true" className="text-primary size-6" />
                <CardTitle className="mt-3">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <p className="text-muted-foreground text-sm">
        Sample records are disposable demonstration data, not a domain model.
      </p>
    </div>
  );
}
