/**
 * Applies the saved theme before the first paint so there is no flash of the
 * wrong theme. The site is dark-first: without a saved choice, dark is used.
 *
 * The script is a constant string (no user input), so it is safe to inline.
 */
const THEME_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");d.dataset.theme=t==="light"?"light":"dark"}catch(e){d.dataset.theme="dark"}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
