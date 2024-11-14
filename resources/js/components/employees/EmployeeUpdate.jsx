// EmployeeUpdate.jsx

import React, { useState } from 'react';

const EmployeeUpdate = ({ employee, closeModal, updateEmployee }) => {
  const [updatedEmployee, setUpdatedEmployee] = useState({ ...employee });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmployee(updatedEmployee); // Passer l'employé mis à jour au composant parent
    closeModal(); // Fermer la modale après la soumission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-white shadow-lg rounded-lg w-2/3 max-h-[80vh] overflow-y-auto p-6 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Pour Firefox et IE
      >
        {/* Section Titre */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Modifier Fiche de poste</h2>
          <h3 className="text-xl text-green-600 font-semibold">{updatedEmployee.poste}</h3>
        </div>

        {/* Formulaire pour éditer les détails de l'employé */}
        <form onSubmit={handleSubmit}>
          {/* Section Affectation */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Affectation</h4>
            <div className="flex justify-between">
              <label>Service :</label>
              <input
                type="text"
                name="service"
                value={updatedEmployee.service || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Durée Hebdomadaire De Travail :</label>
              <input
                type="text"
                name="dureeTravail"
                value={updatedEmployee.dureeTravail || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
          </div>

          {/* Section Informations */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Informations</h4>
            <div className="flex justify-between">
              <label>Nature Du Poste :</label>
              <input
                type="text"
                name="naturePoste"
                value={updatedEmployee.naturePoste || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Statut Du Poste :</label>
              <input
                type="text"
                name="statutPoste"
                value={updatedEmployee.statutPoste || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Temps De Travail :</label>
              <input
                type="text"
                name="tempsTravail"
                value={updatedEmployee.tempsTravail || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Localisation du Poste :</label>
              <input
                type="text"
                name="localisationPoste"
                value={updatedEmployee.localisationPoste || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Supérieur Hiérarchique Direct :</label>
              <input
                type="text"
                name="superieurDirect"
                value={updatedEmployee.superieurDirect || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
          </div>

          {/* Section Rémunération */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Rémunération Du Poste</h4>
            <div className="flex justify-between">
              <label>Annuel Brut :</label>
              <input
                type="text"
                name="annuelBrut"
                value={updatedEmployee.annuelBrut || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Variable :</label>
              <input
                type="text"
                name="variable"
                value={updatedEmployee.variable || ''}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
          </div>

          {/* Section Autonomie et Responsabilités */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Autonomie et Responsabilités</h4>
            <input
              type="text"
              name="autonomie"
              value={updatedEmployee.autonomie || 'A Compléter'}
              onChange={handleChange}
              className="ml-4 p-2 border rounded-lg w-full"
            />
          </div>

          {/* Section Liaisons Fonctionnelles */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Liaisons Fonctionnelles</h4>
            <div className="flex justify-between">
              <label>Interne À l'Organisation :</label>
              <input
                type="text"
                name="liaisonsInternes"
                value={updatedEmployee.liaisonsInternes || 'Oui'}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <label>Externe À l'Organisation :</label>
              <input
                type="text"
                name="liaisonsExternes"
                value={updatedEmployee.liaisonsExternes || 'Oui'}
                onChange={handleChange}
                className="ml-4 p-2 border rounded-lg w-2/3"
              />
            </div>
          </div>

          {/* Section Missions et Activités */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Missions et Activités du Poste</h4>
            <input
              type="text"
              name="missionsPrincipales"
              value={updatedEmployee.missionsPrincipales || 'A Compléter'}
              onChange={handleChange}
              className="ml-4 p-2 border rounded-lg w-full"
            />
            <input
              type="text"
              name="missionsSpecifiques"
              value={updatedEmployee.missionsSpecifiques || 'A Compléter'}
              onChange={handleChange}
              className="ml-4 p-2 border rounded-lg w-full mt-4"
            />
          </div>

          {/* Section Compétences Requises */}
          <div className="border-t pt-4 pb-4">
            <h4 className="text-lg font-semibold">Compétences Requises</h4>
            <input
              type="text"
              name="competencesSavoirs"
              value={updatedEmployee.competencesSavoirs || 'A Compléter'}
              onChange={handleChange}
              className="ml-4 p-2 border rounded-lg w-full"
            />
            <input
              type="text"
              name="competencesSavoirsFaire"
              value={updatedEmployee.competencesSavoirsFaire || 'A Compléter'}
              onChange={handleChange}
              className="ml-4 p-2 border rounded-lg w-full mt-4"
            />
            <input
              type="text"
              name="competencesSavoirsEtre"
              value={updatedEmployee.competencesSavoirsEtre || 'A Compléter'}
              onChange={handleChange}
              className="ml-4 p-2 border rounded-lg w-full mt-4"
            />
          </div>

          {/* Boutons de soumission et d'annulation */}
          <div className="text-right mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-4"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeUpdate;
