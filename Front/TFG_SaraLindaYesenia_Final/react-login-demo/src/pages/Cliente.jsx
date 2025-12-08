import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import './Cliente.css';

export default function Portfolio() {
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className={`app-container ${isDark ? 'dark' : ''} discover-page`}>
      {/* Header */}
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <Link to="/" className="app-name">
            Archives
          </Link>
          <div className="search-wrapper">
            <input className="search-input" type="text" placeholder="Find the book you like..." />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div className="app-header-right">
          <button
            className="mode-switch"
            title="Switch Theme"
            onClick={() => setIsDark(!isDark)}
          >
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </button>
          <button className="add-btn" title="Add New Project">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="profile-btn">
            <img src="/68e45e7a40b25293eb1f3a85d9368ae0.png" alt="Profile" />
            <span>{user.nombre}</span><span>{user.apellidos}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="app-content">
        {/* Sidebar */}
        <div className="app-sidebar">

          <a href="#" className="app-sidebar-link active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </a>
          <a href="#" className="app-sidebar-link ">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </a>
          <a href="#" className="app-sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </a>
          <a href="#" className="app-sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </a>
          {/* Logout */}
          <a href="#" className="app-sidebar-link logout-link" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={logout}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </a>

        </div>

        <div className="app-main">
          {/* Book Recommendation */}
          <div className="book-section">
            <h3>Book Recommendation</h3>
            <div className="book-grid">
              {/* Reemplaza con tus datos dinámicos si quieres */}
              <div className="book-card">
                <img src="public/nyt_explorer_cities_towns_ju_gb_3d_08704_1812121406_id_1169059.png" alt="The Psychology of Money" />
                <p>The Psychology of Money</p>
                <span>Morgan Housel</span>
              </div>
              <div className="book-card">
                <img src="public/nyt_explorer_road_rail_trail_ju_gb_3d_08703_1812121401_id_1168992.png" alt="Company of One" />
                <p>Company of One</p>
                <span>Paul Jarvis</span>
              </div>

              <div className="book-card">
                <img src="public/nyt_36h_europe_3rd_ed_va_gb_3d_04693_1901291641_id_1238055.png" alt="Company of One" />
                <p>Company of One</p>
                <span>Paul Jarvis</span>
              </div>


              <div className="book-card">
                <img src="public/bailey_ce_gb_3d_jagger_03173_1903061128_id_1243530.png" alt="Company of One" />
                <p>Company of One</p>
                <span>Paul Jarvis</span>
              </div>
              {/* Añade más libros aquí */}
            </div>
          </div>

          <div className="book-category-section">
            <div className="category-header">
              <h3>Book Category</h3>
              <a href="#" className="view-all">View all</a>
            </div>
            <div className="category-grid">
              <div className="category-card">
                <div className="category-image">
                  <img src="/arte.png" alt="arte" />
                </div>
                <p className="category-name">Arte</p>
                <div className='rectangulo'></div>
              </div>
              <div className="category-card">
                <div className="category-image">
                  <img src="/clasic.png" alt="clasic" />
                </div>
                <p className="category-name">Classics</p>
                <div className='rectangulo'></div>
              </div>
              <div className="category-card">
                <div className="category-image">
                  <img src="/style.png" alt="Business" />
                </div>
                <p className="category-name">Style,Food & Travel</p>
                <div className='rectangulo'></div>
              </div>
              <div className="category-card">
                <div className="category-image">
                  <img src="/international_houses_ju_int_3d_01179_1809061137_id_1194761.png" alt="Self Improvement" />
                </div>
                <p className="category-name">Architecture & Design</p>
                <div className='rectangulo'></div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>

  );
}