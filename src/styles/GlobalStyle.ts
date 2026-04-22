import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background:
      radial-gradient(circle at top left, rgba(220, 236, 255, 0.95), transparent 28%),
      linear-gradient(180deg, #f4f8fc 0%, #edf2f7 100%);
    line-height: 1.5;
    font-weight: 400;
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
  }

  body {
    margin: 0;
    min-height: 100vh;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at 85% 15%, rgba(29, 78, 216, 0.1), transparent 25%),
      radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.12), transparent 26%);
    pointer-events: none;
    z-index: -1;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .skip-link {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 1000;
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: #ffffff;
    color: ${({ theme }) => theme.colors.accent};
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
    transform: translateY(-140%);
    transition: transform 0.2s ease;
  }

  .skip-link:focus,
  .skip-link:focus-visible {
    transform: translateY(0);
  }

  button,
  input,
  select {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }

  #root {
    min-height: 100vh;
  }

  .page {
    max-width: 1240px;
    margin: 0 auto;
    padding: 40px 24px 56px;
  }

  .page-header {
    margin-bottom: 28px;
  }

  .page-header h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .page-header p {
    margin: 10px 0 0;
    max-width: 42rem;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 1rem;
  }

  .toolbar,
  .pagination-toolbar,
  .pagination {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
  }

  .toolbar {
    padding: 16px;
    background: ${({ theme }) => theme.colors.surfaceSoft};
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: ${({ theme }) => theme.radii.lg};
    backdrop-filter: blur(12px);
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
  }

  .toolbar-field,
  .pagination-toolbar__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .toolbar select,
  .toolbar input,
  .toolbar button,
  .pagination-toolbar select,
  .pagination button {
    min-height: 44px;
    padding: 10px 14px;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: #fff;
    color: ${({ theme }) => theme.colors.text};
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .toolbar input {
    min-width: 180px;
  }

  .toolbar select:focus-visible,
  .toolbar input:focus-visible,
  .toolbar button:focus-visible,
  .pagination-toolbar select:focus-visible,
  .pagination button:focus-visible,
  .favourite-btn:focus-visible,
  .back-link:focus-visible,
  .vehicle-card__link:focus-visible {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
  }

  .toolbar button:hover,
  .pagination button:hover,
  .favourite-btn:hover {
    transform: translateY(-1px);
  }

  .toolbar label,
  .pagination-toolbar__label,
  .pagination-toolbar__summary,
  .pagination__status {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .toolbar label {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }

  .toolbar-field > label,
  .pagination-toolbar__label {
    display: inline-block;
    font-weight: 600;
  }

  .pagination-toolbar {
    justify-content: space-between;
    margin: 22px 0 18px;
  }

  .pagination-toolbar__label {
    display: inline-block;
  }

  .pagination {
    justify-content: space-between;
    margin-top: 22px;
  }

  .pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }

  .vehicle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 18px;
  }

  .vehicle-card,
  .details-card {
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.xl};
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(10px);
  }

  .vehicle-card {
    position: relative;
  }

  .vehicle-card__link {
    display: block;
    border-radius: ${({ theme }) => theme.radii.xl};
  }

  .vehicle-card__image,
  .details-image {
    position: relative;
    min-height: 190px;
    display: grid;
    place-items: center;
    background:
      linear-gradient(135deg, rgba(13, 34, 64, 0.88), rgba(29, 78, 216, 0.72)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent);
    color: #eff6ff;
  }

  .details-image {
    min-height: 260px;
  }

  .vehicle-card__image::before,
  .details-image::before {
    content: "";
    position: absolute;
    inset: 18px;
    border: 1px dashed rgba(255, 255, 255, 0.3);
    border-radius: 18px;
  }

  .vehicle-card__image-overlay {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .vehicle-card__image-label,
  .vehicle-card__countdown,
  .vehicle-card__badge {
    align-self: flex-start;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    color: #eff6ff;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .vehicle-card__countdown {
    background: rgba(248, 250, 252, 0.92);
    color: #0f172a;
  }

  .vehicle-card__content,
  .details-card__body {
    padding: 20px;
  }

  .vehicle-card__header,
  .details-card__intro {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    align-items: flex-start;
  }

  .vehicle-card__eyebrow {
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.76rem;
    font-weight: 700;
    color: #f97316;
  }

  .vehicle-card h3,
  .details-card h1 {
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .vehicle-card h3 {
    font-size: 1.45rem;
  }

  .details-card h1 {
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .vehicle-card__meta,
  .details-card__subtitle,
  .vehicle-card__cta {
    margin-top: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .vehicle-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .vehicle-card__meta span {
    padding: 6px 10px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.chipBg};
    color: ${({ theme }) => theme.colors.chipText};
    font-size: 0.88rem;
  }

  .vehicle-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.accent};
  }

  .vehicle-card__stats,
  .details-summary-grid,
  .details-data-grid {
    display: grid;
    gap: 12px;
  }

  .vehicle-card__stats,
  .details-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 18px 0 0;
  }

  .details-summary-grid {
    margin: 28px 0;
  }

  .vehicle-card__stats div,
  .details-summary-grid div,
  .details-data-grid div {
    padding: 14px 16px;
    border-radius: 16px;
    background: #f8fbff;
    border: 1px solid #dbe7f3;
  }

  .vehicle-card__stats dt,
  .details-summary-grid dt,
  .details-data-grid dt {
    margin: 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7d93;
  }

  .vehicle-card__stats dd,
  .details-summary-grid dd,
  .details-data-grid dd {
    margin: 8px 0 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  .favourite-btn {
    width: calc(100% - 40px);
    margin: 0 20px 20px;
    min-height: 48px;
    padding: 12px 16px;
    border: none;
    border-radius: ${({ theme }) => theme.radii.md};
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.accentDark});
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 12px 30px rgba(29, 78, 216, 0.2);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      opacity 0.2s ease;
  }

  .favourite-btn--active {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.accentWarm}, #c2410c);
    box-shadow: 0 12px 30px rgba(234, 88, 12, 0.22);
  }

  .details-favourite-btn {
    width: auto;
    margin: 0;
  }

  .back-link {
    display: inline-flex;
    margin-bottom: 18px;
    padding: 10px 14px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.surfaceSoft};
    border: 1px solid rgba(148, 163, 184, 0.2);
    color: ${({ theme }) => theme.colors.chipText};
    font-weight: 600;
  }

  .details-section + .details-section {
    margin-top: 24px;
  }

  .details-section h2 {
    margin: 0 0 14px;
    font-size: 1.2rem;
  }

  .details-data-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .equipment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .equipment-list li {
    padding: 10px 12px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.chipBg};
    border: 1px solid #dbe7f3;
    color: ${({ theme }) => theme.colors.chipText};
    font-weight: 600;
  }

  .empty-state {
    grid-column: 1 / -1;
    padding: 32px;
    text-align: center;
    border-radius: ${({ theme }) => theme.radii.xl};
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.emptyText};
  }

  @media (max-width: 760px) {
    .page {
      padding: 28px 16px 40px;
    }

    .toolbar,
    .pagination-toolbar,
    .pagination,
    .vehicle-card__header,
    .details-card__intro {
      flex-direction: column;
      align-items: stretch;
    }

    .toolbar input,
    .toolbar select,
    .toolbar button,
    .pagination-toolbar select,
    .pagination button,
    .details-favourite-btn {
      width: 100%;
    }

    .toolbar-field,
    .pagination-toolbar__field {
      width: 100%;
    }

    .vehicle-card__stats,
    .details-summary-grid,
    .details-data-grid {
      grid-template-columns: 1fr;
    }

    .favourite-btn {
      width: calc(100% - 32px);
      margin: 0 16px 16px;
    }
  }
`;
