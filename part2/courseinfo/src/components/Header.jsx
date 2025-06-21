const Header = ({ level, text }) => {
  const headingTag = level;
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const HeaderElement = validHeadings.includes(headingTag) ? headingTag : null;

  return <HeaderElement>{text}</HeaderElement>;
};

export default Header;
