import { renderToString } from 'react-dom/server';
import { Site } from './main';
export { origin, pageLanguage, publicPages, publicPath, notFound, lastMeaningfulUpdate } from './seo';
export { company, services } from './data';
export { translateText } from './language';
export const renderSite = (pathname: string) => renderToString(<Site pathname={pathname} staticLocation={pathname} />);
