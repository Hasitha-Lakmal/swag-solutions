import { Link, useLocation } from "react-router-dom";
import { Grid2x2 } from "lucide-react";
import { isCardsSite, cardsPrefix } from "../../utils/site";

export default function WeddingTemplateSwitcher({ active }) {
  const location = useLocation();
  const selectTo = { pathname: isCardsSite ? "/" : cardsPrefix };
  const accent = active === "classic" ? "#2a4a1e" : "#0e2444";

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 999, padding: 5, boxShadow: "0 12px 34px rgba(0,0,0,.14)" }}>
        <Link
          to={selectTo}
          title="All templates"
          style={{
            width: 34, height: 34, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#64748b", textDecoration: "none", marginRight: 2,
            transition: "all .25s",
          }}
        >
          <Grid2x2 size={16} />
        </Link>
        {[["classic", "Classic"], ["navy", "Navy"]].map(([name, lbl]) => {
          const isActive = active === name;
          return (
            <Link
              key={name}
              to={{ pathname: `${cardsPrefix}/${name}`, search: location.search }}
              style={{
                padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                fontFamily: "'Jost',sans-serif", letterSpacing: ".04em", textDecoration: "none",
                textTransform: "uppercase",
                background: isActive ? accent : "transparent",
                color: isActive ? "#ffffff" : "#64748b",
                transition: "all .25s",
              }}
            >
              {lbl}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
