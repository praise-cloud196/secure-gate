import Link from "next/link";
import styles from "./auth-link.module.css";

interface AuthLinkProps {
  text: string;
  href: string;
  linkLabel: string;
}

export default function AuthLink({ text, href, linkLabel }: AuthLinkProps) {
  return (
    <p className={styles.footer}>
      {text}{" "}
      <Link href={href} className={styles.link}>
        {linkLabel}
      </Link>
    </p>
  );
}
