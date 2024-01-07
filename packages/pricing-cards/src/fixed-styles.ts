/* eslint-disable max-len */

export const fixedStyles = `
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\\
  !*** css ../../node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[11].oneOf[12].use[2]!../../node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[11].oneOf[12].use[3]!./src/styles/globals.css ***!
  \\****************************************************************************************************************************************************************************************************************************************************************************/
/*
! tailwindcss v3.3.2 | MIT License | https://tailwindcss.com
*//*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
*/

html {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font family by default.
2. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden] {
  display: none;
}
  #dealo-root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --ring: 215 20.2% 65.1%;

    --radius: 0.5rem;
  }

  #dealo-root.dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 85.7% 97.3%;

    --ring: 217.2 32.6% 17.5%;
  }
  * {
  border-color: hsl(var(--border));
}
  body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}
.\\!container {
  width: 100% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  padding-right: 2rem !important;
  padding-left: 2rem !important;
}
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 2rem;
  padding-left: 2rem;
}
@media (min-width: 1400px) {

  .\\!container {
    max-width: 1400px !important;
  }

  .container {
    max-width: 1400px;
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.pointer-events-auto {
  pointer-events: auto;
}
.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
.collapse {
  visibility: collapse;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.sticky {
  position: sticky;
}
.inset-0 {
  inset: 0px;
}
.bottom-0 {
  bottom: 0px;
}
.left-2 {
  left: 0.5rem;
}
.left-4 {
  left: 1rem;
}
.left-\\[50\\%\\] {
  left: 50%;
}
.right-0 {
  right: 0px;
}
.right-1 {
  right: 0.25rem;
}
.right-2 {
  right: 0.5rem;
}
.right-4 {
  right: 1rem;
}
.top-0 {
  top: 0px;
}
.top-1 {
  top: 0.25rem;
}
.top-2 {
  top: 0.5rem;
}
.top-4 {
  top: 1rem;
}
.top-\\[50\\%\\] {
  top: 50%;
}
.top-auto {
  top: auto;
}
.z-10 {
  z-index: 10;
}
.z-50 {
  z-index: 50;
}
.z-\\[100\\] {
  z-index: 100;
}
.order-1 {
  order: 1;
}
.order-2 {
  order: 2;
}
.order-3 {
  order: 3;
}
.order-4 {
  order: 4;
}
.order-5 {
  order: 5;
}
.order-6 {
  order: 6;
}
.order-7 {
  order: 7;
}
.order-8 {
  order: 8;
}
.m-0 {
  margin: 0px;
}
.m-1 {
  margin: 0.25rem;
}
.m-auto {
  margin: auto;
}
.-mx-1 {
  margin-left: -0.25rem;
  margin-right: -0.25rem;
}
.mx-0 {
  margin-left: 0px;
  margin-right: 0px;
}
.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-0 {
  margin-top: 0px;
  margin-bottom: 0px;
}
.my-1 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.my-\\[26px\\] {
  margin-top: 26px;
  margin-bottom: 26px;
}
.my-\\[40px\\] {
  margin-top: 40px;
  margin-bottom: 40px;
}
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
.mb-0 {
  margin-bottom: 0px;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-12 {
  margin-bottom: 3rem;
}
.mb-16 {
  margin-bottom: 4rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-24 {
  margin-bottom: 6rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-5 {
  margin-bottom: 1.25rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.mb-\\[-8px\\] {
  margin-bottom: -8px;
}
.mb-\\[20px\\] {
  margin-bottom: 20px;
}
.mb-\\[86px\\] {
  margin-bottom: 86px;
}
.ml-12 {
  margin-left: 3rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.ml-4 {
  margin-left: 1rem;
}
.ml-8 {
  margin-left: 2rem;
}
.ml-9 {
  margin-left: 2.25rem;
}
.ml-auto {
  margin-left: auto;
}
.mr-16 {
  margin-right: 4rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.mr-4 {
  margin-right: 1rem;
}
.mr-\\[1px\\] {
  margin-right: 1px;
}
.mr-auto {
  margin-right: auto;
}
.mt-0 {
  margin-top: 0px;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-16 {
  margin-top: 4rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-20 {
  margin-top: 5rem;
}
.mt-24 {
  margin-top: 6rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mt-\\[-12px\\] {
  margin-top: -12px;
}
.mt-\\[-18px\\] {
  margin-top: -18px;
}
.mt-\\[-8px\\] {
  margin-top: -8px;
}
.mt-\\[120px\\] {
  margin-top: 120px;
}
.mt-\\[20px\\] {
  margin-top: 20px;
}
.mt-\\[48px\\] {
  margin-top: 48px;
}
.mt-\\[64px\\] {
  margin-top: 64px;
}
.mt-auto {
  margin-top: auto;
}
.box-border {
  box-sizing: border-box;
}
.\\!block {
  display: block !important;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.\\!table {
  display: table !important;
}
.table {
  display: table;
}
.\\!grid {
  display: grid !important;
}
.grid {
  display: grid;
}
.contents {
  display: contents;
}
.list-item {
  display: list-item;
}
.hidden {
  display: none;
}
.aspect-square {
  aspect-ratio: 1 / 1;
}
.h-10 {
  height: 2.5rem;
}
.h-11 {
  height: 2.75rem;
}
.h-12 {
  height: 3rem;
}
.h-16 {
  height: 4rem;
}
.h-2 {
  height: 0.5rem;
}
.h-2\\.5 {
  height: 0.625rem;
}
.h-20 {
  height: 5rem;
}
.h-3 {
  height: 0.75rem;
}
.h-3\\.5 {
  height: 0.875rem;
}
.h-4 {
  height: 1rem;
}
.h-5 {
  height: 1.25rem;
}
.h-7 {
  height: 1.75rem;
}
.h-8 {
  height: 2rem;
}
.h-9 {
  height: 2.25rem;
}
.h-\\[100vh\\] {
  height: 100vh;
}
.h-\\[1px\\] {
  height: 1px;
}
.h-\\[260px\\] {
  height: 260px;
}
.h-\\[32px\\] {
  height: 32px;
}
.h-\\[36px\\] {
  height: 36px;
}
.h-\\[38px\\] {
  height: 38px;
}
.h-\\[40px\\] {
  height: 40px;
}
.h-\\[42px\\] {
  height: 42px;
}
.h-\\[49px\\] {
  height: 49px;
}
.h-\\[600px\\] {
  height: 600px;
}
.h-\\[calc\\(100vh-64px\\)\\] {
  height: calc(100vh - 64px);
}
.h-\\[var\\(--radix-select-trigger-height\\)\\] {
  height: var(--radix-select-trigger-height);
}
.h-auto {
  height: auto;
}
.h-full {
  height: 100%;
}
.h-px {
  height: 1px;
}
.max-h-\\[300px\\] {
  max-height: 300px;
}
.max-h-screen {
  max-height: 100vh;
}
.min-h-\\[1px\\] {
  min-height: 1px;
}
.min-h-\\[220px\\] {
  min-height: 220px;
}
.min-h-\\[80px\\] {
  min-height: 80px;
}
.min-h-\\[calc\\(100vh-170px\\)\\] {
  min-height: calc(100vh - 170px);
}
.min-h-screen {
  min-height: 100vh;
}
.w-10 {
  width: 2.5rem;
}
.w-16 {
  width: 4rem;
}
.w-2 {
  width: 0.5rem;
}
.w-2\\.5 {
  width: 0.625rem;
}
.w-20 {
  width: 5rem;
}
.w-3 {
  width: 0.75rem;
}
.w-3\\.5 {
  width: 0.875rem;
}
.w-4 {
  width: 1rem;
}
.w-4\\/5 {
  width: 80%;
}
.w-5 {
  width: 1.25rem;
}
.w-64 {
  width: 16rem;
}
.w-7 {
  width: 1.75rem;
}
.w-72 {
  width: 18rem;
}
.w-8 {
  width: 2rem;
}
.w-\\[120px\\] {
  width: 120px;
}
.w-\\[1px\\] {
  width: 1px;
}
.w-\\[200px\\] {
  width: 200px;
}
.w-\\[220px\\] {
  width: 220px;
}
.w-\\[280px\\] {
  width: 280px;
}
.w-\\[300px\\] {
  width: 300px;
}
.w-\\[320px\\] {
  width: 320px;
}
.w-\\[32px\\] {
  width: 32px;
}
.w-\\[330px\\] {
  width: 330px;
}
.w-\\[360px\\] {
  width: 360px;
}
.w-\\[36px\\] {
  width: 36px;
}
.w-\\[380px\\] {
  width: 380px;
}
.w-\\[465px\\] {
  width: 465px;
}
.w-\\[480px\\] {
  width: 480px;
}
.w-\\[64px\\] {
  width: 64px;
}
.w-\\[80px\\] {
  width: 80px;
}
.w-full {
  width: 100%;
}
.min-w-\\[8rem\\] {
  min-width: 8rem;
}
.min-w-\\[90\\%\\] {
  min-width: 90%;
}
.min-w-\\[var\\(--radix-select-trigger-width\\)\\] {
  min-width: var(--radix-select-trigger-width);
}
.max-w-2xl {
  max-width: 42rem;
}
.max-w-\\[1000px\\] {
  max-width: 1000px;
}
.max-w-\\[1200px\\] {
  max-width: 1200px;
}
.max-w-\\[30rem\\] {
  max-width: 30rem;
}
.max-w-\\[360px\\] {
  max-width: 360px;
}
.max-w-\\[380px\\] {
  max-width: 380px;
}
.max-w-\\[600px\\] {
  max-width: 600px;
}
.max-w-\\[700px\\] {
  max-width: 700px;
}
.max-w-\\[800px\\] {
  max-width: 800px;
}
.max-w-\\[980px\\] {
  max-width: 980px;
}
.max-w-lg {
  max-width: 32rem;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink {
  flex-shrink: 1;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.shrink {
  flex-shrink: 1;
}
.shrink-0 {
  flex-shrink: 0;
}
.flex-grow {
  flex-grow: 1;
}
.grow {
  flex-grow: 1;
}
.table-fixed {
  table-layout: fixed;
}
.caption-bottom {
  caption-side: bottom;
}
.border-collapse {
  border-collapse: collapse;
}
.origin-top-left {
  transform-origin: top left;
}
.origin-top-right {
  transform-origin: top right;
}
.translate-x-\\[-50\\%\\] {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-y-\\[-50\\%\\] {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-\\[-90deg\\] {
  --tw-rotate: -90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-\\[90deg\\] {
  --tw-rotate: 90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.cursor-default {
  cursor: default;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-pointer {
  cursor: pointer;
}
.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize {
  resize: both;
}
.list-disc {
  list-style-type: disc;
}
.list-none {
  list-style-type: none;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-col-reverse {
  flex-direction: column-reverse;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-nowrap {
  flex-wrap: nowrap;
}
.items-start {
  align-items: flex-start;
}
.items-end {
  align-items: flex-end;
}
.items-center {
  align-items: center;
}
.items-stretch {
  align-items: stretch;
}
.justify-start {
  justify-content: flex-start;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.justify-items-center {
  justify-items: center;
}
.gap-0 {
  gap: 0px;
}
.gap-0\\.5 {
  gap: 0.125rem;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}
.gap-\\[72px\\] {
  gap: 72px;
}
.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1.5rem * var(--tw-space-x-reverse));
  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(2rem * var(--tw-space-x-reverse));
  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-y-auto {
  overflow-y: auto;
}
.overflow-x-hidden {
  overflow-x: hidden;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-break-spaces {
  white-space: break-spaces;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-\\[4px\\] {
  border-radius: 4px;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: var(--radius);
}
.rounded-md {
  border-radius: calc(var(--radius) - 2px);
}
.rounded-none {
  border-radius: 0px;
}
.rounded-sm {
  border-radius: calc(var(--radius) - 4px);
}
.rounded-l-none {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.rounded-r-none {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.rounded-bl-\\[3px\\] {
  border-bottom-left-radius: 3px;
}
.rounded-bl-sm {
  border-bottom-left-radius: calc(var(--radius) - 4px);
}
.rounded-br-\\[3px\\] {
  border-bottom-right-radius: 3px;
}
.rounded-br-sm {
  border-bottom-right-radius: calc(var(--radius) - 4px);
}
.rounded-tl-none {
  border-top-left-radius: 0px;
}
.rounded-tl-sm {
  border-top-left-radius: calc(var(--radius) - 4px);
}
.rounded-tr-none {
  border-top-right-radius: 0px;
}
.rounded-tr-sm {
  border-top-right-radius: calc(var(--radius) - 4px);
}
.border {
  border-width: 1px;
}
.border-0 {
  border-width: 0px;
}
.border-2 {
  border-width: 2px;
}
.border-4 {
  border-width: 4px;
}
.border-8 {
  border-width: 8px;
}
.border-x {
  border-left-width: 1px;
  border-right-width: 1px;
}
.border-y-0 {
  border-top-width: 0px;
  border-bottom-width: 0px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-l-0 {
  border-left-width: 0px;
}
.border-r-0 {
  border-right-width: 0px;
}
.border-t {
  border-top-width: 1px;
}
.border-solid {
  border-style: solid;
}
.border-dashed {
  border-style: dashed;
}
.border-none {
  border-style: none;
}
.border-\\[\\#12b886\\] {
  --tw-border-opacity: 1;
  border-color: rgb(18 184 134 / var(--tw-border-opacity));
}
.border-\\[\\#eaeaea\\] {
  --tw-border-opacity: 1;
  border-color: rgb(234 234 234 / var(--tw-border-opacity));
}
.border-amber-400 {
  --tw-border-opacity: 1;
  border-color: rgb(251 191 36 / var(--tw-border-opacity));
}
.border-amber-600 {
  --tw-border-opacity: 1;
  border-color: rgb(217 119 6 / var(--tw-border-opacity));
}
.border-blue-400 {
  --tw-border-opacity: 1;
  border-color: rgb(96 165 250 / var(--tw-border-opacity));
}
.border-blue-600 {
  --tw-border-opacity: 1;
  border-color: rgb(37 99 235 / var(--tw-border-opacity));
}
.border-cyan-400 {
  --tw-border-opacity: 1;
  border-color: rgb(34 211 238 / var(--tw-border-opacity));
}
.border-cyan-600 {
  --tw-border-opacity: 1;
  border-color: rgb(8 145 178 / var(--tw-border-opacity));
}
.border-destructive {
  border-color: hsl(var(--destructive));
}
.border-destructive\\/50 {
  border-color: hsl(var(--destructive) / 0.5);
}
.border-emerald-400 {
  --tw-border-opacity: 1;
  border-color: rgb(52 211 153 / var(--tw-border-opacity));
}
.border-emerald-600 {
  --tw-border-opacity: 1;
  border-color: rgb(5 150 105 / var(--tw-border-opacity));
}
.border-fuchsia-400 {
  --tw-border-opacity: 1;
  border-color: rgb(232 121 249 / var(--tw-border-opacity));
}
.border-fuchsia-600 {
  --tw-border-opacity: 1;
  border-color: rgb(192 38 211 / var(--tw-border-opacity));
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity));
}
.border-green-400 {
  --tw-border-opacity: 1;
  border-color: rgb(74 222 128 / var(--tw-border-opacity));
}
.border-green-600 {
  --tw-border-opacity: 1;
  border-color: rgb(22 163 74 / var(--tw-border-opacity));
}
.border-indigo-400 {
  --tw-border-opacity: 1;
  border-color: rgb(129 140 248 / var(--tw-border-opacity));
}
.border-indigo-600 {
  --tw-border-opacity: 1;
  border-color: rgb(79 70 229 / var(--tw-border-opacity));
}
.border-input {
  border-color: hsl(var(--input));
}
.border-lime-400 {
  --tw-border-opacity: 1;
  border-color: rgb(163 230 53 / var(--tw-border-opacity));
}
.border-lime-600 {
  --tw-border-opacity: 1;
  border-color: rgb(101 163 13 / var(--tw-border-opacity));
}
.border-muted {
  border-color: hsl(var(--muted));
}
.border-neutral-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 229 229 / var(--tw-border-opacity));
}
.border-neutral-300 {
  --tw-border-opacity: 1;
  border-color: rgb(212 212 212 / var(--tw-border-opacity));
}
.border-orange-400 {
  --tw-border-opacity: 1;
  border-color: rgb(251 146 60 / var(--tw-border-opacity));
}
.border-orange-600 {
  --tw-border-opacity: 1;
  border-color: rgb(234 88 12 / var(--tw-border-opacity));
}
.border-pink-400 {
  --tw-border-opacity: 1;
  border-color: rgb(244 114 182 / var(--tw-border-opacity));
}
.border-pink-600 {
  --tw-border-opacity: 1;
  border-color: rgb(219 39 119 / var(--tw-border-opacity));
}
.border-primary {
  border-color: hsl(var(--primary));
}
.border-purple-400 {
  --tw-border-opacity: 1;
  border-color: rgb(192 132 252 / var(--tw-border-opacity));
}
.border-purple-600 {
  --tw-border-opacity: 1;
  border-color: rgb(147 51 234 / var(--tw-border-opacity));
}
.border-red-400 {
  --tw-border-opacity: 1;
  border-color: rgb(248 113 113 / var(--tw-border-opacity));
}
.border-red-600 {
  --tw-border-opacity: 1;
  border-color: rgb(220 38 38 / var(--tw-border-opacity));
}
.border-rose-400 {
  --tw-border-opacity: 1;
  border-color: rgb(251 113 133 / var(--tw-border-opacity));
}
.border-rose-600 {
  --tw-border-opacity: 1;
  border-color: rgb(225 29 72 / var(--tw-border-opacity));
}
.border-sky-400 {
  --tw-border-opacity: 1;
  border-color: rgb(56 189 248 / var(--tw-border-opacity));
}
.border-sky-600 {
  --tw-border-opacity: 1;
  border-color: rgb(2 132 199 / var(--tw-border-opacity));
}
.border-slate-200 {
  --tw-border-opacity: 1;
  border-color: rgb(226 232 240 / var(--tw-border-opacity));
}
.border-teal-400 {
  --tw-border-opacity: 1;
  border-color: rgb(45 212 191 / var(--tw-border-opacity));
}
.border-teal-600 {
  --tw-border-opacity: 1;
  border-color: rgb(13 148 136 / var(--tw-border-opacity));
}
.border-transparent {
  border-color: transparent;
}
.border-violet-400 {
  --tw-border-opacity: 1;
  border-color: rgb(167 139 250 / var(--tw-border-opacity));
}
.border-violet-600 {
  --tw-border-opacity: 1;
  border-color: rgb(124 58 237 / var(--tw-border-opacity));
}
.border-yellow-400 {
  --tw-border-opacity: 1;
  border-color: rgb(250 204 21 / var(--tw-border-opacity));
}
.border-yellow-600 {
  --tw-border-opacity: 1;
  border-color: rgb(202 138 4 / var(--tw-border-opacity));
}
.border-t-amber-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(245 158 11 / var(--tw-border-opacity));
}
.border-t-blue-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(59 130 246 / var(--tw-border-opacity));
}
.border-t-cyan-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(6 182 212 / var(--tw-border-opacity));
}
.border-t-emerald-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(16 185 129 / var(--tw-border-opacity));
}
.border-t-fuchsia-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(217 70 239 / var(--tw-border-opacity));
}
.border-t-green-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(34 197 94 / var(--tw-border-opacity));
}
.border-t-indigo-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(99 102 241 / var(--tw-border-opacity));
}
.border-t-lime-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(132 204 22 / var(--tw-border-opacity));
}
.border-t-orange-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(249 115 22 / var(--tw-border-opacity));
}
.border-t-pink-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(236 72 153 / var(--tw-border-opacity));
}
.border-t-purple-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(168 85 247 / var(--tw-border-opacity));
}
.border-t-red-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(239 68 68 / var(--tw-border-opacity));
}
.border-t-rose-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(244 63 94 / var(--tw-border-opacity));
}
.border-t-sky-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(14 165 233 / var(--tw-border-opacity));
}
.border-t-slate-950 {
  --tw-border-opacity: 1;
  border-top-color: rgb(2 6 23 / var(--tw-border-opacity));
}
.border-t-teal-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(20 184 166 / var(--tw-border-opacity));
}
.border-t-violet-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(139 92 246 / var(--tw-border-opacity));
}
.border-t-yellow-500 {
  --tw-border-opacity: 1;
  border-top-color: rgb(234 179 8 / var(--tw-border-opacity));
}
.bg-\\[\\#12b886\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(18 184 134 / var(--tw-bg-opacity));
}
.bg-amber-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(253 230 138 / var(--tw-bg-opacity));
}
.bg-amber-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(251 191 36 / var(--tw-bg-opacity));
}
.bg-amber-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity));
}
.bg-amber-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity));
}
.bg-background {
  background-color: hsl(var(--background));
}
.bg-background\\/80 {
  background-color: hsl(var(--background) / 0.8);
}
.bg-blue-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(191 219 254 / var(--tw-bg-opacity));
}
.bg-blue-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(96 165 250 / var(--tw-bg-opacity));
}
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
.bg-border {
  background-color: hsl(var(--border));
}
.bg-cyan-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(165 243 252 / var(--tw-bg-opacity));
}
.bg-cyan-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 211 238 / var(--tw-bg-opacity));
}
.bg-cyan-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(6 182 212 / var(--tw-bg-opacity));
}
.bg-cyan-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(8 145 178 / var(--tw-bg-opacity));
}
.bg-destructive {
  background-color: hsl(var(--destructive));
}
.bg-emerald-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(167 243 208 / var(--tw-bg-opacity));
}
.bg-emerald-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(52 211 153 / var(--tw-bg-opacity));
}
.bg-emerald-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(16 185 129 / var(--tw-bg-opacity));
}
.bg-emerald-500\\/\\[\\.15\\] {
  background-color: rgb(16 185 129 / .15);
}
.bg-emerald-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(5 150 105 / var(--tw-bg-opacity));
}
.bg-fuchsia-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(245 208 254 / var(--tw-bg-opacity));
}
.bg-fuchsia-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(232 121 249 / var(--tw-bg-opacity));
}
.bg-fuchsia-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(217 70 239 / var(--tw-bg-opacity));
}
.bg-fuchsia-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(192 38 211 / var(--tw-bg-opacity));
}
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}
.bg-green-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(187 247 208 / var(--tw-bg-opacity));
}
.bg-green-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(74 222 128 / var(--tw-bg-opacity));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity));
}
.bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
.bg-indigo-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(199 210 254 / var(--tw-bg-opacity));
}
.bg-indigo-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(129 140 248 / var(--tw-bg-opacity));
}
.bg-indigo-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity));
}
.bg-indigo-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}
.bg-lime-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(217 249 157 / var(--tw-bg-opacity));
}
.bg-lime-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(163 230 53 / var(--tw-bg-opacity));
}
.bg-lime-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(132 204 22 / var(--tw-bg-opacity));
}
.bg-lime-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(101 163 13 / var(--tw-bg-opacity));
}
.bg-muted {
  background-color: hsl(var(--muted));
}
.bg-neutral-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 250 250 / var(--tw-bg-opacity));
}
.bg-orange-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 215 170 / var(--tw-bg-opacity));
}
.bg-orange-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(251 146 60 / var(--tw-bg-opacity));
}
.bg-orange-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity));
}
.bg-orange-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity));
}
.bg-pink-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(251 207 232 / var(--tw-bg-opacity));
}
.bg-pink-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(244 114 182 / var(--tw-bg-opacity));
}
.bg-pink-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(236 72 153 / var(--tw-bg-opacity));
}
.bg-pink-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 39 119 / var(--tw-bg-opacity));
}
.bg-popover {
  background-color: hsl(var(--popover));
}
.bg-primary {
  background-color: hsl(var(--primary));
}
.bg-purple-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(233 213 255 / var(--tw-bg-opacity));
}
.bg-purple-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(192 132 252 / var(--tw-bg-opacity));
}
.bg-purple-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity));
}
.bg-purple-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity));
}
.bg-red-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 202 202 / var(--tw-bg-opacity));
}
.bg-red-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(248 113 113 / var(--tw-bg-opacity));
}
.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}
.bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
.bg-red-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(127 29 29 / var(--tw-bg-opacity));
}
.bg-rose-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 205 211 / var(--tw-bg-opacity));
}
.bg-rose-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(251 113 133 / var(--tw-bg-opacity));
}
.bg-rose-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(244 63 94 / var(--tw-bg-opacity));
}
.bg-rose-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(225 29 72 / var(--tw-bg-opacity));
}
.bg-secondary {
  background-color: hsl(var(--secondary));
}
.bg-sky-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(186 230 253 / var(--tw-bg-opacity));
}
.bg-sky-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(56 189 248 / var(--tw-bg-opacity));
}
.bg-sky-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(14 165 233 / var(--tw-bg-opacity));
}
.bg-sky-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}
.bg-slate-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(241 245 249 / var(--tw-bg-opacity));
}
.bg-slate-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(226 232 240 / var(--tw-bg-opacity));
}
.bg-slate-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(203 213 225 / var(--tw-bg-opacity));
}
.bg-slate-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(248 250 252 / var(--tw-bg-opacity));
}
.bg-slate-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(100 116 139 / var(--tw-bg-opacity));
}
.bg-teal-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(153 246 228 / var(--tw-bg-opacity));
}
.bg-teal-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(45 212 191 / var(--tw-bg-opacity));
}
.bg-teal-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(20 184 166 / var(--tw-bg-opacity));
}
.bg-teal-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(13 148 136 / var(--tw-bg-opacity));
}
.bg-transparent {
  background-color: transparent;
}
.bg-violet-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(221 214 254 / var(--tw-bg-opacity));
}
.bg-violet-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(167 139 250 / var(--tw-bg-opacity));
}
.bg-violet-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(139 92 246 / var(--tw-bg-opacity));
}
.bg-violet-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(124 58 237 / var(--tw-bg-opacity));
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}
.bg-yellow-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 240 138 / var(--tw-bg-opacity));
}
.bg-yellow-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 204 21 / var(--tw-bg-opacity));
}
.bg-yellow-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity));
}
.bg-yellow-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
.fill-amber-500 {
  fill: #f59e0b;
}
.fill-blue-500 {
  fill: #3b82f6;
}
.fill-current {
  fill: currentColor;
}
.fill-cyan-500 {
  fill: #06b6d4;
}
.fill-emerald-500 {
  fill: #10b981;
}
.fill-fuchsia-500 {
  fill: #d946ef;
}
.fill-green-500 {
  fill: #22c55e;
}
.fill-indigo-500 {
  fill: #6366f1;
}
.fill-lime-500 {
  fill: #84cc16;
}
.fill-orange-500 {
  fill: #f97316;
}
.fill-pink-500 {
  fill: #ec4899;
}
.fill-purple-500 {
  fill: #a855f7;
}
.fill-red-500 {
  fill: #ef4444;
}
.fill-rose-500 {
  fill: #f43f5e;
}
.fill-sky-500 {
  fill: #0ea5e9;
}
.fill-teal-500 {
  fill: #14b8a6;
}
.fill-violet-500 {
  fill: #8b5cf6;
}
.fill-white {
  fill: #fff;
}
.fill-yellow-500 {
  fill: #eab308;
}
.stroke-emerald-500 {
  stroke: #10b981;
}
.stroke-slate-50 {
  stroke: #f8fafc;
}
.stroke-slate-500 {
  stroke: #64748b;
}
.p-0 {
  padding: 0px;
}
.p-1 {
  padding: 0.25rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-8 {
  padding: 2rem;
}
.p-\\[20px\\] {
  padding: 20px;
}
.p-\\[86px\\] {
  padding: 86px;
}
.px-0 {
  padding-left: 0px;
  padding-right: 0px;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-12 {
  padding-left: 3rem;
  padding-right: 3rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}
.px-\\[0\\.3rem\\] {
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
.px-\\[20px\\] {
  padding-left: 20px;
  padding-right: 20px;
}
.py-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}
.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-24 {
  padding-top: 6rem;
  padding-bottom: 6rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.py-\\[0\\.2rem\\] {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}
.py-\\[10px\\] {
  padding-top: 10px;
  padding-bottom: 10px;
}
.pb-10 {
  padding-bottom: 2.5rem;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.pb-4 {
  padding-bottom: 1rem;
}
.pb-6 {
  padding-bottom: 1.5rem;
}
.pb-8 {
  padding-bottom: 2rem;
}
.pb-9 {
  padding-bottom: 2.25rem;
}
.pl-1 {
  padding-left: 0.25rem;
}
.pl-2 {
  padding-left: 0.5rem;
}
.pl-4 {
  padding-left: 1rem;
}
.pl-8 {
  padding-left: 2rem;
}
.pl-9 {
  padding-left: 2.25rem;
}
.pr-0 {
  padding-right: 0px;
}
.pr-2 {
  padding-right: 0.5rem;
}
.pr-8 {
  padding-right: 2rem;
}
.pt-0 {
  padding-top: 0px;
}
.pt-16 {
  padding-top: 4rem;
}
.pt-2 {
  padding-top: 0.5rem;
}
.pt-4 {
  padding-top: 1rem;
}
.pt-5 {
  padding-top: 1.25rem;
}
.pt-6 {
  padding-top: 1.5rem;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.align-top {
  vertical-align: top;
}
.align-middle {
  vertical-align: middle;
}
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.font-sans {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.text-\\[12px\\] {
  font-size: 12px;
}
.text-\\[14px\\] {
  font-size: 14px;
}
.text-\\[18px\\] {
  font-size: 18px;
}
.text-\\[24px\\] {
  font-size: 24px;
}
.text-\\[32px\\] {
  font-size: 32px;
}
.text-\\[40px\\] {
  font-size: 40px;
}
.text-\\[48px\\] {
  font-size: 48px;
}
.text-\\[64px\\] {
  font-size: 64px;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-black {
  font-weight: 900;
}
.font-bold {
  font-weight: 700;
}
.font-light {
  font-weight: 300;
}
.font-medium {
  font-weight: 500;
}
.font-normal {
  font-weight: 400;
}
.font-semibold {
  font-weight: 600;
}
.uppercase {
  text-transform: uppercase;
}
.lowercase {
  text-transform: lowercase;
}
.capitalize {
  text-transform: capitalize;
}
.italic {
  font-style: italic;
}
.ordinal {
  --tw-ordinal: ordinal;
  font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction);
}
.leading-\\[1\\.2\\] {
  line-height: 1.2;
}
.leading-\\[24px\\] {
  line-height: 24px;
}
.leading-none {
  line-height: 1;
}
.leading-relaxed {
  line-height: 1.625;
}
.leading-tight {
  line-height: 1.25;
}
.tracking-tight {
  letter-spacing: -0.025em;
}
.tracking-widest {
  letter-spacing: 0.1em;
}
.text-\\[\\#12b886\\] {
  --tw-text-opacity: 1;
  color: rgb(18 184 134 / var(--tw-text-opacity));
}
.text-\\[\\#666666\\] {
  --tw-text-opacity: 1;
  color: rgb(102 102 102 / var(--tw-text-opacity));
}
.text-amber-600 {
  --tw-text-opacity: 1;
  color: rgb(217 119 6 / var(--tw-text-opacity));
}
.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}
.text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity));
}
.text-current {
  color: currentColor;
}
.text-cyan-600 {
  --tw-text-opacity: 1;
  color: rgb(8 145 178 / var(--tw-text-opacity));
}
.text-destructive {
  color: hsl(var(--destructive));
}
.text-destructive-foreground {
  color: hsl(var(--destructive-foreground));
}
.text-emerald-500 {
  --tw-text-opacity: 1;
  color: rgb(16 185 129 / var(--tw-text-opacity));
}
.text-emerald-600 {
  --tw-text-opacity: 1;
  color: rgb(5 150 105 / var(--tw-text-opacity));
}
.text-foreground {
  color: hsl(var(--foreground));
}
.text-foreground\\/50 {
  color: hsl(var(--foreground) / 0.5);
}
.text-fuchsia-600 {
  --tw-text-opacity: 1;
  color: rgb(192 38 211 / var(--tw-text-opacity));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity));
}
.text-indigo-600 {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity));
}
.text-lime-600 {
  --tw-text-opacity: 1;
  color: rgb(101 163 13 / var(--tw-text-opacity));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.text-neutral-500 {
  --tw-text-opacity: 1;
  color: rgb(115 115 115 / var(--tw-text-opacity));
}
.text-orange-600 {
  --tw-text-opacity: 1;
  color: rgb(234 88 12 / var(--tw-text-opacity));
}
.text-pink-600 {
  --tw-text-opacity: 1;
  color: rgb(219 39 119 / var(--tw-text-opacity));
}
.text-popover-foreground {
  color: hsl(var(--popover-foreground));
}
.text-primary {
  color: hsl(var(--primary));
}
.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}
.text-purple-600 {
  --tw-text-opacity: 1;
  color: rgb(147 51 234 / var(--tw-text-opacity));
}
.text-red-300 {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity));
}
.text-rose-600 {
  --tw-text-opacity: 1;
  color: rgb(225 29 72 / var(--tw-text-opacity));
}
.text-secondary-foreground {
  color: hsl(var(--secondary-foreground));
}
.text-sky-600 {
  --tw-text-opacity: 1;
  color: rgb(2 132 199 / var(--tw-text-opacity));
}
.text-slate-500 {
  --tw-text-opacity: 1;
  color: rgb(100 116 139 / var(--tw-text-opacity));
}
.text-slate-600 {
  --tw-text-opacity: 1;
  color: rgb(71 85 105 / var(--tw-text-opacity));
}
.text-teal-600 {
  --tw-text-opacity: 1;
  color: rgb(13 148 136 / var(--tw-text-opacity));
}
.text-violet-600 {
  --tw-text-opacity: 1;
  color: rgb(124 58 237 / var(--tw-text-opacity));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
.text-yellow-600 {
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity));
}
.underline {
  text-decoration-line: underline;
}
.line-through {
  text-decoration-line: line-through;
}
.underline-offset-4 {
  text-underline-offset: 4px;
}
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-60 {
  opacity: 0.6;
}
.opacity-70 {
  opacity: 0.7;
}
.opacity-90 {
  opacity: 0.9;
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline {
  outline-style: solid;
}
.ring-offset-background {
  --tw-ring-offset-color: hsl(var(--background));
}
.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.invert {
  --tw-invert: invert(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-filter {
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
@keyframes enter {

  from {
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}
@keyframes exit {

  to {
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
  }
}
.animate-in {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.fade-in {
  --tw-enter-opacity: 0;
}
.fade-in-0 {
  --tw-enter-opacity: 0;
}
.fade-in-90 {
  --tw-enter-opacity: 0.9;
}
.zoom-in-90 {
  --tw-enter-scale: .9;
}
.zoom-in-95 {
  --tw-enter-scale: .95;
}
.slide-in-from-bottom-0 {
  --tw-enter-translate-y: 0px;
}
.slide-in-from-bottom-10 {
  --tw-enter-translate-y: 2.5rem;
}
.slide-in-from-left-1 {
  --tw-enter-translate-x: -0.25rem;
}
.slide-out-to-left-1 {
  --tw-exit-translate-x: -0.25rem;
}
.duration-200 {
  animation-duration: 200ms;
}
.running {
  animation-play-state: running;
}
.paused {
  animation-play-state: paused;
}
.\\[a-zA-Z0-9\\:\\\\\\\\-\\\\\\\\\\._\\$\\] {
  a-z-a--z0-9: \\\\-\\\\. $;
}


.lds-ring div {
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-left-color: transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.file\\:border-0::file-selector-button {
  border-width: 0px;
}
.file\\:bg-transparent::file-selector-button {
  background-color: transparent;
}
.file\\:text-sm::file-selector-button {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.file\\:font-medium::file-selector-button {
  font-weight: 500;
}
.placeholder\\:text-muted-foreground::-moz-placeholder {
  color: hsl(var(--muted-foreground));
}
.placeholder\\:text-muted-foreground::placeholder {
  color: hsl(var(--muted-foreground));
}
.first\\:rounded-t-sm:first-child {
  border-top-left-radius: calc(var(--radius) - 4px);
  border-top-right-radius: calc(var(--radius) - 4px);
}
.first\\:border-t:first-child {
  border-top-width: 1px;
}
.last\\:rounded-b-sm:last-child {
  border-bottom-right-radius: calc(var(--radius) - 4px);
  border-bottom-left-radius: calc(var(--radius) - 4px);
}
.hover\\:border-amber-600\\/90:hover {
  border-color: rgb(217 119 6 / 0.9);
}
.hover\\:border-blue-600\\/90:hover {
  border-color: rgb(37 99 235 / 0.9);
}
.hover\\:border-cyan-600\\/90:hover {
  border-color: rgb(8 145 178 / 0.9);
}
.hover\\:border-emerald-600\\/90:hover {
  border-color: rgb(5 150 105 / 0.9);
}
.hover\\:border-fuchsia-600\\/90:hover {
  border-color: rgb(192 38 211 / 0.9);
}
.hover\\:border-green-600\\/90:hover {
  border-color: rgb(22 163 74 / 0.9);
}
.hover\\:border-indigo-600\\/90:hover {
  border-color: rgb(79 70 229 / 0.9);
}
.hover\\:border-lime-600\\/90:hover {
  border-color: rgb(101 163 13 / 0.9);
}
.hover\\:border-orange-600\\/90:hover {
  border-color: rgb(234 88 12 / 0.9);
}
.hover\\:border-pink-600\\/90:hover {
  border-color: rgb(219 39 119 / 0.9);
}
.hover\\:border-purple-600\\/90:hover {
  border-color: rgb(147 51 234 / 0.9);
}
.hover\\:border-red-600\\/90:hover {
  border-color: rgb(220 38 38 / 0.9);
}
.hover\\:border-rose-600\\/90:hover {
  border-color: rgb(225 29 72 / 0.9);
}
.hover\\:border-sky-600\\/90:hover {
  border-color: rgb(2 132 199 / 0.9);
}
.hover\\:border-teal-600\\/90:hover {
  border-color: rgb(13 148 136 / 0.9);
}
.hover\\:border-violet-600\\/90:hover {
  border-color: rgb(124 58 237 / 0.9);
}
.hover\\:border-yellow-600\\/90:hover {
  border-color: rgb(202 138 4 / 0.9);
}
.hover\\:bg-accent:hover {
  background-color: hsl(var(--accent));
}
.hover\\:bg-amber-600\\/5:hover {
  background-color: rgb(217 119 6 / 0.05);
}
.hover\\:bg-amber-600\\/90:hover {
  background-color: rgb(217 119 6 / 0.9);
}
.hover\\:bg-amber-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(180 83 9 / var(--tw-bg-opacity));
}
.hover\\:bg-blue-600\\/5:hover {
  background-color: rgb(37 99 235 / 0.05);
}
.hover\\:bg-blue-600\\/90:hover {
  background-color: rgb(37 99 235 / 0.9);
}
.hover\\:bg-blue-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity));
}
.hover\\:bg-cyan-600\\/5:hover {
  background-color: rgb(8 145 178 / 0.05);
}
.hover\\:bg-cyan-600\\/90:hover {
  background-color: rgb(8 145 178 / 0.9);
}
.hover\\:bg-cyan-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(14 116 144 / var(--tw-bg-opacity));
}
.hover\\:bg-destructive\\/80:hover {
  background-color: hsl(var(--destructive) / 0.8);
}
.hover\\:bg-emerald-600\\/5:hover {
  background-color: rgb(5 150 105 / 0.05);
}
.hover\\:bg-emerald-600\\/80:hover {
  background-color: rgb(5 150 105 / 0.8);
}
.hover\\:bg-emerald-600\\/90:hover {
  background-color: rgb(5 150 105 / 0.9);
}
.hover\\:bg-emerald-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(4 120 87 / var(--tw-bg-opacity));
}
.hover\\:bg-fuchsia-600\\/5:hover {
  background-color: rgb(192 38 211 / 0.05);
}
.hover\\:bg-fuchsia-600\\/90:hover {
  background-color: rgb(192 38 211 / 0.9);
}
.hover\\:bg-fuchsia-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(162 28 175 / var(--tw-bg-opacity));
}
.hover\\:bg-green-600\\/5:hover {
  background-color: rgb(22 163 74 / 0.05);
}
.hover\\:bg-green-600\\/90:hover {
  background-color: rgb(22 163 74 / 0.9);
}
.hover\\:bg-green-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity));
}
.hover\\:bg-indigo-600\\/5:hover {
  background-color: rgb(79 70 229 / 0.05);
}
.hover\\:bg-indigo-600\\/90:hover {
  background-color: rgb(79 70 229 / 0.9);
}
.hover\\:bg-indigo-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(67 56 202 / var(--tw-bg-opacity));
}
.hover\\:bg-lime-600\\/5:hover {
  background-color: rgb(101 163 13 / 0.05);
}
.hover\\:bg-lime-600\\/90:hover {
  background-color: rgb(101 163 13 / 0.9);
}
.hover\\:bg-lime-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(77 124 15 / var(--tw-bg-opacity));
}
.hover\\:bg-muted\\/50:hover {
  background-color: hsl(var(--muted) / 0.5);
}
.hover\\:bg-neutral-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}
.hover\\:bg-orange-600\\/5:hover {
  background-color: rgb(234 88 12 / 0.05);
}
.hover\\:bg-orange-600\\/90:hover {
  background-color: rgb(234 88 12 / 0.9);
}
.hover\\:bg-orange-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(194 65 12 / var(--tw-bg-opacity));
}
.hover\\:bg-pink-600\\/5:hover {
  background-color: rgb(219 39 119 / 0.05);
}
.hover\\:bg-pink-600\\/90:hover {
  background-color: rgb(219 39 119 / 0.9);
}
.hover\\:bg-pink-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(190 24 93 / var(--tw-bg-opacity));
}
.hover\\:bg-primary\\/80:hover {
  background-color: hsl(var(--primary) / 0.8);
}
.hover\\:bg-primary\\/90:hover {
  background-color: hsl(var(--primary) / 0.9);
}
.hover\\:bg-purple-600\\/5:hover {
  background-color: rgb(147 51 234 / 0.05);
}
.hover\\:bg-purple-600\\/90:hover {
  background-color: rgb(147 51 234 / 0.9);
}
.hover\\:bg-purple-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(126 34 206 / var(--tw-bg-opacity));
}
.hover\\:bg-red-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity));
}
.hover\\:bg-red-600\\/5:hover {
  background-color: rgb(220 38 38 / 0.05);
}
.hover\\:bg-red-600\\/90:hover {
  background-color: rgb(220 38 38 / 0.9);
}
.hover\\:bg-red-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity));
}
.hover\\:bg-rose-600\\/5:hover {
  background-color: rgb(225 29 72 / 0.05);
}
.hover\\:bg-rose-600\\/90:hover {
  background-color: rgb(225 29 72 / 0.9);
}
.hover\\:bg-rose-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(190 18 60 / var(--tw-bg-opacity));
}
.hover\\:bg-secondary:hover {
  background-color: hsl(var(--secondary));
}
.hover\\:bg-secondary\\/80:hover {
  background-color: hsl(var(--secondary) / 0.8);
}
.hover\\:bg-sky-600\\/5:hover {
  background-color: rgb(2 132 199 / 0.05);
}
.hover\\:bg-sky-600\\/90:hover {
  background-color: rgb(2 132 199 / 0.9);
}
.hover\\:bg-sky-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(3 105 161 / var(--tw-bg-opacity));
}
.hover\\:bg-slate-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(241 245 249 / var(--tw-bg-opacity));
}
.hover\\:bg-teal-600\\/5:hover {
  background-color: rgb(13 148 136 / 0.05);
}
.hover\\:bg-teal-600\\/90:hover {
  background-color: rgb(13 148 136 / 0.9);
}
.hover\\:bg-teal-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(15 118 110 / var(--tw-bg-opacity));
}
.hover\\:bg-violet-600\\/5:hover {
  background-color: rgb(124 58 237 / 0.05);
}
.hover\\:bg-violet-600\\/90:hover {
  background-color: rgb(124 58 237 / 0.9);
}
.hover\\:bg-violet-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(109 40 217 / var(--tw-bg-opacity));
}
.hover\\:bg-yellow-600\\/5:hover {
  background-color: rgb(202 138 4 / 0.05);
}
.hover\\:bg-yellow-600\\/90:hover {
  background-color: rgb(202 138 4 / 0.9);
}
.hover\\:bg-yellow-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(161 98 7 / var(--tw-bg-opacity));
}
.hover\\:text-accent-foreground:hover {
  color: hsl(var(--accent-foreground));
}
.hover\\:text-foreground:hover {
  color: hsl(var(--foreground));
}
.hover\\:text-red-600\\/90:hover {
  color: rgb(220 38 38 / 0.9);
}
.hover\\:underline:hover {
  text-decoration-line: underline;
}
.hover\\:opacity-100:hover {
  opacity: 1;
}
.hover\\:opacity-80:hover {
  opacity: 0.8;
}
.focus\\:bg-accent:focus {
  background-color: hsl(var(--accent));
}
.focus\\:bg-red-50:focus {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity));
}
.focus\\:text-accent-foreground:focus {
  color: hsl(var(--accent-foreground));
}
.focus\\:text-red-600:focus {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity));
}
.focus\\:opacity-100:focus {
  opacity: 1;
}
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-ring:focus {
  --tw-ring-color: hsl(var(--ring));
}
.focus\\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}
.focus-visible\\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-visible\\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus-visible\\:ring-ring:focus-visible {
  --tw-ring-color: hsl(var(--ring));
}
.focus-visible\\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}
.disabled\\:pointer-events-none:disabled {
  pointer-events: none;
}
.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}
.group:hover .group-hover\\:visible {
  visibility: visible;
}
.group:hover .group-hover\\:bg-slate-500\\/10 {
  background-color: rgb(100 116 139 / 0.1);
}
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}
.group.destructive .group-\\[\\.destructive\\]\\:border-muted\\/40 {
  border-color: hsl(var(--muted) / 0.4);
}
.group.destructive .group-\\[\\.destructive\\]\\:text-red-300 {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity));
}
.group.destructive .group-\\[\\.destructive\\]\\:hover\\:border-destructive\\/30:hover {
  border-color: hsl(var(--destructive) / 0.3);
}
.group.destructive .group-\\[\\.destructive\\]\\:hover\\:bg-destructive:hover {
  background-color: hsl(var(--destructive));
}
.group.destructive .group-\\[\\.destructive\\]\\:hover\\:text-destructive-foreground:hover {
  color: hsl(var(--destructive-foreground));
}
.group.destructive .group-\\[\\.destructive\\]\\:hover\\:text-red-50:hover {
  --tw-text-opacity: 1;
  color: rgb(254 242 242 / var(--tw-text-opacity));
}
.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-destructive:focus {
  --tw-ring-color: hsl(var(--destructive));
}
.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-red-400:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(248 113 113 / var(--tw-ring-opacity));
}
.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-offset-red-600:focus {
  --tw-ring-offset-color: #dc2626;
}
.peer:disabled ~ .peer-disabled\\:cursor-not-allowed {
  cursor: not-allowed;
}
.peer:disabled ~ .peer-disabled\\:opacity-70 {
  opacity: 0.7;
}
.aria-selected\\:bg-accent[aria-selected="true"] {
  background-color: hsl(var(--accent));
}
.aria-selected\\:text-accent-foreground[aria-selected="true"] {
  color: hsl(var(--accent-foreground));
}
.data-\\[disabled\\]\\:pointer-events-none[data-disabled] {
  pointer-events: none;
}
.data-\\[spaced\\=true\\]\\:mb-4[data-spaced=true] {
  margin-bottom: 1rem;
}
.data-\\[mobile\\=true\\]\\:w-full[data-mobile=true] {
  width: 100%;
}
.data-\\[wide\\=true\\]\\:w-auto[data-wide=true] {
  width: auto;
}
.data-\\[side\\=bottom\\]\\:translate-y-1[data-side=bottom] {
  --tw-translate-y: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=left\\]\\:-translate-x-1[data-side=left] {
  --tw-translate-x: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=right\\]\\:translate-x-1[data-side=right] {
  --tw-translate-x: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=top\\]\\:-translate-y-1[data-side=top] {
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[swipe\\=cancel\\]\\:translate-x-0[data-swipe=cancel] {
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[swipe\\=end\\]\\:translate-x-\\[var\\(--radix-toast-swipe-end-x\\)\\][data-swipe=end] {
  --tw-translate-x: var(--radix-toast-swipe-end-x);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[swipe\\=move\\]\\:translate-x-\\[var\\(--radix-toast-swipe-move-x\\)\\][data-swipe=move] {
  --tw-translate-x: var(--radix-toast-swipe-move-x);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes accordion-up {

  from {
    height: var(--radix-accordion-content-height);
  }

  to {
    height: 0;
  }
}
.data-\\[state\\=closed\\]\\:animate-accordion-up[data-state=closed] {
  animation: accordion-up 0.2s ease-out;
}
@keyframes accordion-down {

  from {
    height: 0;
  }

  to {
    height: var(--radix-accordion-content-height);
  }
}
.data-\\[state\\=open\\]\\:animate-accordion-down[data-state=open] {
  animation: accordion-down 0.2s ease-out;
}
.data-\\[selected\\=true\\]\\:border[data-selected=true] {
  border-width: 1px;
}
.data-\\[active\\=true\\]\\:border-amber-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(245 158 11 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-blue-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-cyan-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(6 182 212 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-emerald-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(16 185 129 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-fuchsia-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(217 70 239 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-green-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(34 197 94 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-indigo-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-lime-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(132 204 22 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-orange-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(249 115 22 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-pink-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(236 72 153 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-purple-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(168 85 247 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-red-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-rose-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(244 63 94 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-sky-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(14 165 233 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-teal-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(20 184 166 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-violet-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(139 92 246 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:border-yellow-500[data-active=true] {
  --tw-border-opacity: 1;
  border-color: rgb(234 179 8 / var(--tw-border-opacity));
}
.data-\\[selected\\=true\\]\\:border-emerald-500[data-selected=true] {
  --tw-border-opacity: 1;
  border-color: rgb(16 185 129 / var(--tw-border-opacity));
}
.data-\\[active\\=true\\]\\:bg-amber-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-blue-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-cyan-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(8 145 178 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-emerald-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(5 150 105 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-fuchsia-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(192 38 211 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-green-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-indigo-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-lime-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(101 163 13 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-orange-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-pink-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(219 39 119 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-purple-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-red-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-rose-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(225 29 72 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-sky-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-teal-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(13 148 136 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-violet-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(124 58 237 / var(--tw-bg-opacity));
}
.data-\\[active\\=true\\]\\:bg-yellow-600[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-amber-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-blue-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-cyan-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(8 145 178 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-emerald-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(5 150 105 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-fuchsia-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(192 38 211 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-green-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-indigo-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-lime-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(101 163 13 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-orange-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-pink-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(219 39 119 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-purple-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-red-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-rose-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(225 29 72 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-sky-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-teal-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(13 148 136 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-violet-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(124 58 237 / var(--tw-bg-opacity));
}
.data-\\[selected\\=true\\]\\:bg-yellow-600[data-selected=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
.data-\\[state\\=active\\]\\:bg-slate-800[data-state=active] {
  --tw-bg-opacity: 1;
  background-color: rgb(30 41 59 / var(--tw-bg-opacity));
}
.data-\\[state\\=checked\\]\\:bg-primary[data-state=checked] {
  background-color: hsl(var(--primary));
}
.data-\\[state\\=closed\\]\\:bg-slate-50[data-state=closed] {
  --tw-bg-opacity: 1;
  background-color: rgb(248 250 252 / var(--tw-bg-opacity));
}
.data-\\[state\\=open\\]\\:bg-accent[data-state=open] {
  background-color: hsl(var(--accent));
}
.data-\\[state\\=selected\\]\\:bg-muted[data-state=selected] {
  background-color: hsl(var(--muted));
}
.data-\\[mobile\\=true\\]\\:px-4[data-mobile=true] {
  padding-left: 1rem;
  padding-right: 1rem;
}
.data-\\[active\\=false\\]\\:text-neutral-400[data-active=false] {
  --tw-text-opacity: 1;
  color: rgb(163 163 163 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-amber-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(245 158 11 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-blue-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-cyan-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(6 182 212 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-emerald-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(16 185 129 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-fuchsia-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(217 70 239 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-green-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-indigo-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-lime-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(132 204 22 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-orange-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(249 115 22 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-pink-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(236 72 153 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-purple-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(168 85 247 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-red-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-rose-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(244 63 94 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-sky-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(14 165 233 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-teal-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(20 184 166 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-violet-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(139 92 246 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-white[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
.data-\\[active\\=true\\]\\:text-yellow-500[data-active=true] {
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-amber-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(245 158 11 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-blue-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-cyan-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(6 182 212 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-emerald-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(16 185 129 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-fuchsia-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(217 70 239 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-green-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-indigo-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-lime-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(132 204 22 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-orange-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(249 115 22 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-pink-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(236 72 153 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-purple-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(168 85 247 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-red-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-rose-600[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(225 29 72 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-sky-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(14 165 233 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-teal-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(20 184 166 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-violet-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(139 92 246 / var(--tw-text-opacity));
}
.data-\\[recommended\\=true\\]\\:text-yellow-500[data-recommended=true] {
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity));
}
.data-\\[selected\\=true\\]\\:text-white[data-selected=true] {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
.data-\\[state\\=active\\]\\:text-white[data-state=active] {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
.data-\\[state\\=checked\\]\\:text-primary-foreground[data-state=checked] {
  color: hsl(var(--primary-foreground));
}
.data-\\[state\\=open\\]\\:text-muted-foreground[data-state=open] {
  color: hsl(var(--muted-foreground));
}
.data-\\[disabled\\]\\:opacity-50[data-disabled] {
  opacity: 0.5;
}
.data-\\[state\\=active\\]\\:shadow-sm[data-state=active] {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.data-\\[swipe\\=move\\]\\:transition-none[data-swipe=move] {
  transition-property: none;
}
.data-\\[state\\=open\\]\\:animate-in[data-state=open] {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:animate-out[data-state=closed] {
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}
.data-\\[swipe\\=end\\]\\:animate-out[data-swipe=end] {
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:fade-out-0[data-state=closed] {
  --tw-exit-opacity: 0;
}
.data-\\[state\\=closed\\]\\:fade-out-80[data-state=closed] {
  --tw-exit-opacity: 0.8;
}
.data-\\[state\\=open\\]\\:fade-in-0[data-state=open] {
  --tw-enter-opacity: 0;
}
.data-\\[state\\=closed\\]\\:zoom-out-95[data-state=closed] {
  --tw-exit-scale: .95;
}
.data-\\[state\\=open\\]\\:zoom-in-95[data-state=open] {
  --tw-enter-scale: .95;
}
.data-\\[side\\=bottom\\]\\:slide-in-from-top-1[data-side=bottom] {
  --tw-enter-translate-y: -0.25rem;
}
.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side=bottom] {
  --tw-enter-translate-y: -0.5rem;
}
.data-\\[side\\=left\\]\\:slide-in-from-right-1[data-side=left] {
  --tw-enter-translate-x: 0.25rem;
}
.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side=left] {
  --tw-enter-translate-x: 0.5rem;
}
.data-\\[side\\=right\\]\\:slide-in-from-left-1[data-side=right] {
  --tw-enter-translate-x: -0.25rem;
}
.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side=right] {
  --tw-enter-translate-x: -0.5rem;
}
.data-\\[side\\=top\\]\\:slide-in-from-bottom-1[data-side=top] {
  --tw-enter-translate-y: 0.25rem;
}
.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side=top] {
  --tw-enter-translate-y: 0.5rem;
}
.data-\\[state\\=closed\\]\\:slide-out-to-left-1\\/2[data-state=closed] {
  --tw-exit-translate-x: -50%;
}
.data-\\[state\\=closed\\]\\:slide-out-to-right-full[data-state=closed] {
  --tw-exit-translate-x: 100%;
}
.data-\\[state\\=closed\\]\\:slide-out-to-top-\\[48\\%\\][data-state=closed] {
  --tw-exit-translate-y: -48%;
}
.data-\\[state\\=open\\]\\:slide-in-from-left-1\\/2[data-state=open] {
  --tw-enter-translate-x: -50%;
}
.data-\\[state\\=open\\]\\:slide-in-from-top-\\[48\\%\\][data-state=open] {
  --tw-enter-translate-y: -48%;
}
.data-\\[state\\=open\\]\\:slide-in-from-top-full[data-state=open] {
  --tw-enter-translate-y: -100%;
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-amber-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-blue-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-cyan-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(6 182 212 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-emerald-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(16 185 129 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-fuchsia-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(217 70 239 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-green-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-indigo-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-lime-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(132 204 22 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-orange-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-pink-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(236 72 153 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-purple-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-red-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-rose-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(244 63 94 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-sky-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(14 165 233 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-teal-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(20 184 166 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-violet-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(139 92 246 / var(--tw-bg-opacity));
}
.group:hover .group-hover\\:data-\\[active\\=true\\]\\:bg-yellow-500[data-active=true] {
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity));
}
.group[data-selected=true] .group-data-\\[selected\\=true\\]\\:visible {
  visibility: visible;
}
:is(.dark .dark\\:border-amber-400) {
  --tw-border-opacity: 1;
  border-color: rgb(251 191 36 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-blue-400) {
  --tw-border-opacity: 1;
  border-color: rgb(96 165 250 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-cyan-400) {
  --tw-border-opacity: 1;
  border-color: rgb(34 211 238 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-emerald-400) {
  --tw-border-opacity: 1;
  border-color: rgb(52 211 153 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-fuchsia-400) {
  --tw-border-opacity: 1;
  border-color: rgb(232 121 249 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-gray-600) {
  --tw-border-opacity: 1;
  border-color: rgb(75 85 99 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-gray-800) {
  --tw-border-opacity: 1;
  border-color: rgb(31 41 55 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-green-400) {
  --tw-border-opacity: 1;
  border-color: rgb(74 222 128 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-indigo-400) {
  --tw-border-opacity: 1;
  border-color: rgb(129 140 248 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-lime-400) {
  --tw-border-opacity: 1;
  border-color: rgb(163 230 53 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-neutral-700) {
  --tw-border-opacity: 1;
  border-color: rgb(64 64 64 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-orange-400) {
  --tw-border-opacity: 1;
  border-color: rgb(251 146 60 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-pink-400) {
  --tw-border-opacity: 1;
  border-color: rgb(244 114 182 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-purple-400) {
  --tw-border-opacity: 1;
  border-color: rgb(192 132 252 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-red-400) {
  --tw-border-opacity: 1;
  border-color: rgb(248 113 113 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-red-500) {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-rose-400) {
  --tw-border-opacity: 1;
  border-color: rgb(251 113 133 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-sky-400) {
  --tw-border-opacity: 1;
  border-color: rgb(56 189 248 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-slate-500) {
  --tw-border-opacity: 1;
  border-color: rgb(100 116 139 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-slate-700) {
  --tw-border-opacity: 1;
  border-color: rgb(51 65 85 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-slate-800) {
  --tw-border-opacity: 1;
  border-color: rgb(30 41 59 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-teal-400) {
  --tw-border-opacity: 1;
  border-color: rgb(45 212 191 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-violet-400) {
  --tw-border-opacity: 1;
  border-color: rgb(167 139 250 / var(--tw-border-opacity));
}
:is(.dark .dark\\:border-yellow-400) {
  --tw-border-opacity: 1;
  border-color: rgb(250 204 21 / var(--tw-border-opacity));
}
:is(.dark .dark\\:bg-amber-500) {
  --tw-bg-opacity: 1;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-amber-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-blue-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-cyan-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(8 145 178 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-emerald-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(5 150 105 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-fuchsia-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(192 38 211 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-gray-900) {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-gray-950) {
  --tw-bg-opacity: 1;
  background-color: rgb(3 7 18 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-green-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-indigo-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-lime-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(101 163 13 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-orange-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-pink-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(219 39 119 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-purple-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-red-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-rose-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(225 29 72 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-sky-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-slate-800) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 41 59 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-slate-900) {
  --tw-bg-opacity: 1;
  background-color: rgb(15 23 42 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-teal-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(13 148 136 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-violet-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(124 58 237 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:bg-yellow-600) {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:stroke-slate-800) {
  stroke: #1e293b;
}
:is(.dark .dark\\:text-amber-400) {
  --tw-text-opacity: 1;
  color: rgb(251 191 36 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-blue-400) {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-cyan-400) {
  --tw-text-opacity: 1;
  color: rgb(34 211 238 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-emerald-400) {
  --tw-text-opacity: 1;
  color: rgb(52 211 153 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-fuchsia-400) {
  --tw-text-opacity: 1;
  color: rgb(232 121 249 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-green-400) {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-indigo-400) {
  --tw-text-opacity: 1;
  color: rgb(129 140 248 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-lime-400) {
  --tw-text-opacity: 1;
  color: rgb(163 230 53 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-neutral-300) {
  --tw-text-opacity: 1;
  color: rgb(212 212 212 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-orange-400) {
  --tw-text-opacity: 1;
  color: rgb(251 146 60 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-pink-400) {
  --tw-text-opacity: 1;
  color: rgb(244 114 182 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-purple-400) {
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-red-400) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-red-500) {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-rose-400) {
  --tw-text-opacity: 1;
  color: rgb(251 113 133 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-sky-400) {
  --tw-text-opacity: 1;
  color: rgb(56 189 248 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-slate-100) {
  --tw-text-opacity: 1;
  color: rgb(241 245 249 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-slate-200) {
  --tw-text-opacity: 1;
  color: rgb(226 232 240 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-slate-300) {
  --tw-text-opacity: 1;
  color: rgb(203 213 225 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-teal-400) {
  --tw-text-opacity: 1;
  color: rgb(45 212 191 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-violet-400) {
  --tw-text-opacity: 1;
  color: rgb(167 139 250 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-white) {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
:is(.dark .dark\\:text-yellow-400) {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:border-amber-400\\/90:hover) {
  border-color: rgb(251 191 36 / 0.9);
}
:is(.dark .dark\\:hover\\:border-blue-400\\/90:hover) {
  border-color: rgb(96 165 250 / 0.9);
}
:is(.dark .dark\\:hover\\:border-cyan-400\\/90:hover) {
  border-color: rgb(34 211 238 / 0.9);
}
:is(.dark .dark\\:hover\\:border-emerald-400\\/90:hover) {
  border-color: rgb(52 211 153 / 0.9);
}
:is(.dark .dark\\:hover\\:border-fuchsia-400\\/90:hover) {
  border-color: rgb(232 121 249 / 0.9);
}
:is(.dark .dark\\:hover\\:border-green-400\\/90:hover) {
  border-color: rgb(74 222 128 / 0.9);
}
:is(.dark .dark\\:hover\\:border-indigo-400\\/90:hover) {
  border-color: rgb(129 140 248 / 0.9);
}
:is(.dark .dark\\:hover\\:border-lime-400\\/90:hover) {
  border-color: rgb(163 230 53 / 0.9);
}
:is(.dark .dark\\:hover\\:border-orange-400\\/90:hover) {
  border-color: rgb(251 146 60 / 0.9);
}
:is(.dark .dark\\:hover\\:border-pink-400\\/90:hover) {
  border-color: rgb(244 114 182 / 0.9);
}
:is(.dark .dark\\:hover\\:border-purple-400\\/90:hover) {
  border-color: rgb(192 132 252 / 0.9);
}
:is(.dark .dark\\:hover\\:border-red-400\\/90:hover) {
  border-color: rgb(248 113 113 / 0.9);
}
:is(.dark .dark\\:hover\\:border-rose-400\\/90:hover) {
  border-color: rgb(251 113 133 / 0.9);
}
:is(.dark .dark\\:hover\\:border-sky-400\\/90:hover) {
  border-color: rgb(56 189 248 / 0.9);
}
:is(.dark .dark\\:hover\\:border-teal-400\\/90:hover) {
  border-color: rgb(45 212 191 / 0.9);
}
:is(.dark .dark\\:hover\\:border-violet-400\\/90:hover) {
  border-color: rgb(167 139 250 / 0.9);
}
:is(.dark .dark\\:hover\\:border-yellow-400\\/90:hover) {
  border-color: rgb(250 204 21 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-amber-400\\/5:hover) {
  background-color: rgb(251 191 36 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-amber-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-amber-600\\/90:hover) {
  background-color: rgb(217 119 6 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-blue-400\\/5:hover) {
  background-color: rgb(96 165 250 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-blue-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-blue-600\\/90:hover) {
  background-color: rgb(37 99 235 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-cyan-400\\/5:hover) {
  background-color: rgb(34 211 238 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-cyan-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(6 182 212 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-cyan-600\\/90:hover) {
  background-color: rgb(8 145 178 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-emerald-400\\/5:hover) {
  background-color: rgb(52 211 153 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-emerald-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(16 185 129 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-emerald-600\\/90:hover) {
  background-color: rgb(5 150 105 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-fuchsia-400\\/5:hover) {
  background-color: rgb(232 121 249 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-fuchsia-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(217 70 239 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-fuchsia-600\\/90:hover) {
  background-color: rgb(192 38 211 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-green-400\\/5:hover) {
  background-color: rgb(74 222 128 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-green-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-green-600\\/90:hover) {
  background-color: rgb(22 163 74 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-indigo-400\\/5:hover) {
  background-color: rgb(129 140 248 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-indigo-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-indigo-600\\/90:hover) {
  background-color: rgb(79 70 229 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-lime-400\\/5:hover) {
  background-color: rgb(163 230 53 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-lime-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(132 204 22 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-lime-600\\/90:hover) {
  background-color: rgb(101 163 13 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-orange-400\\/5:hover) {
  background-color: rgb(251 146 60 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-orange-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-orange-600\\/90:hover) {
  background-color: rgb(234 88 12 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-pink-400\\/5:hover) {
  background-color: rgb(244 114 182 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-pink-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(236 72 153 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-pink-600\\/90:hover) {
  background-color: rgb(219 39 119 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-purple-400\\/5:hover) {
  background-color: rgb(192 132 252 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-purple-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-purple-600\\/90:hover) {
  background-color: rgb(147 51 234 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-red-400\\/5:hover) {
  background-color: rgb(248 113 113 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-red-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-red-600\\/90:hover) {
  background-color: rgb(220 38 38 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-red-900\\/30:hover) {
  background-color: rgb(127 29 29 / 0.3);
}
:is(.dark .dark\\:hover\\:bg-rose-400\\/5:hover) {
  background-color: rgb(251 113 133 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-rose-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(244 63 94 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-rose-600\\/90:hover) {
  background-color: rgb(225 29 72 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-secondary:hover) {
  background-color: hsl(var(--secondary));
}
:is(.dark .dark\\:hover\\:bg-sky-400\\/5:hover) {
  background-color: rgb(56 189 248 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-sky-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(14 165 233 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-sky-600\\/90:hover) {
  background-color: rgb(2 132 199 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-slate-100\\/20:hover) {
  background-color: rgb(241 245 249 / 0.2);
}
:is(.dark .dark\\:hover\\:bg-slate-800:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(30 41 59 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-teal-400\\/5:hover) {
  background-color: rgb(45 212 191 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-teal-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(20 184 166 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-teal-600\\/90:hover) {
  background-color: rgb(13 148 136 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-violet-400\\/5:hover) {
  background-color: rgb(167 139 250 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-violet-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(139 92 246 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-violet-600\\/90:hover) {
  background-color: rgb(124 58 237 / 0.9);
}
:is(.dark .dark\\:hover\\:bg-yellow-400\\/5:hover) {
  background-color: rgb(250 204 21 / 0.05);
}
:is(.dark .dark\\:hover\\:bg-yellow-500:hover) {
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:hover\\:bg-yellow-600\\/90:hover) {
  background-color: rgb(202 138 4 / 0.9);
}
:is(.dark .dark\\:hover\\:text-amber-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(251 191 36 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-blue-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-cyan-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(34 211 238 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-emerald-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(52 211 153 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-fuchsia-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(232 121 249 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-green-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-indigo-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(129 140 248 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-lime-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(163 230 53 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-orange-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(251 146 60 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-pink-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(244 114 182 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-purple-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-red-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-rose-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(251 113 133 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-sky-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(56 189 248 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-teal-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(45 212 191 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-violet-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(167 139 250 / var(--tw-text-opacity));
}
:is(.dark .dark\\:hover\\:text-yellow-400:hover) {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:bg-slate-300\\/10) {
  background-color: rgb(203 213 225 / 0.1);
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-amber-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(245 158 11 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-blue-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-cyan-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(6 182 212 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-emerald-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(16 185 129 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-fuchsia-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(217 70 239 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-green-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(34 197 94 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-indigo-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-lime-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(132 204 22 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-orange-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(249 115 22 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-pink-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(236 72 153 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-purple-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(168 85 247 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-red-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-rose-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(244 63 94 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-sky-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(14 165 233 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-teal-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(20 184 166 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-violet-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(139 92 246 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:border-yellow-500[data-active=true]) {
  --tw-border-opacity: 1;
  border-color: rgb(234 179 8 / var(--tw-border-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-amber-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-blue-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-cyan-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(8 145 178 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-emerald-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(5 150 105 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-fuchsia-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(192 38 211 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-green-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-indigo-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-lime-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(101 163 13 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-orange-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-pink-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(219 39 119 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-purple-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-red-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-rose-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(225 29 72 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-sky-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-teal-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(13 148 136 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-violet-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(124 58 237 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:bg-yellow-600[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-amber-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-blue-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-cyan-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(8 145 178 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-emerald-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(5 150 105 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-fuchsia-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(192 38 211 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-green-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-indigo-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-lime-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(101 163 13 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-orange-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-pink-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(219 39 119 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-purple-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-red-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-rose-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(225 29 72 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-sky-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-teal-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(13 148 136 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-violet-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(124 58 237 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:bg-yellow-600[data-selected=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[state\\=closed\\]\\:bg-transparent[data-state=closed]) {
  background-color: transparent;
}
:is(.dark .dark\\:data-\\[state\\=open\\]\\:bg-slate-900[data-state=open]) {
  --tw-bg-opacity: 1;
  background-color: rgb(15 23 42 / var(--tw-bg-opacity));
}
:is(.dark .dark\\:data-\\[active\\=false\\]\\:text-neutral-400[data-active=false]) {
  --tw-text-opacity: 1;
  color: rgb(163 163 163 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-amber-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(251 191 36 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-blue-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-cyan-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(34 211 238 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-emerald-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(52 211 153 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-fuchsia-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(232 121 249 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-green-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-indigo-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(129 140 248 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-lime-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(163 230 53 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-orange-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(251 146 60 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-pink-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(244 114 182 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-purple-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-red-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-rose-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(251 113 133 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-sky-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(56 189 248 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-teal-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(45 212 191 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-violet-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(167 139 250 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[active\\=true\\]\\:text-yellow-400[data-active=true]) {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity));
}
:is(.dark .dark\\:data-\\[selected\\=true\\]\\:text-white[data-selected=true]) {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-amber-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-blue-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-cyan-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(6 182 212 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-emerald-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(16 185 129 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-fuchsia-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(217 70 239 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-green-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-indigo-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-lime-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(132 204 22 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-orange-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-pink-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(236 72 153 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-purple-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-red-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-rose-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(244 63 94 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-sky-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(14 165 233 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-teal-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(20 184 166 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-violet-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(139 92 246 / var(--tw-bg-opacity));
}
:is(.dark .group:hover .dark\\:group-hover\\:data-\\[active\\=true\\]\\:bg-yellow-500[data-active=true]) {
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity));
}
@media (min-width: 640px) {

  .sm\\:bottom-0 {
    bottom: 0px;
  }

  .sm\\:right-0 {
    right: 0px;
  }

  .sm\\:top-auto {
    top: auto;
  }

  .sm\\:mt-0 {
    margin-top: 0px;
  }

  .sm\\:flex-row {
    flex-direction: row;
  }

  .sm\\:flex-col {
    flex-direction: column;
  }

  .sm\\:items-center {
    align-items: center;
  }

  .sm\\:justify-end {
    justify-content: flex-end;
  }

  .sm\\:space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .sm\\:rounded-lg {
    border-radius: var(--radius);
  }

  .sm\\:text-left {
    text-align: left;
  }

  .sm\\:zoom-in-90 {
    --tw-enter-scale: .9;
  }

  .sm\\:slide-in-from-bottom-0 {
    --tw-enter-translate-y: 0px;
  }

  .data-\\[state\\=open\\]\\:sm\\:slide-in-from-bottom-full[data-state=open] {
    --tw-enter-translate-y: 100%;
  }
}
@media (min-width: 768px) {

  .md\\:mb-0 {
    margin-bottom: 0px;
  }

  .md\\:mb-24 {
    margin-bottom: 6rem;
  }

  .md\\:ml-12 {
    margin-left: 3rem;
  }

  .md\\:mt-0 {
    margin-top: 0px;
  }

  .md\\:grid {
    display: grid;
  }

  .md\\:hidden {
    display: none;
  }

  .md\\:w-full {
    width: 100%;
  }

  .md\\:max-w-\\[420px\\] {
    max-width: 420px;
  }

  .md\\:flex-row {
    flex-direction: row;
  }

  .md\\:items-stretch {
    align-items: stretch;
  }

  .md\\:px-0 {
    padding-left: 0px;
    padding-right: 0px;
  }
}
@media (min-width: 1024px) {

  .lg\\:mb-\\[140px\\] {
    margin-bottom: 140px;
  }

  .lg\\:block {
    display: block;
  }

  .lg\\:flex {
    display: flex;
  }

  .lg\\:space-x-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(2rem * var(--tw-space-x-reverse));
    margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .lg\\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
@media (min-width: 1280px) {

  .xl\\:gap-8 {
    gap: 2rem;
  }
}
.\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:pr-0:has([role=checkbox]) {
  padding-right: 0px;
}
.\\[\\&\\:has\\(svg\\)\\]\\:pl-11:has(svg) {
  padding-left: 2.75rem;
}
.\\[\\&\\>svg\\+div\\]\\:translate-y-\\[-3px\\]>svg+div {
  --tw-translate-y: -3px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.\\[\\&\\>svg\\]\\:absolute>svg {
  position: absolute;
}
.\\[\\&\\>svg\\]\\:left-4>svg {
  left: 1rem;
}
.\\[\\&\\>svg\\]\\:top-4>svg {
  top: 1rem;
}
.\\[\\&\\>svg\\]\\:text-destructive>svg {
  color: hsl(var(--destructive));
}
.\\[\\&\\>svg\\]\\:text-foreground>svg {
  color: hsl(var(--foreground));
}
:is(.dark .dark\\:\\[\\&\\>svg\\]\\:text-red-500>svg) {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
.\\[\\&\\[data-state\\=open\\]\\>svg\\]\\:rotate-180[data-state=open]>svg {
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.\\[\\&_\\[cmdk-group-heading\\]\\]\\:px-2 [cmdk-group-heading] {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.\\[\\&_\\[cmdk-group-heading\\]\\]\\:py-1\\.5 [cmdk-group-heading] {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.\\[\\&_\\[cmdk-group-heading\\]\\]\\:text-xs [cmdk-group-heading] {
  font-size: 0.75rem;
  line-height: 1rem;
}
.\\[\\&_\\[cmdk-group-heading\\]\\]\\:font-medium [cmdk-group-heading] {
  font-weight: 500;
}
.\\[\\&_\\[cmdk-group-heading\\]\\]\\:text-muted-foreground [cmdk-group-heading] {
  color: hsl(var(--muted-foreground));
}
.\\[\\&_\\[cmdk-group\\]\\:not\\(\\[hidden\\]\\)_\\~\\[cmdk-group\\]\\]\\:pt-0 [cmdk-group]:not([hidden]) ~[cmdk-group] {
  padding-top: 0px;
}
.\\[\\&_\\[cmdk-group\\]\\]\\:px-2 [cmdk-group] {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.\\[\\&_\\[cmdk-input-wrapper\\]_svg\\]\\:h-5 [cmdk-input-wrapper] svg {
  height: 1.25rem;
}
.\\[\\&_\\[cmdk-input-wrapper\\]_svg\\]\\:w-5 [cmdk-input-wrapper] svg {
  width: 1.25rem;
}
.\\[\\&_\\[cmdk-input\\]\\]\\:h-12 [cmdk-input] {
  height: 3rem;
}
.\\[\\&_\\[cmdk-item\\]\\]\\:px-2 [cmdk-item] {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.\\[\\&_\\[cmdk-item\\]\\]\\:py-3 [cmdk-item] {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.\\[\\&_\\[cmdk-item\\]_svg\\]\\:h-5 [cmdk-item] svg {
  height: 1.25rem;
}
.\\[\\&_\\[cmdk-item\\]_svg\\]\\:w-5 [cmdk-item] svg {
  width: 1.25rem;
}
.\\[\\&_p\\]\\:leading-relaxed p {
  line-height: 1.625;
}
.\\[\\&_tr\\:last-child\\]\\:border-0 tr:last-child {
  border-width: 0px;
}
.\\[\\&_tr\\]\\:border-b tr {
  border-bottom-width: 1px;
}
`;
