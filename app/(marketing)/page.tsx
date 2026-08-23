import Link from "next/link";
import { auth } from "@/auth";
import { listBoardNavItems } from "@/boards";
import { HeroDemo } from "./hero-demo";
import styles from "./page.module.css";

const REPO_URL = "https://github.com/bbfrancis23/compass-boards";

export default async function MarketingHomePage() {
  const session = await auth();
  const firstBoardId = listBoardNavItems()[0]?.id;

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.brandMark} />
          <span className={styles.brandName}>Compass Boards</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#how">How it works</a>
          <a href="#boards">Boards</a>
          <a href="#stack">Stack</a>
          <a className={styles.navCta} href={REPO_URL} target="_blank" rel="noopener noreferrer">
            View the code
          </a>
          {session?.user && firstBoardId ? (
            <Link className={styles.navCta} href={`/boards/${firstBoardId}`}>
              Your boards
            </Link>
          ) : (
            <Link className={styles.navCta} href="/signin">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fadeIn}`}>
          A portfolio project, built to actually be used
        </p>
        <h1 className={`${styles.heading} ${styles.fadeIn} ${styles.d1}`}>
          Every board finds its <em>own north.</em>
        </h1>
        <p className={`${styles.sub} ${styles.fadeIn} ${styles.d2}`}>
          Compass Boards is a drag-and-drop dashboard builder. Each board tracks one part of your
          life — log data through its input widgets, watch it turn into charts, and ask Claude what
          it actually means.
        </p>

        <div className={`${styles.fadeIn} ${styles.d3}`}>
          <HeroDemo />
        </div>
      </section>

      <section className={styles.section} id="how">
        <p className={styles.sectionHead}>How a board comes together</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <p className={styles.stepNum}>01</p>
            <svg
              className={styles.stepIcon}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 3v18M3 12h18M6 6l-3 3 3 3M18 6l3 3-3 3M6 18l-3-3 3-3M18 18l3-3-3-3" />
            </svg>
            <h3>Drag widgets onto the canvas</h3>
            <p>
              Place input and output widgets anywhere on a board and resize them freely — the grid
              handles collisions so nothing overlaps.
            </p>
          </div>
          <div className={styles.step}>
            <p className={styles.stepNum}>02</p>
            <svg
              className={styles.stepIcon}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 6h16M4 12h10M4 18h13" />
              <circle cx="20" cy="18" r="1.6" fill="currentColor" stroke="none" />
            </svg>
            <h3>Log data through input widgets</h3>
            <p>
              Balances, workouts, habits, sessions — whatever the board tracks, entries feed
              straight into the same store the charts read from.
            </p>
          </div>
          <div className={styles.step}>
            <p className={styles.stepNum}>03</p>
            <svg
              className={styles.stepIcon}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 5h16v10H8l-4 4z" />
              <path
                d="M13 9.2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <h3>Ask Claude, get advice from your data</h3>
            <p>
              Each board has its own prompt. Claude reads that board&apos;s numbers only, and
              answers in the context of what you&apos;re actually tracking.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} id="boards">
        <p className={styles.sectionHead}>Two boards, ready out of the box</p>
        <div className={styles.boards}>
          <div className={styles.boardCard}>
            <div className={styles.boardCardHead}>
              <div className={`${styles.boardIcon} ${styles.boardIconFin}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F1EDE4" strokeWidth="2">
                  <path d="M4 18V10M10 18V4M16 18v-7M22 18H2" />
                </svg>
              </div>
              <strong>Financial</strong>
              <span>Example board</span>
            </div>
            <div className={styles.statBar}>
              <p className={styles.statBarKey}>Net worth, this month</p>
              <p className={styles.statBarValue}>+$1,240</p>
            </div>
            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Checking — Whole Foods</span>
                <span className={styles.rowValue}>-$64.20</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Savings — transfer</span>
                <span className={styles.rowValue}>+$400.00</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Credit — Spotify</span>
                <span className={styles.rowValue}>-$11.99</span>
              </div>
            </div>
          </div>

          <div className={styles.boardCard}>
            <div className={styles.boardCardHead}>
              <div className={`${styles.boardIcon} ${styles.boardIconFit}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F1EDE4" strokeWidth="2">
                  <path d="M4 12h2M18 12h2M6 8v8M18 8v8M6 12h12" />
                </svg>
              </div>
              <strong>Fitness</strong>
              <span>Example board</span>
            </div>
            <div className={styles.statBar}>
              <p className={styles.statBarKey}>Current streak</p>
              <p className={styles.statBarValue}>6 days</p>
            </div>
            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Squat 3x5</span>
                <span className={styles.rowValue}>185 lb</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Deadlift 1x5</span>
                <span className={styles.rowValue}>225 lb</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Zone 2 run</span>
                <span className={styles.rowValue}>32 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="stack">
        <p className={styles.sectionHead}>Built with</p>
        <div className={styles.stackRow}>
          <span className={styles.stackChip}>Next.js (App Router)</span>
          <span className={styles.stackChip}>TypeScript</span>
          <span className={styles.stackChip}>Mantine UI</span>
          <span className={styles.stackChip}>react-grid-layout</span>
          <span className={styles.stackChip}>Drizzle + Turso</span>
          <span className={styles.stackChip}>Auth.js</span>
          <span className={styles.stackChip}>Claude API</span>
        </div>
        <div className={styles.footer}>
          <span>Compass Boards — a solo project, 2026</span>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            View source on GitHub →
          </a>
        </div>
      </section>
    </div>
  );
}
