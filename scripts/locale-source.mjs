import ts from 'typescript';
import { readFileSync } from 'node:fs';

export const localeSources = ['src/main.tsx', 'src/HeroMedia.tsx', 'src/data.ts', 'src/seo.ts'];
const visualAttributes = new Set(['alt', 'title', 'placeholder', 'aria-label']);
const invariants = /^(?:GIGI Cloud Solutions|WhatsApp|DM Sans|Wi-Fi|CCTV|[\d\s]+)$/;
const internal = new Set(['GIGI Cloud Solutions website', 'New project enquiry from the GIGI Cloud Solutions website']);
const excluded = /^(?:IntersectionObserver|URLSearchParams|Enter|Tab|Escape|HEAD|GET|POST|GIGI|EN|FR|SW|LN|PT|ArrowUpRight|React|Manrope|Organization|PostalAddress|ZA|English|Roboto|[A-Z][A-Za-z]*[A-Z][A-Za-z]*)$/;
const clean = text => text.split(/\r?\n/).map((line, i, lines) => {
  line = line.replace(/\t/g, ' ');
  if (i) line = line.trimStart();
  if (i < lines.length-1) line = line.trimEnd();
  return line;
}).filter(line=>line.trim()).join(' ');
const prose = s => /^[\p{Lu}]/u.test(s) && /[\p{Ll}]/u.test(s) && !s.includes('@') && !internal.has(s) && !/^(?:Error:|Replace |Generated |Unauthorised)/.test(s) && !excluded.test(s) && !invariants.test(s);

function sourceFile(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}

export function listMessages() {
  const messages = new Set();
  for (const file of localeSources) {
    const source = sourceFile(file, readFileSync(file, 'utf8'));
    const visit = node => {
      if (ts.isJsxText(node)) {
        const value = clean(node.getText(source)).trim();
        if (/\p{L}/u.test(value) && !invariants.test(value)) messages.add(value);
      }
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !ts.isImportDeclaration(node.parent) && !ts.isLiteralTypeNode(node.parent)) {
        const value = node.text;
        const attr = ts.isJsxAttribute(node.parent) && visualAttributes.has(node.parent.name.getText(source));
        if ((attr || prose(value)) && /\p{L}/u.test(value) && !invariants.test(value)) messages.add(value);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return [...messages].sort();
}

// Localize text at its render boundary. IDs, link targets, React keys and form values
// remain stable, even when a visitor switches languages mid-enquiry.
export function localizeJsx(file, text) {
  const source = sourceFile(file, text);
  const edits = [];
  const scopes = new Set();
  function replace(node, value) { edits.push([node.getStart(source),node.end,value]); }
  function visit(node, scope) {
    if (ts.isFunctionDeclaration(node) && node.parent === source) scope = node;
    if (scope?.body && ts.isJsxText(node)) {
      const original = clean(node.getText(source));
      const value = original.trim();
      if (/\p{L}/u.test(value) && !invariants.test(value)) {
        scopes.add(scope);
        const replacement = `{${original.startsWith(' ') ? '" " + ' : ''}__text(${JSON.stringify(value)})${original.endsWith(' ') ? ' + " "' : ''}}`;
        edits.push([node.pos,node.end,replacement]);
      }
    } else if (scope?.body && ts.isJsxAttribute(node) && visualAttributes.has(node.name.getText(source)) && node.initializer) {
      const init = node.initializer;
      if (ts.isStringLiteral(init) && !invariants.test(init.text)) {
        scopes.add(scope); replace(init, `{__text(${JSON.stringify(init.text)})}`);
      } else if (ts.isJsxExpression(init) && init.expression) {
        scopes.add(scope); replace(init.expression, `__ui(${init.expression.getText(source)})`);
      }
      return;
    } else if (scope?.body && ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent)) {
      const expr = node.expression;
      if (ts.isIdentifier(expr) || ts.isPropertyAccessExpression(expr) || ts.isTemplateExpression(expr) || ts.isStringLiteral(expr) || ts.isElementAccessExpression(expr)) {
        scopes.add(scope); replace(expr, `__ui(${expr.getText(source)})`);
        return;
      }
    }
    ts.forEachChild(node, child=>visit(child,scope));
  }
  visit(source);
  for (const scope of scopes) edits.push([scope.body.getStart(source)+1, scope.body.getStart(source)+1, '\nconst { ui: __ui, t: __text } = __useGigiLanguage();\n']);
  for (const [start,end,value] of edits.sort((a,b)=>b[0]-a[0])) text=text.slice(0,start)+value+text.slice(end);
  return scopes.size ? `import {useLanguage as __useGigiLanguage} from './language';\n${text}` : text;
}
