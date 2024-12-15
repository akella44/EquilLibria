import { FC } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  label: string;
  isChecked: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({ label, isChecked = false }) => {
  return (
    <label className={styles.checkboxContainer}>
      <span
        className={styles.customCheckbox}
        style={
          isChecked
            ? { border: "1px solid var(--color-primary-purple)" }
            : undefined
        }
      >
        {isChecked && <span className={styles.checkmark} />}
      </span>
      <span>{label}</span>
    </label>
  );
};
