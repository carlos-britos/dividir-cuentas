import { useEffect, useState } from "react";
import { Icon, AddIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";
import { UserCard } from "./UserCard";

const Hosts = ({ hosts, setHosts, partial, isFirstVisit, onInteraction }) => {
  const [newId, setNewId] = useState(1);
  const hostsArray = Object.keys(hosts);

  useEffect(() => {
    const maxId =
      hostsArray.length > 0 ? Math.max(...hostsArray.map(Number)) : 0;
    if (maxId >= newId) {
      setNewId(maxId + 1);
    }
  }, [hosts]);

  const handleNewUser = () => {
    setHosts((prevHosts) => ({
      ...prevHosts,
      [newId]: { price: 0, name: "" },
    }));
    setNewId(newId + 1);
  };

  const handleRemoveHost = (hostId) => {
    setHosts((prevHosts) => {
      const { [hostId]: _, ...rest } = prevHosts;
      return rest;
    });
  };

  return (
    <section>
      <div className="user-list payers-section">
        <div className="user-list__header">
          <div>
            {strings.payers}{" "}
            <span className="user-list__count">{hostsArray.length}</span>
          </div>
          <button
            className="add-new-user"
            onClick={handleNewUser}
            aria-label="Agregar pagador"
            type="button"
          >
            <Icon iconSvg={<AddIcon />} />
          </button>
        </div>
        {isFirstVisit && (
          <p className="user-list__hint">{strings.section_hint_payers}</p>
        )}
        <div className="user-list__body">
          {hostsArray.map((host) => (
            <UserCard
              key={host}
              setHosts={setHosts}
              host={host}
              partial={partial}
              onRemove={handleRemoveHost}
              canRemove={hostsArray.length > 1}
              initialPrice={hosts[host].price}
              initialName={hosts[host].name}
              isFirstVisit={isFirstVisit}
              onInteraction={onInteraction}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hosts };
