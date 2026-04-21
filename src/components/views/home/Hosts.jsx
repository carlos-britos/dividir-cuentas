import { useEffect, useState } from "react";
import { Icon, AddIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";
import { UserCard } from "./UserCard";

const Hosts = ({ hosts, setHosts, partial }) => {
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
            <b>{hostsArray.length} </b>
            {strings.payers}
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hosts };
