import { useMemo, useState, useCallback } from "react";
import strings from "../../shared/Strings";

const calculateTransfers = (hosts, guests, partial, guestNames = {}) => {
  const people = [];
  const sourceMap = {};

  Object.entries(hosts).forEach(([id, h]) => {
    const name = h.name || strings.new_payer;
    people.push({ name, paid: h.price, balance: h.price - partial });
    sourceMap[name] = { type: "host", id };
  });

  for (let i = 0; i < guests; i++) {
    const name = guestNames[i] || `${strings.person} ${i + 1}`;
    people.push({ name, paid: 0, balance: -partial });
    sourceMap[name] = { type: "guest", id: i };
  }

  const creditors = people
    .filter((b) => b.balance > 0)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.balance - a.balance);

  const debtors = people
    .filter((b) => b.balance < 0)
    .map((b) => ({ ...b, balance: Math.abs(b.balance) }))
    .sort((a, b) => b.balance - a.balance);

  const transfers = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const amount = Math.min(creditors[ci].balance, debtors[di].balance);
    if (amount > 0) {
      transfers.push({
        from: debtors[di].name,
        to: creditors[ci].name,
        amount,
      });
    }
    creditors[ci].balance -= amount;
    debtors[di].balance -= amount;
    if (creditors[ci].balance <= 0) ci++;
    if (debtors[di].balance <= 0) di++;
  }

  const debtorBalances = {};
  const creditorBalances = {};
  people.forEach((p) => {
    if (p.balance < 0) debtorBalances[p.name] = p.balance;
    if (p.balance > 0) creditorBalances[p.name] = p.balance;
  });

  return { transfers, debtorBalances, creditorBalances, sourceMap };
};

const getInitials = (name) => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const DEBTOR_COLORS = [
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#eab308",
  "#14b8a6",
  "#f43f5e",
  "#6366f1",
];

const CREDITOR_COLOR = "#22c55e";

const isTransferActive = (i, transfers, activeIndex, activeName) => {
  if (activeIndex === i) return true;
  if (
    activeName &&
    (transfers[i].from === activeName || transfers[i].to === activeName)
  )
    return true;
  return false;
};

const SankeyView = ({
  transfers,
  uniqueDebtors,
  uniqueCreditors,
  debtorBalances,
  creditorBalances,
  debtorColorMap,
  activeIndex,
  activeName,
  hasInteraction,
  handleEnterTransfer,
  handleEnterPerson,
  handleLeave,
}) => {
  const maxAmount = Math.max(...transfers.map((t) => t.amount));
  const getStrokeWidth = (amount) => {
    if (maxAmount === 0) return 3;
    return 3 + (amount / maxAmount) * 5;
  };

  const nodeH = 56;
  const nodeGap = 24;
  const paddingTop = 16;
  const paddingBottom = 16;
  const leftX = 16;
  const rightX = 284;
  const nodeWidth = 116;

  const leftHeight = uniqueDebtors.length * (nodeH + nodeGap) - nodeGap;
  const rightHeight = uniqueCreditors.length * (nodeH + nodeGap) - nodeGap;
  const contentH = Math.max(leftHeight, rightHeight);
  const svgH = contentH + paddingTop + paddingBottom;

  const leftStartY = paddingTop + (contentH - leftHeight) / 2;
  const rightStartY = paddingTop + (contentH - rightHeight) / 2;

  const debtorY = (i) => leftStartY + i * (nodeH + nodeGap) + nodeH / 2;
  const creditorY = (i) => rightStartY + i * (nodeH + nodeGap) + nodeH / 2;

  return (
    <svg
      viewBox={`0 0 416 ${svgH}`}
      className="payment-flow__svg"
      role="img"
      aria-label={strings.payment_flow_title}
    >
      <defs>
        {transfers.map((t, i) => (
          <linearGradient
            key={`grad-${i}`}
            id={`flow-grad-${i}`}
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor={debtorColorMap[t.from]}
              stopOpacity="0.9"
            />
            <stop offset="100%" stopColor={CREDITOR_COLOR} stopOpacity="0.9" />
          </linearGradient>
        ))}
      </defs>

      {transfers.map((t, i) => {
        const di = uniqueDebtors.indexOf(t.from);
        const ci = uniqueCreditors.indexOf(t.to);
        const y1 = debtorY(di);
        const y2 = creditorY(ci);
        const x1 = leftX + nodeWidth + 2;
        const x2 = rightX - 2;
        const midX = (x1 + x2) / 2;
        const sw = getStrokeWidth(t.amount);
        const active = isTransferActive(i, transfers, activeIndex, activeName);
        const isDimmed = hasInteraction && !active;

        return (
          <path
            key={`track-${i}`}
            d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke="var(--neutral-300)"
            strokeWidth={sw}
            strokeLinecap="round"
            opacity={isDimmed ? 0.05 : 0.18}
          />
        );
      })}

      {transfers.map((t, i) => {
        const di = uniqueDebtors.indexOf(t.from);
        const ci = uniqueCreditors.indexOf(t.to);
        const y1 = debtorY(di);
        const y2 = creditorY(ci);
        const x1 = leftX + nodeWidth + 2;
        const x2 = rightX - 2;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const sw = getStrokeWidth(t.amount);
        const isActive = isTransferActive(
          i,
          transfers,
          activeIndex,
          activeName,
        );
        const isDimmed = hasInteraction && !isActive;

        return (
          <g
            key={i}
            className={`payment-flow__link ${isActive ? "payment-flow__link--active" : ""} ${isDimmed ? "payment-flow__link--dimmed" : ""}`}
            onMouseEnter={() => handleEnterTransfer(i)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnterTransfer(i)}
            onTouchEnd={handleLeave}
          >
            <path
              d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={`url(#flow-grad-${i})`}
              strokeWidth={sw}
              strokeLinecap="round"
              className="payment-flow__path"
              opacity={isDimmed ? 0.1 : 1}
            />
            <circle
              cx={x2 - 1}
              cy={y2}
              r={Math.max(sw / 2 + 2, 5)}
              fill="var(--bubble-green)"
              opacity={isDimmed ? 0.1 : 0.9}
            />
            <rect
              x={midX - 32}
              y={midY - 13}
              width="64"
              height="26"
              rx="13"
              fill="var(--neutral-50)"
              stroke={isActive ? "var(--primary-500)" : "var(--neutral-300)"}
              strokeWidth={isActive ? 2 : 1}
              opacity={isDimmed ? 0.2 : 1}
              className="payment-flow__amount-bg"
            />
            <text
              x={midX}
              y={midY + 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="var(--primary-500)"
              fontFamily="var(--font-montserrat)"
              opacity={isDimmed ? 0.2 : 1}
            >
              ${t.amount.toLocaleString()}
            </text>
          </g>
        );
      })}

      {uniqueDebtors.map((name, i) => {
        const y = debtorY(i);
        const balance = debtorBalances[name] || 0;
        const color = debtorColorMap[name];
        const isLinked =
          hasInteraction &&
          (activeName === name || transfers[activeIndex]?.from === name);
        const isDimmed = hasInteraction && !isLinked;

        return (
          <g
            key={`d-${i}`}
            className={isDimmed ? "payment-flow__node--dimmed" : ""}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => handleEnterPerson(name)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnterPerson(name)}
            onTouchEnd={handleLeave}
          >
            <rect
              x={leftX}
              y={y - nodeH / 2}
              width={nodeWidth}
              height={nodeH}
              rx="14"
              fill={color}
              opacity={isLinked ? 0.25 : 0.12}
              stroke={color}
              strokeWidth={isLinked ? 2 : 1}
            />
            <circle
              cx={leftX + 24}
              cy={y - 4}
              r="14"
              fill={color}
              opacity="0.3"
            />
            <text
              x={leftX + 24}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--color-body)"
              fontFamily="var(--font-montserrat)"
            >
              {getInitials(name)}
            </text>
            <text
              x={leftX + 46}
              y={y - 5}
              fontSize="12"
              fontWeight="600"
              fill="var(--color-body)"
              fontFamily="var(--font-archivo)"
            >
              {name.length > 9 ? name.slice(0, 8) + "…" : name}
            </text>
            <text
              x={leftX + 46}
              y={y + 12}
              fontSize="10"
              fontWeight="600"
              fill={color}
              fontFamily="var(--font-montserrat)"
            >
              -${Math.abs(balance).toLocaleString()}
            </text>
          </g>
        );
      })}

      {uniqueCreditors.map((name, i) => {
        const y = creditorY(i);
        const balance = creditorBalances[name] || 0;
        const isLinked =
          hasInteraction &&
          (activeName === name || transfers[activeIndex]?.to === name);
        const isDimmed = hasInteraction && !isLinked;

        return (
          <g
            key={`c-${i}`}
            className={isDimmed ? "payment-flow__node--dimmed" : ""}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => handleEnterPerson(name)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnterPerson(name)}
            onTouchEnd={handleLeave}
          >
            <rect
              x={rightX}
              y={y - nodeH / 2}
              width={nodeWidth}
              height={nodeH}
              rx="14"
              fill="var(--bubble-green)"
              opacity={isLinked ? 0.25 : 0.12}
              stroke="var(--bubble-green)"
              strokeWidth={isLinked ? 2 : 1}
            />
            <circle
              cx={rightX + nodeWidth - 24}
              cy={y - 4}
              r="14"
              fill="var(--bubble-green)"
              opacity="0.3"
            />
            <text
              x={rightX + nodeWidth - 24}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--color-body)"
              fontFamily="var(--font-montserrat)"
            >
              {getInitials(name)}
            </text>
            <text
              x={rightX + 8}
              y={y - 5}
              fontSize="12"
              fontWeight="600"
              fill="var(--color-body)"
              fontFamily="var(--font-archivo)"
            >
              {name.length > 9 ? name.slice(0, 8) + "…" : name}
            </text>
            <text
              x={rightX + 8}
              y={y + 12}
              fontSize="10"
              fontWeight="600"
              fill="var(--bubble-green)"
              fontFamily="var(--font-montserrat)"
            >
              +${balance.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const ChordView = ({
  transfers,
  uniqueDebtors,
  uniqueCreditors,
  debtorBalances,
  creditorBalances,
  debtorColorMap,
  activeIndex,
  activeName,
  hasInteraction,
  handleEnterTransfer,
  handleEnterPerson,
  handleLeave,
}) => {
  const allNames = [...uniqueDebtors, ...uniqueCreditors];
  const n = allNames.length;
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 145;
  const innerR = 120;
  const labelR = outerR + 22;

  const anglePerNode = (2 * Math.PI) / n;
  const arcGap = 0.04;
  const arcSpan = anglePerNode - arcGap;

  const nodeAngle = (i) => -Math.PI / 2 + i * anglePerNode;

  const arcMidAngle = (i) => nodeAngle(i) + arcSpan / 2;

  const polarX = (angle, r) => cx + r * Math.cos(angle);
  const polarY = (angle, r) => cy + r * Math.sin(angle);

  const describeArc = (i, r) => {
    const start = nodeAngle(i);
    const end = start + arcSpan;
    const x1 = polarX(start, r);
    const y1 = polarY(start, r);
    const x2 = polarX(end, r);
    const y2 = polarY(end, r);
    const large = arcSpan > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const maxAmount = Math.max(...transfers.map((t) => t.amount));

  const getChordWidth = (amount) => {
    if (maxAmount === 0) return 2;
    return 2 + (amount / maxAmount) * 6;
  };

  const getColor = (name) => {
    if (debtorColorMap[name]) return debtorColorMap[name];
    return CREDITOR_COLOR;
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="payment-flow__svg payment-flow__svg--chord"
      role="img"
      aria-label={strings.payment_flow_title}
    >
      {allNames.map((name, i) => {
        const color = getColor(name);
        const isDebtor = uniqueDebtors.includes(name);
        const isLinked =
          hasInteraction &&
          (activeName === name ||
            transfers[activeIndex]?.from === name ||
            transfers[activeIndex]?.to === name);
        const isDimmed = hasInteraction && !isLinked;

        return (
          <g
            key={`arc-${i}`}
            opacity={isDimmed ? 0.2 : 1}
            style={{ transition: "opacity 0.25s ease", cursor: "pointer" }}
            onMouseEnter={() => handleEnterPerson(name)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnterPerson(name)}
            onTouchEnd={handleLeave}
          >
            <path
              d={describeArc(i, outerR)}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              opacity={isLinked ? 1 : 0.7}
            />
            <circle
              cx={polarX(arcMidAngle(i), outerR)}
              cy={polarY(arcMidAngle(i), outerR)}
              r="16"
              fill={color}
              opacity="0.2"
            />
            <text
              x={polarX(arcMidAngle(i), outerR)}
              y={polarY(arcMidAngle(i), outerR) + 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="var(--color-body)"
              fontFamily="var(--font-montserrat)"
            >
              {getInitials(name)}
            </text>
            <text
              x={polarX(arcMidAngle(i), labelR)}
              y={polarY(arcMidAngle(i), labelR)}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--color-body)"
              fontFamily="var(--font-archivo)"
              dominantBaseline="central"
            >
              {name.length > 8 ? name.slice(0, 7) + "…" : name}
            </text>
            <text
              x={polarX(arcMidAngle(i), labelR + 12)}
              y={polarY(arcMidAngle(i), labelR + 12)}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill={color}
              fontFamily="var(--font-montserrat)"
              dominantBaseline="central"
            >
              {isDebtor
                ? `-$${Math.abs(debtorBalances[name] || 0).toLocaleString()}`
                : `+$${(creditorBalances[name] || 0).toLocaleString()}`}
            </text>
          </g>
        );
      })}

      {transfers.map((t, i) => {
        const fromIdx = allNames.indexOf(t.from);
        const toIdx = allNames.indexOf(t.to);
        const fromAngle = arcMidAngle(fromIdx);
        const toAngle = arcMidAngle(toIdx);
        const x1 = polarX(fromAngle, innerR);
        const y1 = polarY(fromAngle, innerR);
        const x2 = polarX(toAngle, innerR);
        const y2 = polarY(toAngle, innerR);
        const sw = getChordWidth(t.amount);
        const isActive = isTransferActive(
          i,
          transfers,
          activeIndex,
          activeName,
        );
        const isDimmed = hasInteraction && !isActive;
        const color = debtorColorMap[t.from];

        const midAngle = (fromAngle + toAngle) / 2;
        const pullR = innerR * 0.35;
        const cpX = cx + pullR * Math.cos(midAngle);
        const cpY = cy + pullR * Math.sin(midAngle);

        const textR = innerR * 0.55;
        const textAngle = midAngle;
        const tx = cx + textR * Math.cos(textAngle);
        const ty = cy + textR * Math.sin(textAngle);

        return (
          <g
            key={`chord-${i}`}
            className={`payment-flow__link ${isActive ? "payment-flow__link--active" : ""}`}
            onMouseEnter={() => handleEnterTransfer(i)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnterTransfer(i)}
            onTouchEnd={handleLeave}
            style={{ cursor: "pointer" }}
          >
            <path
              d={`M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth={sw}
              strokeLinecap="round"
              className="payment-flow__path"
              opacity={isDimmed ? 0.08 : 0.85}
            />
            <circle
              cx={x2}
              cy={y2}
              r={Math.max(sw / 2 + 1.5, 4)}
              fill={CREDITOR_COLOR}
              opacity={isDimmed ? 0.08 : 0.9}
            />
            <rect
              x={tx - 24}
              y={ty - 10}
              width="48"
              height="20"
              rx="10"
              fill="var(--neutral-50)"
              stroke={isActive ? color : "var(--neutral-300)"}
              strokeWidth={isActive ? 1.5 : 0.5}
              opacity={isDimmed ? 0.15 : 1}
              className="payment-flow__amount-bg"
            />
            <text
              x={tx}
              y={ty + 4}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill={color}
              fontFamily="var(--font-montserrat)"
              opacity={isDimmed ? 0.15 : 1}
            >
              ${t.amount.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const handleInputFocus = (e) => {
  setTimeout(() => {
    e.target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
};

const PaymentFlow = ({
  hosts,
  setHosts,
  guests,
  guestNames,
  setGuestNames,
  partial,
}) => {
  const { transfers, debtorBalances, creditorBalances, sourceMap } = useMemo(
    () => calculateTransfers(hosts, guests, partial, guestNames),
    [hosts, guests, partial, guestNames],
  );

  const handleNameChange = useCallback(
    (currentName, newValue) => {
      const source = sourceMap[currentName];
      if (!source) return;
      if (source.type === "host") {
        setHosts((prev) => ({
          ...prev,
          [source.id]: { ...prev[source.id], name: newValue },
        }));
      } else {
        setGuestNames((prev) => ({ ...prev, [source.id]: newValue }));
      }
    },
    [sourceMap, setHosts, setGuestNames],
  );

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeName, setActiveName] = useState(null);
  const [view, setView] = useState("sankey");

  const handleEnterTransfer = useCallback((i) => {
    setActiveIndex(i);
    setActiveName(null);
  }, []);
  const handleEnterPerson = useCallback((name) => {
    setActiveName(name);
    setActiveIndex(null);
  }, []);
  const handleLeave = useCallback(() => {
    setActiveIndex(null);
    setActiveName(null);
  }, []);

  if (transfers.length === 0) return null;

  const uniqueDebtors = [...new Set(transfers.map((t) => t.from))];
  const uniqueCreditors = [...new Set(transfers.map((t) => t.to))];

  const debtorColorMap = {};
  uniqueDebtors.forEach((name, i) => {
    debtorColorMap[name] = DEBTOR_COLORS[i % DEBTOR_COLORS.length];
  });

  const hasInteraction = activeIndex !== null || activeName !== null;

  const sharedProps = {
    transfers,
    uniqueDebtors,
    uniqueCreditors,
    debtorBalances,
    creditorBalances,
    debtorColorMap,
    activeIndex,
    activeName,
    hasInteraction,
    handleEnterTransfer,
    handleEnterPerson,
    handleLeave,
  };

  return (
    <section className="payment-flow">
      <div className="payment-flow__header">
        <h3 className="payment-flow__title">{strings.payment_flow_title}</h3>
        <div className="payment-flow__toggle">
          <button
            className={`payment-flow__toggle-btn ${view === "sankey" ? "payment-flow__toggle-btn--active" : ""}`}
            onClick={() => {
              setView("sankey");
              setActiveIndex(null);
              setActiveName(null);
            }}
            aria-label="Vista flujo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h3M2 12h3M11 8h3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 4C8 4 8 8 11 8M5 12C8 12 8 8 11 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
          <button
            className={`payment-flow__toggle-btn ${view === "chord" ? "payment-flow__toggle-btn--active" : ""}`}
            onClick={() => {
              setView("chord");
              setActiveIndex(null);
              setActiveName(null);
            }}
            aria-label="Vista circular"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M4 5Q8 9 12 5M4 11Q8 7 12 11"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="payment-flow__diagram">
        {view === "sankey" ? (
          <SankeyView {...sharedProps} />
        ) : (
          <ChordView {...sharedProps} />
        )}
      </div>

      <ul className="payment-flow__list">
        {transfers.map((t, i) => (
          <li
            key={i}
            className={`payment-flow__item ${isTransferActive(i, transfers, activeIndex, activeName) ? "payment-flow__item--active" : ""}`}
            onMouseEnter={() => handleEnterTransfer(i)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnterTransfer(i)}
            onTouchEnd={handleLeave}
          >
            <span
              className="payment-flow__item-dot"
              style={{ background: debtorColorMap[t.from] }}
            />
            <input
              className="payment-flow__item-input payment-flow__item-input--from"
              style={{ color: debtorColorMap[t.from] }}
              value={t.from}
              placeholder={strings.new_payer}
              onChange={(e) => handleNameChange(t.from, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={handleInputFocus}
              enterKeyHint="next"
              autoComplete="off"
              autoCapitalize="words"
            />
            <span className="payment-flow__item-arrow">→</span>
            <input
              className="payment-flow__item-input payment-flow__item-input--to"
              value={t.to}
              placeholder={strings.new_payer}
              onChange={(e) => handleNameChange(t.to, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={handleInputFocus}
              enterKeyHint="done"
              autoComplete="off"
              autoCapitalize="words"
            />
            <span className="payment-flow__item-amount">
              ${t.amount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export { PaymentFlow, calculateTransfers };
