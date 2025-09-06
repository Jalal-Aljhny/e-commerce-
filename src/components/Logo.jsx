import { useNavigate } from "react-router-dom";
import styles from "./logo.module.css";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.container}
      onClick={() => {
        // window.location.reload();
        navigate("/");
      }}
    >
      <p className={styles.fl}>AJY</p>
      <p className={styles.sl}>Food e-commerce</p>
    </div>
  );
};

export default Logo;
