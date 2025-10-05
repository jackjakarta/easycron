import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import Header from '@/components/common/header';

import ProjectsDisplay from './projects-display';

export default function Page() {
  return (
    <>
      <Header>
        <CustomBreadcrumbs current="Projects" trail={[]} />
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProjectsDisplay />
      </div>
    </>
  );
}
