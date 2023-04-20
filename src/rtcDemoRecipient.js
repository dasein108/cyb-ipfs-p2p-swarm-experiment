import { useState, useEffect, useRef, useMemo } from "react";

const configuration = {
  iceServers: [{ url: "stun:stun.1.google.com:19302" }],
};

function RtcDemoRecipient() {
  const [isConnected, setIsConnected] = useState(false);
  const [localConnection, setLocalConnection] = useState(null);
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    const connection = new RTCPeerConnection(configuration);
    window.recip = connection;
    connection.onicecandidate = (e) => {
      const description = JSON.stringify(connection.localDescription);
      setOffer(description);
      console.log(`ice candidate`, connection.localDescription);
    };

    connection.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage = (e) => {
        console.log("msg recip:" + e.data);
        setLog((log) => [...log, `caller: ${e.data}`]);
      };
      receiveChannel.onerror = (e) => console.log("receiveChannel error", e);
      receiveChannel.onopen = (e) => setIsConnected(true);
      receiveChannel.onclose = (e) => console.log("closed recipient");
      connection.channel = receiveChannel;
    };

    setLocalConnection(connection);
  }, []);

  async function handleOffer() {
    localConnection
      .setRemoteDescription(JSON.parse(offer))
      .then((a) => console.log("done"));
    await localConnection
      .createAnswer()
      .then((a) => localConnection.setLocalDescription(a))
      .then((a) => setAnswer(JSON.stringify(localConnection.localDescription)));
  }

  const sendMessage = () => {
    localConnection.channel.send(msg);
    setLog((log) => [...log, `me: ${msg}`]);
  };

  return (
    <div className="pa2">
      <div>
        <label htmlFor="candidate">Caller's offer</label>
        <textarea
          name="candidate"
          rows="9"
          cols="80"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
        <button className="action" onClick={handleOffer}>
          Handle Offer
        </button>
      </div>
      {answer && (
        <div>
          <label htmlFor="candidate">Answer</label>
          <textarea name="candidate" rows="9" cols="80" value={answer} />
        </div>
      )}
      {isConnected && (
        <div className="button-wrap">
          <input
            className="input-reset ba b--black-20 pa2 mb2 db w-70"
            type="text"
            value={msg}
            onChange={(event) => setMsg(event.target.value)}
          />
          <button className="action" onClick={sendMessage}>
            Send msg
          </button>
        </div>
      )}
      <div>
        {log.map((i) => (
          <div>{i}</div>
        ))}
      </div>
    </div>
  );
}

export default RtcDemoRecipient;
