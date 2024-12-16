import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import "../app.css";
import "./chatpage.css";
import ContentListing from "./ContentListing";
import ContentImageVideoDisplay from "./ContentImageVideoDisplay";
import ChatsbyContent from "./ChatsbyContent";
import Chatboard from "./Chatboard";

const Chatpage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authToken) {
      axios
        .get("http://localhost:3000/api/auth", {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            setAuth(true);
            setUsername(res.data.username); // Set the username should be set Submitter ID
            setIsAdmin(res.data.isAdmin);// Check if the user is an admin
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
      .get("http://localhost:3000/api/auth/logout")
      .then((res) => {
        localStorage.removeItem("token"); // Remove the token
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const { data: displayContent, isLoading: isLoadingDisplay } = useQuery({
    queryKey: ["display"],
    queryFn: async () => {
      if (!authToken) return;
      try {
        const result = await axios.get("http://localhost:3000/api/content", {
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

  const sendMessage = useMutation({
    mutationFn: ({ title, description, audience, targetId }) =>
      axios.post(
        "http://localhost:3000/api/content/messages",
        { title, description, audience, targetId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display"] });
      setNewMessage("");
      setNewTitle("");
    },
  });

  const uploadFile = useMutation({
    mutationFn: ({ file, audience }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("audience", audience);
      return axios.post("http://localhost:3000/api/content/upload", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display"] });
    },
  });

  const addComment = useMutation({
    mutationFn: (formData) =>
      axios.post(
        `http://localhost:3000/api/content/${selectedContent.id}/comments`,
        formData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      ),
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
            <div className="nav_div">
              <Link to="/profile">Profile</Link>
            </div>
            {isAdmin && (
              <button onClick={() => navigate("/adminpage")}>Admin Page</button>
            )}
          </section>
          <section className="display_section">
            <div className="display_div">
              <div className="contentlisting_div">
                <p>Content Listing</p>
                <ContentListing displayContent={displayContent} onSelectContent={setSelectedContent} />
              </div>
              <div className="mid_display_div">
                <div className="contentimagevideodisplay_div">
                  <p>Main Content</p>
                  {displayContent && displayContent.length > 0 && (
                    <ContentImageVideoDisplay selectedContent={selectedContent || displayContent[0]} />
                  )}
                </div>
                <section className="chatboard-logout_div">
                  <div className="chatboard_section">
                    <p>Chatboard</p>
                    <Chatboard
                      newTitle={newTitle}
                      setNewTitle={setNewTitle}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      sendMessage={sendMessage}
                      uploadFiles={uploadFile}
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
                <p>Comments</p>
                {!isLoadingDisplay && selectedContent && (
                  <ChatsbyContent subComments={selectedContent.comments} onAddComment={addComment.mutate} />
                )}
              </section>
            </div>
          </section>
          <section className="footer_section">
            <div className="footer_div">A Clarion Call to Re-Build </div>
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