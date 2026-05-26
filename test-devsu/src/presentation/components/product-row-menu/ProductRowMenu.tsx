import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type { FinancialProduct } from "@/domain/product";
import styles from "./ProductRowMenu.module.css";

const MENU_HEIGHT = 88;

function getMenuStyle(rect: DOMRect): CSSProperties {
  const gap = 4;
  const openUp =
    rect.bottom + MENU_HEIGHT > window.innerHeight && rect.top > MENU_HEIGHT;

  return {
    position: "fixed",
    top: openUp ? rect.top - gap : rect.bottom + gap,
    left: rect.right,
    transform: openUp ? "translate(-100%, -100%)" : "translateX(-100%)",
  };
}

export function ProductRowMenu({
  product,
  onEdit,
  onDelete,
}: {
  product: FinancialProduct;
  onEdit: (p: FinancialProduct) => void;
  onDelete: (p: FinancialProduct) => void;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuStyle(getMenuStyle(rect));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const dropdown =
    open && menuStyle ? (
      <div ref={dropdownRef} className={styles.dropdown} style={menuStyle} role="menu">
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onEdit(product);
          }}
        >
          Editar
        </button>
        <button
          type="button"
          role="menuitem"
          className={styles.danger}
          onClick={() => {
            setOpen(false);
            onDelete(product);
          }}
        >
          Eliminar
        </button>
      </div>
    ) : null;

  return (
    <div className={styles.menu} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>
      {typeof document !== "undefined" && dropdown
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  );
}
