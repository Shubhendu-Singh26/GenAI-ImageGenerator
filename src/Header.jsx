import React, { useState } from "react";
import "./Header.css";

function Header() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const contact = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const sendFormspreeEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    fetch("https://formspree.io/f/mrbbenez", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Message sent successfully!");
          setEmail("");
          setMessage("");
          setShowForm(false);
        } else {
          alert("Failed to send the message. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="nav">
      <div className="appName">GenAI</div>
      <div className="hyperLinks">
        <button onClick={contact}>Contact</button>
      </div>

      {showForm && (
        <div className="contact-form-container">
          <div className="contact-form">
            <h2>Contact Me</h2>
            <form onSubmit={sendFormspreeEmail}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="5"
                required
              />
              <button type="submit">Send Message</button>
            </form>
            <button className="close" onClick={closeForm}>
              Close
            </button>
            <p>Built with ❤️ by Shubhendu Singh</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
