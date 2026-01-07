import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <header className="hero">
        <div className="hero-text">
          <h1>Простір для ваших <span className="highlight">IT-проєктів</span></h1>
          <h2>Діліться своїм кодом, надихайтеся іншими.</h2>
          <p>
            DevHub — це платформа, де кожен розробник може створити власне портфоліо за лічені хвилини.
          </p>
          <div className="hero-btns">
              <Link to="/explore" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Почати безкоштовно
              </Link>
          </div>
        </div>
        <div className="hero-avatar">
           <div className="avatar-circle">🚀</div>
        </div>
      </header>
    </div>
  );
};
export default Home;