import { useState, useEffect } from "react";
import { peerMap, getPeerIdByAlias } from "./peerMap";
import Select from "react-select";
const options = Object.keys(peerMap).map((key) => {
  return {
    value: key,
    label: `${key}: ${peerMap[key].id}`,
  };
});

function PeerAliasSelector({ onChange }) {
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    const peerAlias = localStorage.getItem("peerAlias");
    console.log("--peer", peerAlias);
    setSelectedOption(options.find((i) => i.value === peerAlias));
    peerAlias && onChange(peerAlias);
  }, [onChange]);

  const changePeerAlias = (alias) => {
    setSelectedOption(alias);
    localStorage.setItem("peerAlias", alias.value);
    console.log("changePeerAlias", alias);
    onChange(alias.value);
  };
  console.log("--peeselectedOptionr", selectedOption);
  return (
    <div className="selector">
      <h3>Peer Alias</h3>
      <Select
        defaultValue={selectedOption}
        onChange={changePeerAlias}
        value={selectedOption}
        options={options}
      />
    </div>
  );
}

export default PeerAliasSelector;
