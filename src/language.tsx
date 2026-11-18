/// <reference types="vite/client" />
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import drafts from './locale-copy.json';
import locales from './locales.json';

export type Code = keyof typeof locales;
export const codes = Object.keys(locales) as Code[];
export const localeTag = (code: Code) => locales[code].tag;
const reviewedLocales: readonly Code[] = ['fr', 'sw', 'ln', 'pt'];
export function localeFromPath(path: string) { const code=path.split('/')[1] as Code; return codes.includes(code) ? code : undefined; }
export function stripLocale(path: string) { return localeFromPath(path) ? path.replace(/^\/[a-z]{2}(?=\/|$)/,'') || '/' : path; }
export function localPath(code: Code, path: string) { return code === 'en' ? stripLocale(path) : `/${code}${stripLocale(path)}`; }
const catalog: Record<string, Partial<Record<Code,string>>> = drafts;
// Reviewed navigation and hero text takes precedence over machine drafts.
const messages: Record<string, [string, string, string, string]> = {
  'Meet GIGI Cloud.':['Découvrez GIGI Cloud.','Ifahamu GIGI Cloud.','Yebá GIGI Cloud.','Conheça a GIGI Cloud.'],
  'Full name':['Nom complet','Jina kamili','Nkombo mobimba','Nome completo'], 'Email address':['Adresse e-mail','Barua pepe','Adresi ya e-mail','Endereço de correio electrónico'], 'Phone number':['Téléphone','Nambari ya simu','Nimero ya telefone','Número de telefone'], 'Service of interest':['Service souhaité','Huduma unayotaka','Mosala oyo olingi','Serviço pretendido'], 'Project location':['Lieu du projet','Eneo la mradi','Esika ya mosala','Local do projecto'], 'What do you have in mind?':['Décrivez votre projet','Eleza mradi wako','Lobelá mosala na yo','Descreva o seu projecto'], 'Send enquiry via WhatsApp':['Préparer la demande sur WhatsApp','Andaa ombi kupitia WhatsApp','Bongisá motuna na WhatsApp','Preparar pedido no WhatsApp'], 'Select a service':['Choisir un service','Chagua huduma','Poná mosala','Escolha um serviço'],
  'Access Control':['Contrôle des accès','Udhibiti wa kuingia','Bokɛngɛli ya bokɔti','Controlo de acessos'], 'CCTV and Surveillance':['Vidéosurveillance','Ufuatiliaji kwa kamera','Bokɛngɛli na bakamera','Videovigilância'], 'Fibre Solutions':['Fibre optique','Mitandao ya nyuzi macho','Réseau ya fibre','Fibra óptica'], 'IT Networking and Connectivity':['Réseaux et connectivité','Mitandao na mawasiliano','Réseau mpe boyokani','Redes e conectividade'], 'Alarm Systems':['Systèmes d’alarme','Mifumo ya tahadhari','Baalarme','Sistemas de alarme'], 'Electric Fencing':['Clôtures électriques','Uzio wa umeme','Lopango ya courant','Vedações eléctricas'], 'Electrical Installations':['Installations électriques','Ufungaji wa umeme','Ba installations ya courant','Instalações eléctricas'], 'Solar Energy Systems':['Systèmes solaires','Mifumo ya nishati ya jua','Ba système ya nguya ya moi','Sistemas de energia solar'], 'Data Backup Solutions':['Sauvegarde des données','Nakala rudufu za data','Bakopi ya ba données','Cópias de segurança'], 'Web Design':['Conception web','Ubunifu wa tovuti','Bokeli ya basite web','Design web'], 'Graphic Design':['Graphisme','Usanifu wa picha','Mayemi','Design gráfico'],
  Home: ['Accueil','Mwanzo','Ebandeli','Início'], About: ['À propos','Kuhusu sisi','Na ntina na biso','Sobre nós'], Services: ['Services','Huduma','Misala','Serviços'], Contact: ['Contact','Mawasiliano','Bokutani','Contacto'],
  'Service groups': ['Domaines','Makundi ya huduma','Bituluku ya misala','Áreas de serviço'], 'All services': ['Tous les services','Huduma zote','Misala nyonso','Todos os serviços'],
  'Request a quote': ['Demander un devis','Omba makadirio','Sɛngá talo','Pedir orçamento'], 'Discuss your project': ['Parlons de votre projet','Tuambie kuhusu mradi','Tólobela mosala na yo','Fale do seu projecto'], 'Discuss your requirements': ['Parlons de vos besoins','Eleza mahitaji yako','Yebisá biso makambo osengeli na yango','Fale das suas necessidades'],
  'Explore our solutions': ['Découvrir nos solutions','Gundua suluhisho zetu','Talá biyano na biso','Conheça as soluções'], 'Explore our capabilities': ['Nos compétences','Uwezo wetu','Makoki na biso','As nossas competências'], 'Browse capabilities': ['Voir les services','Angalia huduma','Talá misala','Ver serviços'], 'View capabilities': ['Voir les services','Angalia huduma','Talá misala','Ver serviços'], 'Start your enquiry': ['Décrire votre projet','Anza kuuliza','Bandá motuna na yo','Iniciar pedido'],
  'Security & Access': ['Sécurité et accès','Usalama na udhibiti wa kuingia','Bobateli mpe bokɔti','Segurança e acessos'], 'IT & Connectivity': ['Informatique et réseaux','TEHAMA na mitandao','Informatiki mpe réseau','Informática e redes'], 'Electrical & Solar': ['Électricité et solaire','Umeme na nishati ya jua','Courant mpe nguya ya moi','Electricidade e energia solar'], 'Web & Graphic Design': ['Web et graphisme','Ubunifu wa wavuti na michoro','Web mpe mayemi','Web e design gráfico'], 'Cloud Solutions': ['Solutions cloud','Huduma za wingu','Misala ya cloud','Soluções de cloud'],
  'Smart security. Seamless connectivity.': ['Sécurité intelligente. Réseaux fiables.','Usalama makini. Mitandao imara.','Bobateli ya mayele. Réseau ya makasi.','Segurança inteligente. Redes fiáveis.'],
  'Security, networks and energy for the places you work.': ['Sécurité, réseaux et énergie pour vos lieux de travail.','Usalama, mitandao na nishati kwa maeneo yako ya kazi.','Bobateli, réseau mpe nguya mpo na bisika na bino ya mosala.','Segurança, redes e energia para os seus locais de trabalho.'],
  'Meet GIGI Cloud Solutions.': ['Découvrez GIGI Cloud Solutions.','Ifahamu GIGI Cloud Solutions.','Yebá GIGI Cloud Solutions.','Conheça a GIGI Cloud Solutions.'], 'A Johannesburg team connecting technology to the needs of your premises.': ['Une équipe de Johannesburg qui adapte la technologie à vos locaux.','Timu ya Johannesburg inayooanisha teknolojia na mahitaji ya eneo lako.','Ekipa ya Johannesburg oyo ebongisaka tekinoloji mpo na esika na yo.','Uma equipa de Joanesburgo que adapta a tecnologia ao seu espaço.'],
  'Eleven services. One team.': ['Onze services. Une équipe.','Huduma kumi na moja. Timu moja.','Misala zomi na moko. Ekipa moko.','Onze serviços. Uma equipa.'], 'Find the right combination for your site.': ['Trouvez la bonne combinaison pour votre site.','Pata huduma zinazofaa eneo lako.','Poná misala oyo ebongi na esika na yo.','Encontre a combinação certa para as suas instalações.'],
  'Plan your next project.': ['Préparons votre projet.','Panga mradi wako.','Bongisá mosala na yo.','Planeie o seu projecto.'], 'Tell us what your premises need and where the work will take place.': ['Indiquez vos besoins et le lieu des travaux.','Tuambie unachohitaji na kazi itafanyikia wapi.','Yebisá biso oyo osengeli na yango mpe esika ya mosala.','Diga-nos o que precisa e onde será realizado o trabalho.'],
  'Control access. Protect your site.': ['Contrôlez les accès. Protégez vos locaux.','Dhibiti kuingia. Linda eneo lako.','Kambá bokɔti. Batelá esika na yo.','Controle os acessos. Proteja o seu espaço.'], 'Connect every workspace.': ['Reliez vos espaces de travail.','Unganisha kila eneo la kazi.','Kangisá bisika nyonso ya mosala.','Ligue todos os espaços de trabalho.'], 'Power your operations.': ['Alimentez vos installations.','Endesha shughuli zako kwa nishati.','Pesá misala na yo nguya.','Dê energia às suas operações.'], 'Design with clarity.': ['Un design clair.','Ubunifu unaoeleweka.','Mayemi ya polele.','Design com clareza.'], 'Keep your data within reach.': ['Gardez vos données accessibles.','Fikia data zako kwa urahisi.','Zwá ba données na yo na pɛtɛɛ.','Mantenha os dados acessíveis.'],
  'Access control, cameras, alarms and perimeter protection.': ['Accès, caméras, alarmes et protection périmétrique.','Udhibiti wa kuingia, kamera, kengele na ulinzi wa mipaka.','Bokɔti, bakamera, baalarme mpe bobateli ya lopango.','Acessos, câmaras, alarmes e protecção perimetral.'], 'Fibre and Wi-Fi built around your premises.': ['Fibre et Wi-Fi adaptés à vos locaux.','Fibre na Wi-Fi kwa mahitaji ya eneo lako.','Fibre mpe Wi-Fi mpo na esika na yo.','Fibra e Wi-Fi adaptados às suas instalações.'], 'Electrical installations, solar power and battery storage.': ['Installations électriques, solaire et batteries.','Mifumo ya umeme, nishati ya jua na betri.','Ba installations ya courant, nguya ya moi mpe mabatiri.','Instalações eléctricas, energia solar e baterias.'], 'Websites and visual identities for your business.': ['Sites web et identités visuelles pour votre entreprise.','Tovuti na utambulisho wa chapa kwa biashara yako.','Basite web mpe bililingi mpo na kompanyi na yo.','Sites e identidades visuais para a sua empresa.'], 'Shared files, backups and recovery for your team.': ['Fichiers partagés, sauvegardes et restauration pour votre équipe.','Faili za pamoja, nakala rudufu na urejeshaji kwa timu yako.','Bafichier ya ekipa, bakopi mpe bozongisi ya ba données.','Ficheiros partilhados, cópias de segurança e recuperação para a sua equipa.'],
};
const Context = createContext({ code: 'en' as Code, change: (_: Code) => {}, t: (s: string) => s, ui: <T,>(s: T): T => s });
export const useLanguage = () => useContext(Context);
export function LanguageProvider({children}: {children: ReactNode}) {
  const [code, setCode] = useState<Code>(() => {
    const explicit = localeFromPath(location.pathname);
    if (explicit) return explicit;
    try {
      const saved = localStorage.getItem('gigi-language') as Code;
      if (codes.includes(saved) && saved !== 'en') {
        history.replaceState(history.state, '', localPath(saved,location.pathname)+location.search+location.hash);
        return saved;
      }
    } catch { /* storage optional */ }
    return 'en';
  });
  useEffect(() => {
    const update = () => setCode(localeFromPath(location.pathname) ?? 'en');
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  useEffect(() => { document.documentElement.lang = localeTag(code); try { localStorage.setItem('gigi-language', code); } catch { /* storage optional */ } }, [code]);
  function change(next: Code) {
    if (next === code) return;
    history.replaceState(history.state, '', localPath(next,location.pathname)+location.search+location.hash);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setCode(next);
  }
  function t(s: string) {
    if (code === 'en') return s;
    const translation = messages[s]?.[reviewedLocales.indexOf(code)] ?? catalog[s]?.[code];
    if (translation) return translation;
    if (import.meta.env.DEV) throw new Error(`Missing ${code} copy: ${s}`);
    return s;
  }
  function ui<T>(value:T):T { return (typeof value === 'string' && (Object.hasOwn(catalog,value) || Object.hasOwn(messages,value)) ? t(value) : value) as T; }
  return <Context.Provider value={{code, change, t, ui}}>{children}</Context.Provider>;
}
export function LanguageSelect() {
  const {code,change} = useLanguage();
  return <label className="gc-language"><span aria-hidden="true">{code.toUpperCase()}</span><select aria-label={code === 'zu' ? 'Ulimi' : code === 'af' ? 'Taal' : 'Language / Langue / Língua'} value={code} onChange={e=>change(e.target.value as Code)}>{codes.map(c=><option lang={localeTag(c)} key={c} value={c}>{locales[c].label}</option>)}</select></label>;
}
