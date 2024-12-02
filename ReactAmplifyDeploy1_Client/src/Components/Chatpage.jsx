import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "../app.css";
import "./chatpage.css";
import ContentListing from "./ContentListing";
import ContentImageVideoDisplay from "./ContentImageVideoDisplay";
import ChatsbyContent from "./ChatsbyContent";
import Chatboard from "./Chatboard";

const Chatpage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authToken) {
      axios
        .get("http://localhost:3000/auth", {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            setAuth(true);
            setUsername(res.data.username);
            setMessage(
              res.data.Status + " - " + "You are authenticated @ chat page"
            );
          } else {
            setAuth(false);
            setMessage(
              res.data.Error + " - " + "You are not authenticated @ chat page"
            );
          }
        })
        .catch((err) => {
          setMessage("You are not authenticated @ catcher @ chat page");
        });
    } else {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handleDeleteCookies = () => {
    axios
      .get("http://localhost:3000/logout")
      .then((res) => {
        localStorage.removeItem("token"); // Remove the token
        location.reload(true);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const { data: displayContent, isLoading: isLoadingDisplay } = useQuery({
    queryKey: ["display"],
    queryFn: async () => {
      if (!authToken) return;
      try {
        const result = await axios.get("http://localhost:3000/content/display", {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        });
        return result.data;
      } catch (error) {
        console.log("error in getting displayed data", error);
        return null;
      }
    },
    enabled: !!authToken,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!authToken) return;
      try {
        const result = await axios.get("http://localhost:3000/content/messages", {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        });
        return result.data;
      } catch (error) {
        console.log("error in getting messages", error);
        return null;
      }
    },
    enabled: !!authToken,
  });

  const sendMessage = useMutation({
    mutationFn: ({ message, audience }) =>
      axios.post(
        "http://localhost:3000/api/messages",
        { message, audience },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setNewMessage("");
    },
  });

  const uploadFile = useMutation({
    mutationFn: ({ file, audience }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("audience", audience);
      return axios.post("http://localhost:3000/upload", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display"] });
    },
  });

  if (!authToken) {
    return null; // Prevent rendering if no authToken
  }


  return (
    <div className="chatpage-container">
      {authToken && !auth ? (
        <div>
          <button
            onClick={async () => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <>
          <section className="navbar">
            <div className="welcome_div">
              <div>Welcome! {username}</div>
              <div>{message}</div>
            </div>
            <div>searchbar</div>
            <div className="nav_div">Profile</div>
          </section>
          <section className="display_section">
            <div className="display_div">
              <div className="contentlisting_div">
                <p>Content Listing</p>
                <ContentListing contentList={[]} />
              </div>
              <div className="mid_display_div">
                <div className="contentimagevideodisplay_div">
                  <p>Main Content</p>
                  <ContentImageVideoDisplay displayContent={displayContent} />
                </div>
                <section className="chatboard-logout_div">
                  <div className="chatboard_section">
                    <p>Chatboard</p>
                    <Chatboard
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      sendMessage={sendMessage}
                      uploadFile={uploadFile}
                    />
                    {sendMessage.isLoading && <div>Sending message...</div>}
                    {sendMessage.isError && (
                      <div>Error sending message: {sendMessage.error.message}</div>
                    )}
                    {sendMessage.isSuccess && <div>Message sent!</div>}
                  </div>
                  
                </section>
              </div>
              <section className="chatsbycontent_div">
                <p>ChatsbyContent or msg_by_content</p>
                {!isLoadingMessages && messages && (
                  <ChatsbyContent messages={messages} />
                )}
              </section>
            </div>
          </section>
          <section className="footer_section">
            <div className="footer_div">A Clarion Call to Re-Build Zion</div>
            <div className="footer_div">
              <div className="logout_middisplaydiv">
                <div>
                  Need help? Request for help at <a href="mailto:administrator@gmail.com">administrator@gmail.com</a>
                </div>
                <div>Remember to logout, when you're done. Thx</div>
              </div>
              <button onClick={handleDeleteCookies}>Logout</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Chatpage;