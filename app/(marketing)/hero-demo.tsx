"use client";

import { useState } from "react";
import { BOARD_ANGLES, BOARD_PREVIEWS, COMPASS_POINTS, type BoardKey } from "./hero-demo-data";
import styles from "./hero-demo.module.css";

const POSITION_CLASS = {
  n: styles.pointN,
  e: styles.pointE,
  s: styles.pointS,
  w: styles.pointW,
} as const;

export function HeroDemo() {
  const [active, setActive] = useState<BoardKey>("financial");
  const preview = BOARD_PREVIEWS[active];

  return (
    <div className={styles.heroDemo}>
      <div className={styles.compass} role="group" aria-label="Preview a board">
        <div className={styles.compassRing} />
        <div
          className={styles.needleWrap}
          style={{ "--needle-angle": `${BOARD_ANGLES[active]}deg` } as React.CSSProperties}
        >
          <div className={styles.needle} />
        </div>
        {COMPASS_POINTS.map(({ key, label, position }) => (
          <button
            key={key}
            type="button"
            className={`${styles.point} ${POSITION_CLASS[position]}`}
            aria-pressed={active === key}
            onClick={() => setActive(key)}
            onMouseEnter={() => setActive(key)}
          >
            <span className={styles.dot} />
            {label}
          </button>
        ))}
      </div>

      <div className={styles.previewPanel}>
        <p className={styles.previewLabel}>Board</p>
        <h3 className={styles.previewTitle}>{preview.title}</h3>
        <div className={styles.chipRow}>
          {preview.chips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
        <div className={styles.insight}>
          <div className={styles.mark} />
          <div>{preview.insight}</div>
        </div>
      </div>
    </div>
  );
}
