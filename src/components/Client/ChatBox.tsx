"use client";

import { useState, useEffect } from "react";
import DesoAPI from "@/lib/deso";
function ChatBox() {
  const DeSo = new DesoAPI();
  const [chats, setChats] = useState<any>();
  async function getUserMessages() {
    const user = localStorage.getItem("deso_user_key");
    const response = await DeSo.getUserMessages(user, false, "");
    console.log(response);
    setChats(response);
  }

  useEffect(() => {
    if (localStorage && localStorage?.getItem("deso_user_key") && !chats) {
      getUserMessages();
    }
  }, []);
  return (
    <section className="grid grid-cols-2">
      <div>
        {!chats && <>HIIIIIII</>}
        {chats && (
          <>
            {chats?.MessageThreads.map(function (value) {
              return <h1 key={value.ChatType}>{value.ChatType}</h1>;
            })}
          </>
        )}
      </div>
      <div>Messages</div>
    </section>
  );
}

export default ChatBox;
