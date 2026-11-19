import { createRoot, hydrateRoot } from 'react-dom/client';
import { Site } from './main';

const container = document.getElementById('root')!;
const pathname = location.pathname;
const site = <Site pathname={pathname} />;
if (container.dataset.prerendered === pathname) hydrateRoot(container, site);
else createRoot(container).render(site);
