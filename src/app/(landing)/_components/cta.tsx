import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="border-border bg-card rounded-2xl border p-12 text-center md:p-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-card-foreground text-4xl font-bold text-balance md:text-5xl">
            Ready to automate your workflows?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join thousands of developers who trust easyCron to handle their scheduled tasks. Start
            your free trial today—no credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-card-foreground hover:bg-secondary bg-transparent"
            >
              View Pricing
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
