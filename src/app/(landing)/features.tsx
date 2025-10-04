import { BarChart3, Bell, Calendar, Code2, Shield, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description:
        'Use cron expressions or simple intervals. Schedule jobs with precision down to the second.',
    },
    {
      icon: Bell,
      title: 'Real-time Monitoring',
      description: 'Track job execution in real-time with detailed logs and performance metrics.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Visualize job performance, success rates, and execution patterns over time.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'End-to-end encryption, role-based access control, and audit logs for compliance.',
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description:
        'Get notified via email, Slack, or webhooks when jobs fail or exceed thresholds.',
    },
    {
      icon: Code2,
      title: 'Developer-First API',
      description: 'RESTful API with SDKs for Node.js, Python, Go, and more. Integrate in minutes.',
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="mb-16 space-y-4 text-center">
        <div className="inline-block">
          <span className="text-accent font-mono text-sm">Platform Features</span>
        </div>
        <h2 className="text-foreground text-4xl font-bold text-balance md:text-5xl">
          Everything you need to automate
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
          Built for developers who need reliability, visibility, and control over their automated
          workflows.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group border-border bg-card hover:border-accent rounded-lg border p-6 transition-colors"
          >
            <div className="bg-secondary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
              <feature.icon className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
