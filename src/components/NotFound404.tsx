/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
const NotFound404 = () => {
  return (
    <div className="flex flex-col">
      Error page 404 not found
      <Link to="/">BACK TO HOMEPAGE </Link>
    </div>
  );
};

export default NotFound404;
