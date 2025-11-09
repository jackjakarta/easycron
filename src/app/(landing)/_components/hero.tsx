import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <div className="inline-block">
            <span className="text-accent-foreground font-mono text-sm">
              easyCron for Developers
            </span>
          </div>
          <h1 className="text-foreground text-5xl leading-tight font-bold text-balance md:text-6xl lg:text-7xl">
            Schedule jobs.
            <br />
            Monitor everything.
            <br />
            <span className="text-muted-foreground">Stay in control.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            {`Your team's toolkit to automate workflows and monitor cron jobs in real-time. Securely schedule, deploy, and scale automated tasks with confidence.`}
          </p>
          <div className="flex flex-wrap gap-4">
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
              className="border-border text-card-foreground hover:bg-secondary gap-2 bg-transparent"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="border-border bg-card rounded-lg border p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="border-border flex items-center gap-2 border-b pb-3">
                <div className="bg-accent h-3 w-3 rounded-full" />
                <span className="text-card-foreground font-mono text-sm">Active Jobs</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'backup-database', status: 'Running', time: '2m 34s' },
                  { name: 'send-reports', status: 'Scheduled', time: 'in 15m' },
                  { name: 'cleanup-logs', status: 'Success', time: '5m ago' },
                ].map((job, i) => (
                  <div
                    key={i}
                    className="bg-secondary flex items-center justify-between rounded-md p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          job.status === 'Running'
                            ? 'bg-accent animate-pulse'
                            : job.status === 'Success'
                              ? 'bg-green-500'
                              : 'bg-muted-foreground'
                        }`}
                      />
                      <span className="text-card-foreground font-mono text-sm">{job.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground text-xs">{job.status}</div>
                      <div className="text-muted-foreground text-xs">{job.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
