import { Title } from "./Title";

export const ListView = ({ nodeId, items, title, mapper }) => (
  <div className="pt2">
    <Title>{title}</Title>
    <div className="bg-white f7 pa1 br2 truncate monospace">
      {items.map((p, i) => (
        <div className="f7 pa0" key={`${nodeId}-${title}-${i}`}>
          {mapper ? mapper(p) : p}
        </div>
      ))}
    </div>
  </div>
);
