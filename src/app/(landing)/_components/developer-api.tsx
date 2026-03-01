import { Button } from '@/components/ui/button';
import { BookOpen, Code2, Terminal, Webhook } from 'lucide-react';

export default function DeveloperAPI() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">Built for Developers</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance">
            Full API access to manage everything programmatically. Integrate easyCron seamlessly
            into your workflow.
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="bg-card border-border rounded-lg border p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Code2 className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Complete API Control</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Full CRUD operations for projects and jobs. Create, read, update, and delete
              everything through our RESTful API.
            </p>
            <div className="bg-background border-border overflow-x-auto rounded-lg border p-4 font-mono text-sm">
              <div className="text-green-400">POST /api/v1/jobs</div>
              <div className="text-muted-foreground mt-2">{'{'}</div>
              <div className="text-muted-foreground ml-4">{'"name": "backup-db",'}</div>
              <div className="text-muted-foreground ml-4">{'"schedule": "0 2 * * *",'}</div>
              <div className="text-muted-foreground ml-4">
                {'"url": "https://api.example.com/backup"'}
              </div>
              <div className="text-muted-foreground">{'}'}</div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Webhook className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Webhook Events</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Receive real-time notifications when jobs succeed, fail, or timeout. Keep your systems
              in sync automatically.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">job.completed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-muted-foreground">job.failed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">job.timeout</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">job.started</span>
              </div>
            </div>
          </div>
        </div>

        <div className="from-primary/10 to-primary/5 border-primary/20 rounded-lg border bg-gradient-to-br p-8 md:p-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-lg p-3">
                <BookOpen className="text-primary h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-semibold">Comprehensive API Documentation</h3>
                <p className="text-muted-foreground">
                  Detailed guides, code examples, and interactive API reference to get you started
                  in minutes.
                </p>
              </div>
            </div>
            <Button size="lg" className="shrink-0">
              <Terminal className="mr-2 h-4 w-4" />
              View API Docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
