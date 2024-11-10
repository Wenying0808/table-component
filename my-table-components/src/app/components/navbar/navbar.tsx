'use client';

import styles from "./navbar.module.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const pathname = usePathname();
    
    return (
        <div className={styles.navbar}>
            <IconButton href="/" color="inherit">
                <HomeIcon />
            </IconButton>

            <Link
                className={`${styles.primary} ${pathname === '/pages/table1' ? styles.active : ''}`}
                href="/pages/table1"
            >
                Table 1
            </Link>
            <Link
                className={`${styles.primary} ${pathname === '/pages/table2' ? styles.active : ''}`}
                href="/pages/table2"
            >
                Table 2
            </Link>
            <Link
                className={`${styles.primary} ${pathname === '/pages/table3' ? styles.active : ''}`}
                href="/pages/table3"
            >
                Table 3
            </Link>
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