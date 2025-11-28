import { ArrowRight, Key, Webhook } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Developer Tools',
  description: 'Manage your API keys and webhooks',
};

export default function DevelopersPage() {
  const tools = [
    {
      title: 'API Keys',
      description: 'Create, manage, and rotate your API keys for secure access to our platform.',
      icon: Key,
      href: '/developers/api-keys',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Webhooks',
      description:
        'Set up and manage webhooks to receive real-time events and integrate with external systems.',
      icon: Webhook,
      href: '/developers/webhooks',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm font-medium">
            Developer Portal
          </div>
          <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Developer Tools & Resources
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Everything you need to integrate with our platform and build powerful applications.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group border-border bg-card hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden rounded-2xl border p-8 transition-all hover:shadow-lg"
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 transition-opacity group-hover:opacity-5`}
                />

                {/* Content */}
                <div className="relative space-y-4">
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${tool.color} p-3 text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-foreground text-2xl font-semibold">{tool.title}</h2>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="text-primary flex items-center gap-2 pt-4">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="border-border bg-card/50 mt-16 rounded-2xl border p-8 backdrop-blur-sm">
          <h3 className="text-foreground mb-4 text-lg font-semibold">Quick Start</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-foreground font-medium">For API Integration</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                Start by creating your first API key to authenticate requests and begin building.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-medium">For Real-time Events</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                Set up webhooks to receive instant notifications about important events in your
                account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
