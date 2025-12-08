import React, { useEffect } from 'react';
import './NotFound.css';

export default function Error404() {
  useEffect(() => {
    document.body.classList.add('error404'); // 添加 404 背景类
    return () => {
      document.body.classList.remove('error404'); // 离开页面移除类
    };
  }, []);

  return (
    <>
      <nav className="shelf">
        <a className="book home-page">Home page</a>
        <a className="book about-us">About us</a>
        <a className="book contact">Contact</a>
        <a className="book faq">F.A.Q.</a>

        <span className="book not-found"></span>
        <span className="door left"></span>
        <span className="door right"></span>
      </nav>

      <div className="text">
        <h1>Error 404</h1>
        <p>The page you're looking for can't be found</p>
      </div>
    </>
  );
}
