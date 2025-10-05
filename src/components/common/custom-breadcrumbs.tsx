import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

type BreadcrumbTrail = {
  name: string;
  href: string;
};

type CustomBreadcrumbProps = {
  current: string;
  trail?: BreadcrumbTrail[];
};

export default function CustomBreadcrumbs({ current, trail = [] }: CustomBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.length > 0 &&
          trail.map((item) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </React.Fragment>
          ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
