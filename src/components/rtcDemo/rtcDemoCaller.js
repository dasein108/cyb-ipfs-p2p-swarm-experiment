import { useState, useEffect } from "react";

const configuration = {
  iceServers: [{ url: "stun:stun.1.google.com:19302" }],
};

function RtcDemoCaller() {
  const [isConnected, setIsConnected] = useState(false);
  const [localConnection, setLocalConnection] = useState(null);
  const [sendChannel, setSendChannel] = useState(null);
  const [remoteAnswer, setRemoteAnswer] = useState(null);
  const [offer, setOffer] = useState(null);
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    const connection = new RTCPeerConnection(configuration);
    window.caller = connection;
    connection.onicecandidate = (e) => {
      const description = JSON.stringify(connection.localDescription);
      setOffer(description);
      console.log(`ice candidate`, connection.localDescription);
    };

    const sendChannel = connection.createDataChannel("sendChannel");
    sendChannel.onmessage = (e) =>
      setLog((log) => [...log, `recipient: ${e.data}`]);

    sendChannel.onopen = (e) => setIsConnected(true);
    sendChannel.onerror = (e) => console.log("sendChannel error", e);
    sendChannel.onclose = (e) => console.log("sendChannel closed");

    connection
      .createOffer()
      .then((offer) => connection.setLocalDescription(offer));

    setSendChannel(sendChannel);
    setLocalConnection(connection);
  }, []);

  async function handleAnswer() {
    const answer = JSON.parse(remoteAnswer);
    await localConnection.setRemoteDescription(answer);
  }

  const sendMessage = () => {
    sendChannel.send(msg);
    window.chan = sendChannel;
    setLog((log) => [...log, `me: ${msg}`]);
  };

  return (
    <div className="pa2">
      <div>
        <label htmlFor="candidate">Offer</label>
        <textarea name="candidate" rows="9" cols="80" value={offer} />
      </div>
      <div>
        <label htmlFor="localDescription">Recipient's Answer</label>
        <textarea
          name="remoteAnswer"
          rows="9"
          cols="80"
          value={remoteAnswer}
          onChange={(e) => setRemoteAnswer(e.target.value)}
        />
        <button className="action" onClick={handleAnswer}>
          Handle Answer
        </button>
      </div>
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

export default RtcDemoCaller;
