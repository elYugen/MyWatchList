import { Link } from "react-router-dom";

function NoPage() {
  return (
      <>
      <div className="nopage">
        <h1>Page non disponible</h1>
        <p>La page que vous essayez de trouver est inaccessible.</p>
        <Link to="/"><u>Retour à l'Accueil</u></Link>
      </div>
      </>
  );
};

export default NoPage;