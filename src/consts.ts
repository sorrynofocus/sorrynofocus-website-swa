// =============================================================================
//  STRING TABLE: every piece of visible text on the site lives here.
//  Names are prefixed by where they appear: home_, about_, blog_, notfound_.
//  Edit a value, save, and the page updates (while `npm run dev` is running).
//  Keep the quotes. To use an apostrophe inside 'single quotes', write \' or
//  switch that string to "double quotes".
// =============================================================================

// ---------- Site-wide ----------
export const SITE_TITLE = 'SorryNoFocus'; // top-left brand, browser tab, footer
export const SITE_TAGLINE = 'proving myself to being myself'; // small line above the home headline
export const SITE_DESCRIPTION = // search results + link previews
  'A minimal blog about systems development, cloud and whatever I am building next.';
export const AUTHOR = 'Chris Winters'; // About page heading, footer copyright

// Top menu. `href` is the page URL.
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Blog' },
  { href: '/about/', label: 'About' },
];

// ---------- Home page (src/pages/index.astro): home_ ----------
export const home_headline = 'System over Syntax.';
export const home_subtitle = 'Frameworks come and go. Good system design is the part that people remember.';
export const home_buttonLabel = 'cat /var/log/blog';
export const home_buttonHref = '/blog/';
export const home_latestHeading = 'Latest posts';
export const home_viewAllLabel = 'View all';
export const home_latestCount = 3; // how many recent posts to show

// ---------- About page (src/pages/about.astro): about_ ----------
export const about_pageTitle = 'About'; // browser tab + small label above your name
export const about_intro = 'Writing about what I build, break and learn.'; // line under your name
export const about_resumeJumpLabel = 'Work History'; // "Work History ↓" link in the header

export const about_backgroundHeading = 'Background.exe';
// One string per paragraph. Add or remove lines freely.
export const about_background = [
  'ai enthusiast - i particularly enjoy AI development',
  'weathered',
  'ex-Broadcom/Symantec - I spent nearly 20 years at Symantec/Broadcom. Learned alot, made awesome friends.',
  `I tend to favor long tenure at a place where I work. I believe in loyalty.`,
  'Invisible War - a siFi dystopian adventure/action novel I authored a long time ago (my 1st).',
  `Working in TV/Film in my past life`,
  `I've worked in a Nuclear Power facility before`,

];

export const about_currentlyHeading = 'Currently...';
// One string per bullet point.
export const about_currently = [
  'Learning web development with Astro and React',
  'Reading list: Data Structures and Algorithms in Python (Micheal T. Goodrich), Learning LangChain Building AI and LLM Applications with LangChain and LangGraph (Mayo Oshin/Nuno Campos), Modern C++ From Zero to Professional (Ayman Alheraki)',
  'Getting comfortable with GitLab',
  'Playing Halo Infinite',
  'Youtube videos on various life hacks/current events or non-influencing engineers ',
];

// Resume section header. The resume body itself is in src/data/resume.md
export const about_resumeLabel = 'Work History';
export const about_resumeUpdatedPrefix = 'Updated';
export const about_resumeHeading = 'Experience & skills';
export const about_resumePdfLabel = 'Download PDF';
export const about_backToTopLabel = 'Back to top'; // link under the resume

// ---------- Blog (list, tag pages, posts, post cards): blog_ ----------
export const blog_pageTitle = 'Blog';
export const blog_pageDescription = 'All posts, newest first.';
export const blog_postCountSingular = 'post'; // "1 post"
export const blog_postCountPlural = 'posts'; // "5 posts"
export const blog_backToAll = 'All posts'; // link at the top of posts and tag pages
export const blog_tagPageLabel = 'Tagged'; // small label on /tags/<tag>/
export const blog_tagPageTitlePrefix = 'Tagged:'; // browser tab on tag pages
export const blog_readMore = 'Read'; // on each post card
export const blog_updatedPrefix = 'Updated'; // "Updated Oct 05, 2026" on posts
export const blog_draftLabel = 'Draft'; // shown on drafts in dev mode

// ---------- 404 page (src/pages/404.astro): notfound_ ----------
export const notfound_pageTitle = 'Lost in space';
export const notfound_label = 'Error 404';
export const notfound_heading = 'Lost in space';
export const notfound_message = 'This page drifted out of orbit, or never existed.';
export const notfound_buttonLabel = 'Return home';

// ---------- Footer ----------
export const FOOTER_LINKS = [
  { href: '/blog/', label: 'Blog' },
  { href: '/about/', label: 'About' },
];

// Social icons in the footer. Order here = order on the page.
// `icon` must be one of the names in src/components/icons.ts.
// To remove one, delete its line. To add one, add an icon to icons.ts first.
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/christopherwinters/' },
  { label: 'GitHub', icon: 'github', href: 'https://github.com/sorrynofocus' },
  { label: 'GitLab', icon: 'gitlab', href: 'https://gitlab.com/sorrynofocus' },
  { label: 'X', icon: 'x', href: 'https://x.com/sorrynofocus' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/sorrynofocus' },
  {
    label: 'Microsoft Learn',
    icon: 'microsoft',
    href: 'https://learn.microsoft.com/en-us/users/chriswinters-5466/',
  },
] as const;

// ---------- Screen-reader labels (not visible, read aloud by assistive tech) ----------
export const A11Y = {
  menuButton: 'Menu',
  scrollCue: 'Scroll to content',
};
