import {
  formatAmount,
  formatTrimmedAmount,
  getCurrencyDisplay,
} from "@/utils/currency";
import { useLayoutEffect, useRef } from "react";

interface CurrencyAmountProps {
  value: number;
  currency: string;
  precision?: number;
  className?: string;
  fitToWidth?: boolean;
  /** Round to `precision` and hide a zero fraction, instead of preserving sub-cent payout digits. */
  trimZeros?: boolean;
}

export function CurrencyAmount({
  value,
  currency,
  precision,
  className,
  fitToWidth = false,
  trimZeros = false,
}: CurrencyAmountProps) {
  const pairRef = useRef<HTMLSpanElement>(null);
  const display = getCurrencyDisplay(currency);
  const decimals = precision ?? display.decimals;
  const amount = trimZeros
    ? formatTrimmedAmount(value, decimals)
    : formatAmount(value, decimals);
  useLayoutEffect(() => {
    const element = pairRef.current;
    const parent = element?.parentElement;
    if (!fitToWidth || !element || !parent) return;
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      element.style.removeProperty("font-size");
      const parentStyle = getComputedStyle(parent);
      const available = Math.max(0, parent.clientWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight) - 4);
      const width = element.getBoundingClientRect().width;
      const baseSize = parseFloat(getComputedStyle(element).fontSize);
      if (available > 0 && width > available) {
        element.style.fontSize = `${baseSize * available / width}px`;
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(parent);
    window.addEventListener("resize", fit);
    void document.fonts.ready.then(fit);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", fit);
      element.style.removeProperty("font-size");
    };
  }, [fitToWidth, amount, currency]);
  const multiChar = display.symbol.length > 1;
  const suffix = display.placement === "suffix";
  const pairCls = [
    "smp-currency-pair",
    multiChar && !suffix ? "smp-currency-pair--text" : "",
    suffix ? "smp-currency-pair--suffix" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const symbol = (
    <span className="smp-currency-pair__symbol">{display.symbol}</span>
  );
  const amountEl = <span className="smp-currency-pair__amount">{amount}</span>;

  return (
    <span ref={pairRef} className={pairCls} style={fitToWidth ? { flexShrink: 0, width: "max-content", whiteSpace: "nowrap" } : undefined}>
      {suffix ? (
        <>
          {amountEl}
          {symbol}
        </>
      ) : (
        <>
          {symbol}
          {amountEl}
        </>
      )}
    </span>
  );
}
