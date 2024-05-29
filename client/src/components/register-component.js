import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const RegisterComponent = () => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRole = (e) => {
    console.log(e.target.value);
    setRole(e.target.value);
  };
  const handleRegister = (e) => {
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("註冊成功 您即將被導入至登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <h3 style={{ paddingBottom: "3rem" }}>註冊頁面</h3>

      <div>
        {message && <div className="alert alert-danger">{message}</div>}

        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
            placeholder="長度至少超過8個英文或數字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="role">身份：</label>
          <select name="role" className="form-control" onChange={handleRole}>
            <option value="" disabled selected>
              請輸入你的身分
            </option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>註冊會員</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
