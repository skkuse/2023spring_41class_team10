import { Link } from 'react-router-dom';
function MainHeader() {
  return (
    <header>
      <h1>
        <Link to="/">BePro</Link>
      </h1>
    </header>
  );
}

export default MainHeader;
