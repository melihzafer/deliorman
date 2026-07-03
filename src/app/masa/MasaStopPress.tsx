import type { MasaStyles, WaiterFeedback } from "./masaTypes";

interface MasaStopPressProps {
  buttonLabel: string;
  disabled: boolean;
  feedback: WaiterFeedback;
  onCallWaiter: () => void;
  styles: MasaStyles;
}

export function MasaStopPress({ buttonLabel, disabled, feedback, onCallWaiter, styles }: MasaStopPressProps) {
  return (
    <div className={styles.stopPress}>
      {feedback ? (
        <div className={`${styles.message} ${feedback.type === "success" ? styles.messageOk : styles.messageErr}`}>
          {feedback.text}
        </div>
      ) : null}
      <button type="button" className={styles.callBtn} onClick={onCallWaiter} disabled={disabled}>
        <span className={styles.callBtnLabel}>{buttonLabel}</span>
      </button>
    </div>
  );
}
