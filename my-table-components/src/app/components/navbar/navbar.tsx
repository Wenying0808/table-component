import styles from "./navbar.module.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar() {
    return (
        <div className={styles.ctas}>
            <IconButton href="/" color="inherit">
                <HomeIcon />
            </IconButton>
            <a
            className={styles.primary}
            href="/table1"
            rel="noopener noreferrer"
            >
            Table 1
            </a>
            <a
            className={styles.primary}
            href="/table2"
            rel="noopener noreferrer"
            >
            Table 2
            </a>
            <a
            className={styles.primary}
            href="/table3"
            rel="noopener noreferrer"
            >
            Table 3
            </a>
            <a
            className={styles.secondary}
            href="https://github.com/Wenying0808/table-component"
            target="_blank"
            rel="noopener noreferrer"
            >
            <GitHubIcon />
            Github
            </a>
        </div>
    )
}