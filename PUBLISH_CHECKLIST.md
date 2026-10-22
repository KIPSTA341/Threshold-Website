# Threshold website: publish checklist

Built 22 October 2026 from the live repository version (`KIPSTA341/Threshold-Website`, commit `e499db3`). Sources: `Threshold_publish_brief_for_Jeshree.md` and the LIFT and BUILD decks. Nothing has been deployed.

Do not upload this checklist to GitHub. It is for review only.

## 1. Changes completed

**Homepage (`index.html`)**
- **Experience behind Threshold:**
  - The heading, introduction and three columns use the brief's wording: programmes and communities, venture and impact practice, technology that serves delivery.
  - Each column shows its people's portraits.
  - A one-line footnote follows the columns, with a "Meet the team" link.
- **What is proven:** the old "Experienced team. Cohort results still to come" section and its three PENDING cards are removed. The compact "Experience behind the work. Evidence from this cohort to follow." strip now sits directly after the sample progression brief.
- **Removed interactions, each replaced with static content:**
  - The drag-and-sort evidence game becomes a fixed pair: *Sends a proposal* → *A customer pays or commits to a defined pilot*.
  - The press-and-hold AI demo and "Run again" become a static flow (trigger → research → draft → review → **Founder approves** → act). The go-to-market, fundraising and operations examples are kept.
  - The "draw the line back" slider becomes static "next yes" steps.
  - The cheque and panel simulation is removed. The "Who holds capital / who verifies / who decides" cards and the three governance commitments are kept.
  - The six venture-model tabs are removed from the homepage. The Standard page already explains them.
- **Kept unchanged:** the hero, LIFT-first call to action, both routes, the gates animation, the Meta Results example, the "Already in use" strip, the sample brief, follow-up and close.
- **Hero text:** the hero headline is now readable as soon as the page loads, with no fade-in delay. The animated hero background is kept.

**Team (`team.html`)**
- **Headings:** the hero now reads "The people behind the programme". The people section is titled "Delivery team and advisors".
- **Delivery team:** Nihal Ahmed, Abhijit Sinha and Akshay Cherian.
- **Advisors:** Iris Lapinski, Patrick Meier, Norm Trainor and Varun Perumal.
- **Each card:** a relationship label beside the name, the brief's biography wording, and the existing LinkedIn links.
- **Three-discipline graphic:** the names are corrected. Abhijit now appears under Program and Venture, Patrick under Venture, and Iris uses her full name.
- **Footnote:** one line under the cards, as the brief specifies. The repeated disclaimer below the graphic is removed.

**LIFT (`lift.html`)**
- **"Why this team":** added just before the Portfolio Progression Preview, with a "Meet the team" link.
- **Selection grid:** the "Show another set of routes" shuffle is removed, and the five illustrative routes are now fixed.
- **Fit and scoring:** the interactive six-criterion scoring grid is replaced by a short Good fit / Not the right fit / How we score list.
- **Kept unchanged:** the programme, baseline, sprints, AI support, evidence standard, preview wording (proposed, bounded, terms agreed after the first call, never called free), €60K fee and FAQ.

**BUILD (`build.html`)**
- **"Who delivers":** it now uses the same heading, introduction and three columns as the homepage. The disclaimer now reads "not BUILD outcomes".
- **Month 3:** the clickable Proceed/Pause control is replaced with a fixed Month 3 decision that states both outcomes.
- **Kept unchanged:** the 12-month structure, decision pack, fees and capital governance.

**Begin (`begin.html`)**
- The optional next-result map builder and its send-the-map email are removed.
- The two prefilled email routes and the direct email address are kept.

**Whole site**
- **Page titles:** now "Threshold | Limitless Institute" on the homepage and "LIFT · Threshold | Limitless Institute" (and the same pattern) on the other pages. The site name for link previews is "Limitless Institute".
- **Removed code:** the scripts and styles for every removed interaction are deleted. Nothing still on the site uses them.
- **Fresh styles on upload:** the stylesheet and script version tag changed to `v=20261022a`, so browsers load the new styling straight away.

**Button label.** "Request a Portfolio Progression Preview" wrapped onto two lines inside the main buttons on phones (390px). The brief says to use the shorter label in that case and to keep one label everywhere. Every button therefore says **"Request a Portfolio Preview"**, and the LIFT offer heading keeps "Portfolio Progression Preview."

## 2. Tests performed

Tests ran in Chromium with the site's real fonts, comparing the live version with this new one.

| Test | Result |
|---|---|
| All 7 pages load directly and after a refresh, with no script errors, missing files or sideways scrolling, at 1440×900, 768×1024, 390×844, 320×640 and 844×390 (phone landscape) — 35 combinations | PASS |
| No broken words, text cut off or text running off-screen at 1440, 1280, 1024, 768, 600, 414, 390, 360 and 320px | PASS |
| Headline and main button readable within 150ms of load, on 6 pages | PASS |
| All 17 internal links and section links resolve | PASS |
| Every LIFT button goes to the LIFT email path and every BUILD button to the BUILD path | PASS |
| LIFT email prefilled with name, organisation, email, portfolio size and constraint; BUILD email prefilled with mission, geography and capital mandate | PASS |
| No form or map builder left on Begin | PASS |
| No removed interaction, empty panel or leftover "drag" or "press" instruction on any page | PASS |
| Mobile menu opens and closes, Escape closes it, keyboard focus moves into and out of it, and its links navigate | PASS |
| Keyboard Tab reaches links and buttons with a visible focus outline (homepage, first 40 stops) | PASS |
| With reduced motion switched on, all content shows immediately | PASS |
| Sections not meant to change have the same layout and text as live: Standard (all sections), BUILD hero, gap, decision pack, selection, pathway, pricing, FAQ and close, LIFT problem, decision vignette and AI section, homepage route cards, gates strip, manifesto and gates animation | PASS |
| Portraits load, are not stretched, and are sharp on high-resolution (2×) screens | FAIL, Varun only (see section 3) |
| Real phone (iOS Safari or Android Chrome) | NEEDS HUMAN CHECK |
| The live Wix page loading the new version | NEEDS HUMAN CHECK after upload |

## 3. Portrait status

| Person | Status |
|---|---|
| **Iris Lapinski** | PASS. Taken from the LIFT deck's Leadership + Advisors slide. That slide shows two women, and the caption doesn't say which is Iris. I matched this photo to the portrait captioned "Iris Lapinski, Apps for Good" on her Business of Software speaker page: same glasses, hair and scarf. Square crop, 368×368px, native resolution, nothing enlarged. |
| **Patrick Meier** | PASS. Taken from the same slide. It also shows two unnamed men, so I matched this one to the portrait labelled "Patrick Meier, Director Sustainable Ventures" on the beVisioneers team page (bevisioneers.world/about): flat cap and round glasses. 480×480px, reduced from an 800px original. |
| Nihal, Abhijit, Akshay, Norm | PASS. Existing portraits unchanged, 420–480px. |
| **Varun Perumal** | FAIL, existing photo kept. The best available version is 144px; the deck copy is 200px but more loosely framed. On high-resolution laptops his Team card (shown about 115px wide) can look slightly soft. **A higher-resolution photo of him is needed.** Save it square, at least 480px, as `team-varun-perumal.jpg`. |
| Two other people on the deck slide | Not used. A younger woman (programme column) and a man in a suit (venture column) are pictured but not named on the slide. Neither is identified, so neither is shown. |

## 4. Desktop, tablet and mobile

- **Desktop 1440 / tablet 768 / mobile 390 / narrow 320 / phone landscape 844×390:** PASS in browser tests (section 2). Cards and team columns stack to one column on phones. Portraits are round and undistorted at every width.
- **Real phone:** NEEDS HUMAN CHECK. I have no physical device. Open the four main pages on an iPhone and an Android phone before announcing.

## 5. Owner confirmations needed (not verified by me)

1. **The four reach claims, as the brief requires:** five continents (Nihal and Limitless), six countries (Abhijit), 1,000 schools (Iris), 40+ countries (Patrick). If an owner declines, remove the number but keep the description of the work.
2. **Patrick Meier's listing:** the 18 October brief left Patrick off the site because of an employment concern. The new brief puts him back as an advisor naming beVisioneers. Confirm that he and beVisioneers are comfortable with this.
3. **Labels and wording:** each advisor's label and biography, and each delivery-team member's role label, should be confirmed by the person.
4. **Varun's profile link:** still left out until he confirms it.
5. **Previously approved content:** the Meta Results "$3m in reported client savings" example (confirmed by Akshay) and the "Already in use" Fast Track strip are kept as approved.

## 6. Genuine remaining blockers

- **Varun's photo:** only a low-resolution photo exists (section 3). Not a launch blocker, but it is the one image below the quality bar.
- **Wix browser-tab title:** inside Wix the tab title is controlled by Wix and currently reads "Threshold | RUBOT". Change it in Wix (Page SEO title, or the site name) if wanted. The site's own titles are already correct.
- **Wix links:** if the site later moves off Wix, links that point to the old Wix page at `/threshold` may not work. The site itself only links to `https://www.limitless.institute/` (the "Back to Limitless" link).
- **Test repository:** `Threshold-Website-Test` contains an unapproved editor change ("You've supported the ventures"). It was not carried over.

## 7. How to deploy to the existing GitHub repository

1. Open https://github.com/KIPSTA341/Threshold-Website and go to **Add file → Upload files**.
2. Drag in every file from this ZIP **except `PUBLISH_CHECKLIST.md`**:
   - pages: `index.html`, `lift.html`, `build.html`, `standard.html`, `team.html`, `begin.html`, `404.html`
   - styles and script: `site.css`, `site.js`
   - portraits: all 7 `team-*.jpg` files
   - Existing files with the same names are replaced. `team-iris-lapinski.jpg` and `team-patrick-meier.jpg` are new.
3. Commit directly to `main` with a message such as "Publish brief: team, advisors, simplified interactions".
4. Wait 1–2 minutes for GitHub Pages, then open https://kipsta341.github.io/Threshold-Website/ and https://www.limitless.institute/threshold in a private window.
5. On a phone: open Home, Team, LIFT and Begin, open the menu, and tap both email buttons.
6. **To roll back:** re-upload the previous files, or revert the commit on GitHub. The live version before this change is commit `e499db3`.
