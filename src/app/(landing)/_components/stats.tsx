export default function Stats() {
  const stats = [
    {
      value: '99.9%',
      label: 'uptime',
      description: 'guaranteed reliability.',
    },
    {
      value: '10M+',
      label: 'jobs',
      description: 'executed daily.',
    },
    {
      value: '<100ms',
      label: 'latency',
      description: 'average response.',
    },
    {
      value: '24/7',
      label: 'monitoring',
      description: 'real-time alerts.',
    },
  ];

  return (
    <section className="border-border bg-card border-y">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-card-foreground font-mono text-4xl font-bold md:text-5xl">
                {stat.value}
              </div>
              <div className="text-sm">
                <span className="text-card-foreground font-semibold">{stat.label}</span>
                <br />
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
