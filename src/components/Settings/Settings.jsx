import React from 'react';
import './Settings.css';

function Settings() {

const handleExport = () => {
  const uuid = localStorage.getItem('watchlist_uuid');

  if (!uuid) {
    alert("Aucune donnée à exporter.");
    return;
  }

  const data = {
    watchlist_uuid: uuid
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'WatchListData.json';
  a.click();

  URL.revokeObjectURL(url);
};

const handleImport = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (data.watchlist_uuid) {
        localStorage.setItem('watchlist_uuid', data.watchlist_uuid);
        alert('Importation réussie !');
      } else {
        alert('Fichier invalide (clé watchlist_uuid manquante).');
      }
    } catch (err) {
      alert('Fichier JSON invalide.');
    }
  };

  input.click();
};

const handleDelete = () => {
  localStorage.removeItem('watchlist_uuid');
  alert('watchlist_uuid supprimé du localStorage');
};


  // const exportBug = () => {
  //   const data = localStorage.getItem('bugReports') || '[]';
  //   const blob = new Blob([data], { type: 'application/json' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = 'bug-reports.json';
  //   link.click();
  // };

  return (
    <>
      <div className="settingsOptions">
        <li className="settingsOptionsLink">
            <p>Importer des données existantes</p>
            <p><i className="bi bi-arrow-right"></i></p>
        </li>
        <li className="settingsOptionsLink" onClick={handleExport}>
            <p>Exporter mes données</p>
            <p><i className="bi bi-arrow-right"></i></p>
        </li>
        <li className="settingsOptionsLink" onClick={handleDelete}>
            <p>Supprimer mes données</p>
            <p><i className="bi bi-arrow-right"></i></p>
        </li>
        {/* <hr style={{ width: '100%' }} />
        <li className="settingsOptionsLink" onClick={exportBug}>
            <p>Exporter les données de bug</p>
            <p><i className="bi bi-arrow-right"></i></p>
        </li> */}
      </div>

      <div className="settings">
        {/* Github link and version */}
        <h1>
          <a href="https://github.com/elYugen/AnimeList"><i className="bi bi-github"></i></a>
        </h1>
        <h5>v2025.07.09.3</h5> {/* année mois jours +version */}
      </div>
    </>
  );
};

export default Settings;