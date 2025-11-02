"use client";

import React from "react";
import styles from "./DarkSection.module.scss";

/**
 * DarkSection Component
 * 
 * A responsive wrapper for dark-themed sections with mobile-first design.
 * - Mobile: minimal padding (30px 1em), no border-radius
 * - Tablet (790px+): medium padding (40px 1.5em), slight radius (8px)
 * - Desktop (992px+): full padding (50px 2em), rounded (12px)
 * 
 * Usage:
 * <DarkSection>
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </DarkSection>
 */
const DarkSection = ({ children, className = "" }) => {
  return (
    <div className={`${styles.darkSection} ${className}`}>
      {children}
    </div>
  );
};

export default DarkSection;
