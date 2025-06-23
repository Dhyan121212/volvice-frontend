import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signin.css';

const Signin = ({ onLogin }) => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const passwordInput = document.getElementById('password');
    const form = document.querySelector('form');

    passwordInput.addEventListener('focusin', () => {
      form.classList.add('up');
    });
    passwordInput.addEventListener('focusout', () => {
      form.classList.remove('up');
    });

    const handleMouseMove = (event) => {
      const eyes = document.querySelectorAll('.eye-ball');
      eyes.forEach((eye) => {
        const eyeRect = eye.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;
        const deltaX = event.clientX - eyeX;
        const deltaY = event.clientY - eyeY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(5, Math.hypot(deltaX, deltaY) / 20);
        const moveX = distance * Math.cos(angle);
        const moveY = distance * Math.sin(angle);
        eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId, password }),
      });

      const data = await res.json();

       console.log("JWT Token:", data.token);

       
      if (!res.ok || !data.token || !data.employee) throw new Error('Invalid credentials');

      localStorage.setItem('token', data.token);
      localStorage.setItem('employee', JSON.stringify(data.employee));

      const role = data.employee.role?.toLowerCase();
      const id = data.employee.id;
      onLogin(role, id);

      if (role === 'admin') navigate(`/admin/${id}/home`);
      else navigate(`/employee/${id}/home`);
    } catch (err) {
      const form = document.querySelector('form');
      form.classList.add('wrong-entry');
      setTimeout(() => form.classList.remove('wrong-entry'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="panda">
        <div className="ear"></div>
        <div className="ear rgt"></div>

        <div className="face">
          <div className="eye-shade"></div>
          <div className="eye-shade rgt"></div>

          <div className="eye-white">
            <div className="eye-ball"></div>
          </div>
          <div className="eye-white rgt">
            <div className="eye-ball"></div>
          </div>

          <div className="nose"></div>
          <div className="mouth"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Panda Login</h1>
          <div className="form-group">
            <input
              required
              className="form-control"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
            />
            <label className="form-label">Employee ID</label>
          </div>
          <div className="form-group">
            <input
              id="password"
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="form-label">Password</label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="hand left-hand"></div>
        <div className="hand right-hand"></div>

        <div className="body"></div>

        <div className="foot"><div className="finger"></div></div>
        <div className="foot rgt"><div className="finger"></div></div>
      </div>
    </div>
  );
};

export default Signin;
