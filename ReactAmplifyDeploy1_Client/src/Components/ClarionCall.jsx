import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ClarionCall = () => {
  const navigate = useNavigate();

  return (
    <div className="clarion-call">
      <h2>Welcome to THE CLARION CALL!</h2>
      <section>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto illum
          alias error odio nisi reprehenderit{" "}
        </p>
        <p>
          doloremque facere itaque unde distinctio repellendus, impedit in
          aliquid explicabo qui. Dolor id aperiam atque.
        </p>
      </section>
      <p> Login to main Chat page if you've registered/signed-up</p>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/signup")}>Register</button>
      <p>
        That long prophesied future starts now! <br />
        Register to Chat with likeminds that are your true friends and family.
        .......the Change-Movers, the Redeemers, the true Chosen Children of the Gods!
      </p>
    </div>
  );
};

export default ClarionCall;