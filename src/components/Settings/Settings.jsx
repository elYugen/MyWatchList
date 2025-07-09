import React from 'react';
import './Settings.css';

function Settings() {

  const handleExport = () => {
    //console.log('Export des données');
    const data = {
      // à remplir
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href =  url;
    a.download = 'WatchListData.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {

  }

  const handleDelete = () => {
    localStorage.clear();
    alert('Données supprimés')
  }

  const exportBug = () => {
    const data = localStorage.getItem('bugReports') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bug-reports.json';
    link.click();
  };

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
        <hr style={{ width: '100%' }} />
        <li className="settingsOptionsLink" onClick={exportBug}>
            <p>Exporter les données de bug</p>
            <p><i className="bi bi-arrow-right"></i></p>
        </li>
      </div>

      <div className="settings">
        {/* Github link and version */}
        <h1>
          <a href="https://github.com/elYugen/AnimeList"><i className="bi bi-github"></i></a>
        </h1>
        <h5>v2025.07.03.2</h5> {/* année mois jours +version */}
      </div>
    </>
  );
};

export default Settings;