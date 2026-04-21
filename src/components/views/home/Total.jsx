import { useEffect, useState } from "react";
import strings from "../../shared/Strings";

const Total = ({ hosts, guests, partial, setPartial }) => {
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState(0);
  const [remainder, setRemainder] = useState(0);

  useEffect(() => {
    const values = Object.values(hosts);
    const totalSum = values.reduce((acc, h) => acc + h.price, 0);
    setTotal(totalSum);

    const usersCount = values.length + guests;
    setUsers(usersCount);

    const partialPrice = usersCount > 0 ? Math.floor(totalSum / usersCount) : 0;
    setPartial(partialPrice);

    const rem = usersCount > 0 ? totalSum - partialPrice * usersCount : 0;
    setRemainder(rem);
  }, [hosts, guests, setPartial]);

  return (
    <section className="dashboard-section">
      <div className="dashboard">
        <div className="dashboard__hero" aria-live="polite">
          <span className="dashboard__label">{strings.each_pays}</span>
          <span className="dashboard__amount">
            $ {partial.toLocaleString()}
          </span>
        </div>
        <div className="dashboard__stats">
          <div className="dashboard__stat">
            <span className="dashboard__stat-value">{users}</span>
            <span className="dashboard__stat-label">
              {users === 1 ? strings.person : strings.people}
            </span>
          </div>
          <div className="dashboard__stat">
            <span className="dashboard__stat-value">
              $ {total.toLocaleString()}
            </span>
            <span className="dashboard__stat-label">{strings.total}</span>
          </div>
          {remainder > 0 && (
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">
                $ {remainder.toLocaleString()}
              </span>
              <span className="dashboard__stat-label">{strings.remainder}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Total };
