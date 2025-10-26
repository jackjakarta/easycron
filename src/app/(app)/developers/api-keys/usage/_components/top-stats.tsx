import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';

export default function TopStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Requests</CardDescription>
          <CardTitle className="text-3xl">45,090</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP className="text-muted-foreground text-xs">+12.5% from last week</TypographyP>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Keys</CardDescription>
          <CardTitle className="text-3xl">12</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP className="text-muted-foreground text-xs">Out of 17 total keys</TypographyP>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Avg Rate Limit Usage</CardDescription>
          <CardTitle className="text-3xl">59%</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP className="text-muted-foreground text-xs">Across all keys</TypographyP>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Keys Near Limit</CardDescription>
          <CardTitle className="text-3xl">2</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP className="text-destructive text-xs">Requires attention</TypographyP>
        </CardContent>
      </Card>
    </div>
  );
}
